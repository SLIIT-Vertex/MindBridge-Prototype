/**
 * Learner-specific baseline comparison. Pure module.
 *
 * THE CORE CLAIM OF THIS COMPONENT: there is no universal threshold. Every
 * behavioural and visual reading is converted into a deviation from THIS
 * learner's own history before any state logic touches it.
 *
 *   Kavindu — typical response 18s (sd 5)  → a 20s response is +0.40 sigma
 *   Nethmi  — typical response  7s (sd 4)  → a 20s response is +3.25 sigma
 *
 * Same observation, opposite meaning. Downstream stages read only the z-scores
 * produced here, which is what makes the difference structural rather than a
 * label on a screen.
 */

import { BASELINE_FIELDS, getLearnerBaseline } from '../../data/learner-state/learnerBaselines';
import { clamp01, round2, zScore } from './mathUtils';

/** Maps a window's features onto the baseline field names. */
export function toBaselineObservation(window = {}) {
  const behavior = window.behaviorFeatures ?? {};
  const visual = window.visualFeatures ?? {};

  return {
    responseTimeSec: behavior.responseTimeSec || null,
    inactivitySec: behavior.inactivitySec ?? null,
    attemptsPerItem:
      behavior.interactionCount > 0
        ? 1 + (behavior.repeatedAttempts ?? 0) / Math.max(1, behavior.interactionCount)
        : null,
    recentAccuracy: behavior.recentAccuracy ?? null,
    hintsPerActivity: behavior.hintRequests ?? null,
    interactionsPerMinute: behavior.interactionsPerMinute ?? null,
    gazeOnTaskRatio: visual.framesAnalysed > 0 ? visual.gazeOnTaskRatio : null,
  };
}

/**
 * Compares one temporal window against the learner's own baseline.
 *
 * @param {object} currentWindow  - a TemporalWindow (or `{ behaviorFeatures, visualFeatures }`)
 * @param {object} learnerBaseline - from `getLearnerBaseline(learnerId)`
 * @returns {object} z-scores per field plus a rolled-up deviation score
 */
export function compareWithLearnerBaseline(currentWindow, learnerBaseline) {
  const baseline = learnerBaseline ?? getLearnerBaseline();
  const observation = toBaselineObservation(currentWindow);

  const fields = BASELINE_FIELDS.map((field) => {
    const current = observation[field.key];
    const typical = baseline.typical[field.key];
    const sd = baseline.sd[field.key];
    const observed = current != null && Number.isFinite(current);
    const z = observed ? zScore(current, typical, sd) : 0;

    // "Struggle direction" normalises sign, so accuracy dropping and response
    // time rising both read as positive pressure.
    const struggleZ = field.higherIsStruggle ? z : -z;

    return {
      key: field.key,
      label: field.label,
      unit: field.unit,
      observed,
      current: observed ? round2(current) : null,
      typical: round2(typical),
      sd: round2(sd),
      z: round2(z) ?? 0,
      struggleZ: round2(struggleZ) ?? 0,
      atypical: observed && Math.abs(z) >= ATYPICAL_SIGMA,
      direction: !observed ? 'unknown' : z > 0 ? 'above' : z < 0 ? 'below' : 'at',
    };
  });

  const byKey = {};
  fields.forEach((field) => {
    byKey[`${field.key}Z`] = field.z;
  });

  const behaviourFields = fields.filter((f) => f.key !== 'gazeOnTaskRatio' && f.observed);
  const visualFields = fields.filter((f) => f.key === 'gazeOnTaskRatio' && f.observed);

  return {
    learnerId: baseline.learnerId,
    learnerName: baseline.learnerName,
    sessionsObserved: baseline.sessionsObserved,
    fields,
    ...byKey,
    behaviourDeviationScore: deviationScore(behaviourFields),
    visualDeviationScore: deviationScore(visualFields),
    atypicalCount: fields.filter((f) => f.atypical).length,
    summary: summarise(fields),
  };
}

/** Sigma beyond which a reading counts as atypical for this learner. */
export const ATYPICAL_SIGMA = 1.5;

/** Mean struggle-direction pressure, mapped 0..1 across a +-3 sigma span. */
function deviationScore(fields) {
  if (fields.length === 0) return 0;
  const total = fields.reduce((sum, field) => sum + Math.max(0, field.struggleZ), 0);
  return round2(clamp01(total / (fields.length * 3)));
}

function summarise(fields) {
  const atypical = fields
    .filter((field) => field.atypical)
    .sort((a, b) => Math.abs(b.z) - Math.abs(a.z));

  if (atypical.length === 0) return 'Within this learner\u2019s usual range';

  const top = atypical[0];
  return `${top.label} ${top.direction} own norm (${top.z > 0 ? '+' : ''}${top.z.toFixed(1)}\u03C3)`;
}

/**
 * The demonstration used on the research screens: one reading interpreted
 * against two different learners.
 */
export function contrastAcrossLearners(fieldKey, value, learnerIds = []) {
  return learnerIds.map((learnerId) => {
    const baseline = getLearnerBaseline(learnerId);
    const z = zScore(value, baseline.typical[fieldKey], baseline.sd[fieldKey]);
    return {
      learnerId,
      learnerName: baseline.learnerName,
      typical: baseline.typical[fieldKey],
      sd: baseline.sd[fieldKey],
      z: round2(z),
      atypical: Math.abs(z) >= ATYPICAL_SIGMA,
    };
  });
}
