/** Shared numeric helpers for the learner-state pipeline. Pure module. */

export function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value) {
  return clamp(value ?? 0, 0, 1);
}

export function round2(value) {
  if (value == null || !Number.isFinite(value)) return null;
  return Math.round(value * 100) / 100;
}

/** Deviation in standard deviations, clamped so one wild reading cannot dominate. */
export function zScore(current, mean, sd, limit = 4) {
  if (current == null || mean == null) return 0;
  const spread = sd && sd > 0 ? sd : 1;
  return clamp((current - mean) / spread, -limit, limit);
}

/** Least-squares slope of evenly spaced values; positive means rising. */
export function slope(values = []) {
  const n = values.length;
  if (n < 2) return 0;
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((sum, v) => sum + v, 0) / n;

  let numerator = 0;
  let denominator = 0;
  values.forEach((value, index) => {
    numerator += (index - meanX) * (value - meanY);
    denominator += (index - meanX) ** 2;
  });

  return denominator === 0 ? 0 : numerator / denominator;
}

export function mean(values = []) {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
