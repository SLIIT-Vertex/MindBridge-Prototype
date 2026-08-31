/**
 * Visual feature pipeline. Pure module.
 *
 * WHAT THIS LAYER IS ALLOWED TO PRODUCE: six derived measurements, nothing else.
 * There is no identity recognition, no embedding, no stored frame. A raw frame
 * exists only inside `deriveVisualFeatures` and is discarded on return, which is
 * the technical form of the privacy claim shown in the UI.
 *
 * REPLACING THE MOCK: `deriveVisualFeatures` is the single seam. Give it a real
 * landmark/gaze inference result and every stage downstream is unchanged, because
 * everything after this point consumes the normalised feature object below.
 */

import { clamp01, round2 } from './mathUtils';

/** Every value is normalised 0..1 so reliability and fusion can stay unit-free. */
export const VISUAL_FEATURE_SHAPE = {
  eyeOpenness: 'Mean eyelid aperture over the window (1 = wide open)',
  gazeOnTaskRatio: 'Fraction of the window with gaze inside the task area',
  headStability: 'Head pose held towards the screen (1 = stable and oriented)',
  facialDynamics: 'Brow / mouth activity associated with effort (1 = highly active)',
  faceVisibilityRatio: 'Fraction of analysed frames containing a detected face',
  landmarkConfidence: 'Mean tracker confidence across detected frames',
};

export const EMPTY_VISUAL_FEATURES = {
  eyeOpenness: null,
  gazeOnTaskRatio: null,
  headStability: null,
  facialDynamics: null,
  faceVisibilityRatio: 0,
  landmarkConfidence: 0,
  illuminationQuality: 0,
  framesAnalysed: 0,
};

/**
 * The seam a real model plugs into.
 *
 * @param {object} input - `{ frameStats }` from a live tracker, or `{ simulated }`
 *   readings while the model is not yet wired up.
 * @returns {object} normalised visual features, or EMPTY_VISUAL_FEATURES when no
 *   usable frame was seen in the window.
 */
export function deriveVisualFeatures(input = {}) {
  const source = input.frameStats ?? input.simulated;
  if (!source) return { ...EMPTY_VISUAL_FEATURES };

  return {
    eyeOpenness: clamp01(source.eyeOpenness),
    gazeOnTaskRatio: clamp01(source.gazeOnTaskRatio),
    headStability: clamp01(source.headStability),
    facialDynamics: clamp01(source.facialDynamics),
    faceVisibilityRatio: clamp01(source.faceVisibilityRatio),
    landmarkConfidence: clamp01(source.landmarkConfidence),
    illuminationQuality: clamp01(source.illuminationQuality ?? source.landmarkConfidence),
    framesAnalysed: Math.max(0, Math.round(source.framesAnalysed ?? 0)),
  };
}

/** Frames expected in one window at ~15fps; below this the sample is too thin. */
export const EXPECTED_FRAMES = 200;

/**
 * Simulates a degraded capture path: backlighting, a partly out-of-frame face, a
 * tracker losing lock. Applied to the FEATURES, before reliability is estimated,
 * so a presenter selecting "Visual Signal Limited" produces genuinely poorer
 * readings rather than a relabelled chip over a perfect signal.
 */
export function degradeVisualFeatures(features, factor = 0.35) {
  if (!features || features.framesAnalysed === 0) return features;
  return {
    ...features,
    faceVisibilityRatio: clamp01(features.faceVisibilityRatio * factor),
    landmarkConfidence: clamp01(features.landmarkConfidence * factor),
    illuminationQuality: clamp01(features.illuminationQuality * factor),
  };
}

const RELIABILITY_TERMS = [
  { key: 'faceVisibilityRatio', weight: 0.38, label: 'Face visible in frame' },
  { key: 'landmarkConfidence', weight: 0.32, label: 'Landmark tracking confidence' },
  { key: 'illuminationQuality', weight: 0.2, label: 'Lighting quality' },
  { key: 'sampleAdequacy', weight: 0.1, label: 'Frames analysed in window' },
];

/**
 * How much this window's visual reading can be trusted.
 *
 * Deliberately NOT the same thing as the state estimate: a confident tracker on
 * a clearly-lit face scores high whether the child is confused or not. Reliability
 * answers "can we see?", the fusion stage answers "what does it mean?".
 *
 * Returns 0 when the camera is unavailable, which drives the behaviour-only path.
 */
export function estimateVisualReliability(features, { cameraAvailable = true } = {}) {
  if (!cameraAvailable || !features || features.framesAnalysed === 0) {
    return { score: 0, terms: RELIABILITY_TERMS.map((t) => ({ ...t, value: 0 })), reason: 'No visual signal' };
  }

  const sampleAdequacy = clamp01(features.framesAnalysed / EXPECTED_FRAMES);
  const values = { ...features, sampleAdequacy };

  const terms = RELIABILITY_TERMS.map((term) => ({
    ...term,
    value: clamp01(values[term.key] ?? 0),
  }));

  const score = clamp01(terms.reduce((sum, term) => sum + term.value * term.weight, 0));

  return { score: round2(score), terms, reason: describeVisualReliability(score, terms) };
}

function describeVisualReliability(score, terms) {
  if (score >= 0.7) return 'Face clearly tracked';
  const weakest = terms.reduce((worst, term) => (term.value < worst.value ? term : worst));
  if (score >= 0.4) return `Partly degraded — ${weakest.label.toLowerCase()} low`;
  return `Unusable — ${weakest.label.toLowerCase()} low`;
}

/**
 * Visual evidence for each state, before any weighting. Returned separately from
 * reliability so the research view can show what the camera thought even when
 * that opinion was then down-weighted to almost nothing.
 */
export function scoreVisualEvidence(features, baselineDeviation = {}) {
  if (!features || features.framesAnalysed === 0) {
    return { confusion: null, disengagement: null };
  }

  const gazeOff = 1 - (features.gazeOnTaskRatio ?? 0.5);
  const gazeBelowOwnNorm = clamp01((baselineDeviation.gazeOnTaskRatioZ ?? 0) * -0.3);

  // Effortful confusion looks like: high facial activity, gaze still broadly on
  // task, head held but unsettled. Looking away hard is the disengagement shape,
  // not the confusion shape, so on-task gaze is a positive term here.
  const confusion = clamp01(
    0.55 * (features.facialDynamics ?? 0) +
      0.25 * clamp01(1 - (features.headStability ?? 0.5)) +
      0.2 * clamp01(features.gazeOnTaskRatio ?? 0.5)
  );

  // Disengagement looks like: gaze away, flat face, head drifting, eyes closing.
  const disengagement = clamp01(
    0.4 * gazeOff +
      0.2 * clamp01(1 - (features.facialDynamics ?? 0)) +
      0.2 * clamp01(1 - (features.headStability ?? 0.5)) +
      0.1 * clamp01(1 - (features.eyeOpenness ?? 0.8)) +
      0.1 * gazeBelowOwnNorm
  );

  return { confusion: round2(confusion), disengagement: round2(disengagement) };
}
