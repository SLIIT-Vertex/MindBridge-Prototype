/**
 * Independence Gain = Unsupported After - Unsupported Before.
 *
 * The central research measure: two UNSUPPORTED measurements either side of a
 * support episode, so it speaks to durable learning rather than momentary
 * success. Scores are 0..1 fractions internally. Pure module.
 */

/** Null when either score is missing, so the gain is never computed too early. */
export function calculateIndependenceGain(before, after) {
  if (before == null || after == null) return null;

  return {
    before,
    after,
    gain: after - before,
  };
}

/** Rounds a 0..1 fraction to a whole percentage. */
export function toPercentage(fraction) {
  if (fraction == null) return null;
  return Math.round(fraction * 100);
}

/** The gain in percentage points: 1 - 1/3 = 0.666... -> 67 pp. */
export function toPercentagePoints(gain) {
  if (gain == null) return null;
  return Math.round(gain * 100);
}

/** Display-ready summary for IndependenceGainChart. */
export function formatIndependenceGain(result) {
  if (!result) {
    return {
      available: false,
      beforePercent: null,
      afterPercent: null,
      gainPoints: null,
      gainLabel: 'Not yet observed',
      improved: false,
    };
  }

  const gainPoints = toPercentagePoints(result.gain);
  const sign = gainPoints > 0 ? '+' : '';

  return {
    available: true,
    beforePercent: toPercentage(result.before),
    afterPercent: toPercentage(result.after),
    gainPoints,
    gainLabel: `${sign}${gainPoints} pp`,
    improved: result.gain > 0,
  };
}

/** Result-screen phrasing that avoids claiming mastery from a single session. */
export function describeIndependenceGain(result) {
  if (!result) return 'Independence Gain is not available until both unsupported checks are complete.';
  if (result.gain > 0) {
    return 'The learner now solves equivalent pattern problems more successfully without learning support.';
  }
  if (result.gain === 0) {
    return 'Unsupported performance was unchanged after the support episode.';
  }
  return 'Unsupported performance did not improve after the support episode.';
}
