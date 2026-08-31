/**
 * Persistence trajectory analysis. Pure module.
 *
 * Confusion on its own does not justify an interruption. What separates useful
 * struggle from stuck struggle is whether the learner is STILL TRYING, and
 * whether that effort is holding up or draining away across windows.
 *
 * Persistence is scored per window, then a trend is fitted across the recent
 * history. The decision stage consumes the trend, never a single window.
 */

import { clamp01, mean, round2, slope } from './mathUtils';

export const PERSISTENCE_TREND = {
  RISING: 'rising',
  STEADY: 'steady',
  FALLING: 'falling',
  UNKNOWN: 'unknown',
};

export const PERSISTENCE_TREND_LABELS = {
  [PERSISTENCE_TREND.RISING]: 'Rising',
  [PERSISTENCE_TREND.STEADY]: 'Steady',
  [PERSISTENCE_TREND.FALLING]: 'Falling',
  [PERSISTENCE_TREND.UNKNOWN]: 'Not yet observed',
};

/** Windows needed before a trend is reported rather than guessed. */
export const TREND_MIN_WINDOWS = 3;

/** Slope beyond which the trajectory counts as moving rather than steady. */
export const TREND_SLOPE_THRESHOLD = 0.04;

/**
 * Persistence for one window: is the learner still engaging with the task?
 *
 * Attempting and re-attempting RAISES persistence even though the same events
 * raise confusion. That is the intended tension: a learner making repeated
 * attempts is confused and persisting, which is productive confusion. A learner
 * who has stopped attempting is confused and no longer persisting, which is not.
 */
export function scorePersistence({ behaviorFeatures, baselineDeviation = {}, visualFeatures } = {}) {
  const behavior = behaviorFeatures ?? {};

  const stillAttempting = clamp01((behavior.interactionCount ?? 0) / 3);
  const effortfulRetries = clamp01((behavior.repeatedAttempts ?? 0) / 3);
  const interactionRate = clamp01(0.5 + (baselineDeviation.interactionsPerMinuteZ ?? 0) / 4);
  const idleDrain = clamp01((baselineDeviation.inactivitySecZ ?? 0) / 3);
  const skipDrain = clamp01((behavior.skips ?? 0) / 2);

  // Gaze contributes only a small nudge, and only when the camera actually saw
  // something. Persistence is fundamentally a behavioural construct here.
  const gazeSupport =
    visualFeatures && visualFeatures.framesAnalysed > 0
      ? clamp01(visualFeatures.gazeOnTaskRatio ?? 0.5)
      : null;

  let score =
    0.3 * stillAttempting +
    0.22 * effortfulRetries +
    0.28 * interactionRate +
    0.2 * (1 - idleDrain);

  score -= 0.25 * skipDrain;

  if (gazeSupport != null) {
    score = 0.88 * score + 0.12 * gazeSupport;
  }

  return round2(clamp01(score));
}

/**
 * Fits a trend across the persistence scores of recent windows.
 *
 * @param {Array} history - closed TemporalWindows, oldest first
 * @param {number} currentScore - persistence for the window being decided
 */
export function analysePersistenceTrend(history = [], currentScore = null) {
  const scores = history
    .map((window) => window?.persistenceScore)
    .filter((value) => value != null);

  if (currentScore != null) scores.push(currentScore);

  const recent = scores.slice(-5);

  if (recent.length < TREND_MIN_WINDOWS) {
    return {
      trend: PERSISTENCE_TREND.UNKNOWN,
      slope: 0,
      current: currentScore,
      average: recent.length > 0 ? round2(mean(recent)) : null,
      windowsObserved: recent.length,
      windowsRequired: TREND_MIN_WINDOWS,
      series: recent,
    };
  }

  const fitted = slope(recent);
  let trend = PERSISTENCE_TREND.STEADY;
  if (fitted <= -TREND_SLOPE_THRESHOLD) trend = PERSISTENCE_TREND.FALLING;
  else if (fitted >= TREND_SLOPE_THRESHOLD) trend = PERSISTENCE_TREND.RISING;

  return {
    trend,
    slope: round2(fitted),
    current: currentScore,
    average: round2(mean(recent)),
    windowsObserved: recent.length,
    windowsRequired: TREND_MIN_WINDOWS,
    series: recent,
  };
}
