/**
 * Learning-behaviour feature pipeline. Pure module.
 *
 * Consumes the interaction events the Gamified Learning Module already emits
 * (answer, attempt, hint request, skip, idle tick) and aggregates them across one
 * temporal window. No single event becomes a state on its own.
 *
 * REPLACING THE MOCK: nothing here is mocked. `aggregateBehaviorEvents` runs on
 * real events today; the demo scenarios simply hand it a pre-aggregated window.
 */

import { clamp01, round2 } from './mathUtils';

export const BEHAVIOR_EVENT_TYPES = {
  ANSWER: 'answer',
  ATTEMPT: 'attempt',
  HINT: 'hint',
  SKIP: 'skip',
  COMPLETE: 'complete',
};

export const EMPTY_BEHAVIOR_FEATURES = {
  responseTimeSec: 0,
  incorrectAttempts: 0,
  repeatedAttempts: 0,
  hintRequests: 0,
  inactivitySec: 0,
  recentAccuracy: null,
  taskCompletionRatio: null,
  interactionCount: 0,
  interactionsPerMinute: 0,
  skips: 0,
};

/**
 * Folds a window's worth of raw events into the behaviour feature vector.
 *
 * @param {Array} events   - interaction events inside the window
 * @param {object} context - `{ windowSeconds, idleSeconds, recentAccuracy, taskCompletionRatio }`
 */
export function aggregateBehaviorEvents(events = [], context = {}) {
  const windowSeconds = context.windowSeconds ?? 20;

  const answers = events.filter((e) => e.type === BEHAVIOR_EVENT_TYPES.ANSWER);
  const incorrectAttempts = answers.filter((e) => e.isCorrect === false).length;
  const hintRequests = events.filter((e) => e.type === BEHAVIOR_EVENT_TYPES.HINT).length;
  const skips = events.filter((e) => e.type === BEHAVIOR_EVENT_TYPES.SKIP).length;

  // "Repeated" means more than one attempt landed on the same item, which is a
  // different signal from simply getting several different items wrong.
  const attemptsByItem = {};
  events.forEach((event) => {
    if (!event.itemId) return;
    attemptsByItem[event.itemId] = (attemptsByItem[event.itemId] ?? 0) + 1;
  });
  const repeatedAttempts = Object.values(attemptsByItem).reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0
  );

  const responseTimes = answers.map((e) => e.responseTimeSec ?? 0).filter((t) => t > 0);
  const responseTimeSec =
    responseTimes.length > 0
      ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
      : 0;

  const interactionCount = events.length;

  return {
    responseTimeSec: round2(responseTimeSec) ?? 0,
    incorrectAttempts,
    repeatedAttempts,
    hintRequests,
    inactivitySec: Math.round(context.idleSeconds ?? 0),
    recentAccuracy: context.recentAccuracy ?? null,
    taskCompletionRatio: context.taskCompletionRatio ?? null,
    interactionCount,
    interactionsPerMinute: round2((interactionCount / windowSeconds) * 60) ?? 0,
    skips,
  };
}

/** Normalises a pre-aggregated window (demo scenarios, replayed sessions). */
export function normaliseBehaviorFeatures(raw = {}, { windowSeconds = 20 } = {}) {
  const merged = { ...EMPTY_BEHAVIOR_FEATURES, ...raw };
  return {
    ...merged,
    interactionsPerMinute:
      raw.interactionsPerMinute ??
      (round2((merged.interactionCount / windowSeconds) * 60) ?? 0),
  };
}

/** Evidence needed before behaviour can carry the estimate on its own. */
export const BEHAVIOR_EVIDENCE_TARGET = 4;

/**
 * How much this window's behaviour reading can be trusted.
 *
 * The subtle case: a silent window is NOT automatically unreliable. Sustained
 * inactivity is itself a strong, well-observed measurement — it is exactly the
 * evidence disengagement needs. What makes behaviour unreliable is a window that
 * is simply too young or too empty to have observed anything either way, such as
 * the first seconds after an activity loads.
 */
export function estimateBehaviorReliability(features, { windowSeconds = 20, windowElapsedSec } = {}) {
  const elapsed = windowElapsedSec ?? windowSeconds;
  const observed = features ?? EMPTY_BEHAVIOR_FEATURES;

  const interactionEvidence = Math.min(observed.interactionCount ?? 0, BEHAVIOR_EVIDENCE_TARGET);
  const answeredEvidence = (observed.responseTimeSec ?? 0) > 0 ? 1 : 0;
  // A long, clean idle stretch is a measurement, not a gap in measurement.
  const idleEvidence = (observed.inactivitySec ?? 0) >= 12 ? 2 : 0;
  const historyEvidence = observed.recentAccuracy != null ? 1 : 0;

  const units = interactionEvidence + answeredEvidence + idleEvidence + historyEvidence;
  const evidenceScore = clamp01(units / (BEHAVIOR_EVIDENCE_TARGET + 2));

  // A window that has barely started cannot be fully trusted however busy it is.
  const maturity = clamp01(elapsed / Math.max(1, windowSeconds));

  const score = clamp01(0.15 + 0.85 * evidenceScore * (0.4 + 0.6 * maturity));

  return {
    score: round2(score),
    units,
    reason: describeBehaviorReliability(score, observed),
    terms: [
      { key: 'interactions', label: 'Interactions in window', value: observed.interactionCount ?? 0 },
      { key: 'responses', label: 'Completed responses', value: answeredEvidence },
      { key: 'idle', label: 'Sustained inactivity observed', value: idleEvidence > 0 ? 1 : 0 },
      { key: 'history', label: 'Recent performance available', value: historyEvidence },
    ],
  };
}

function describeBehaviorReliability(score, features) {
  if (score >= 0.7) return 'Strong interaction evidence';
  if (score >= 0.45) return 'Moderate interaction evidence';
  if ((features.interactionCount ?? 0) === 0 && (features.inactivitySec ?? 0) < 12) {
    return 'Too little behaviour evidence yet';
  }
  return 'Sparse interaction evidence';
}

/**
 * Behaviour evidence for each state, before any weighting.
 *
 * Every term that could differ between learners is read from the baseline
 * deviation rather than from the raw value, so a 30-second response is only
 * "slow" relative to the learner who produced it.
 */
export function scoreBehaviorEvidence(features, deviation = {}) {
  const observed = features ?? EMPTY_BEHAVIOR_FEATURES;

  const slowForThisLearner = clamp01((deviation.responseTimeSecZ ?? 0) / 3);
  const attemptPressure = clamp01((observed.incorrectAttempts + observed.repeatedAttempts) / 5);
  const hintPressure = clamp01((deviation.hintsPerActivityZ ?? 0) / 3);
  const accuracyDrop = clamp01(-(deviation.recentAccuracyZ ?? 0) / 3);

  const confusion = clamp01(
    0.34 * slowForThisLearner +
      0.3 * attemptPressure +
      0.16 * hintPressure +
      0.2 * accuracyDrop
  );

  const idleForThisLearner = clamp01((deviation.inactivitySecZ ?? 0) / 3);
  const interactionCollapse = clamp01(-(deviation.interactionsPerMinuteZ ?? 0) / 3);
  const skipPressure = clamp01((observed.skips ?? 0) / 2);
  const stalled = (observed.interactionCount ?? 0) === 0 ? 0.2 : 0;

  const disengagement = clamp01(
    0.4 * idleForThisLearner +
      0.3 * interactionCollapse +
      0.2 * skipPressure +
      stalled
  );

  return { confusion: round2(confusion), disengagement: round2(disengagement) };
}
