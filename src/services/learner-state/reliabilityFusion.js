/**
 * Reliability-aware multimodal fusion. Pure module.
 *
 * Visual and behavioural evidence do NOT contribute equally, and their weights
 * are not fixed. Each window recomputes the split from how trustworthy each
 * modality currently is, so one architecture covers a well-lit two-modality
 * session, a backlit face, a quiet opening window and a switched-off camera
 * without any special case living outside this file.
 *
 * Weighting rules:
 *   1. A modality below MIN_USEFUL_RELIABILITY is attenuated faster than
 *      linearly, so a barely-tracking camera cannot quietly hold a third of the
 *      vote.
 *   2. Weights are normalised across whichever modalities survive.
 *   3. If none survive, behaviour takes the whole weight. The behaviour-only
 *      fallback is the same code path, not a separate mode.
 */

import { clamp01, round2 } from './mathUtils';
import { scoreVisualEvidence } from './visualFeatures';
import { scoreBehaviorEvidence } from './behaviorFeatures';

/** Below this a modality is treated as degraded and attenuated. */
export const MIN_USEFUL_RELIABILITY = 0.35;

/** Below this a modality is dropped from the fusion entirely. */
export const DROP_RELIABILITY = 0.12;

/** Reliability under which the camera is reported as Visual Signal Limited. */
export const VISUAL_LIMITED_THRESHOLD = 0.45;

/**
 * Dynamic modality weights for one window.
 *
 * @returns {{visualWeight:number, behaviorWeight:number, mode:string, reason:string}}
 */
export function computeModalityWeights({
  visualReliability = 0,
  behaviorReliability = 0,
  cameraAvailable = true,
} = {}) {
  const visualRaw = cameraAvailable ? clamp01(visualReliability) : 0;
  const behaviorRaw = clamp01(behaviorReliability);

  const visualEffective = attenuate(visualRaw);
  const behaviorEffective = attenuate(behaviorRaw);
  const total = visualEffective + behaviorEffective;

  if (total <= 0) {
    return {
      visualWeight: 0,
      behaviorWeight: 1,
      mode: 'behavior_only',
      reason: 'No modality is currently reliable. Falling back to learning behaviour.',
    };
  }

  const visualWeight = round2(visualEffective / total);
  const behaviorWeight = round2(1 - visualWeight);

  return {
    visualWeight,
    behaviorWeight,
    mode: visualWeight === 0 ? 'behavior_only' : visualWeight >= 0.4 ? 'multimodal' : 'behavior_led',
    reason: describeWeights({ visualRaw, behaviorRaw, visualWeight, cameraAvailable }),
  };
}

/**
 * Quadratic roll-off below MIN_USEFUL_RELIABILITY: at 0.35 a modality keeps its
 * full reliability, at 0.18 about a quarter of it, below DROP_RELIABILITY none.
 */
function attenuate(reliability) {
  if (reliability < DROP_RELIABILITY) return 0;
  if (reliability >= MIN_USEFUL_RELIABILITY) return reliability;
  const ratio = reliability / MIN_USEFUL_RELIABILITY;
  return reliability * ratio;
}

function describeWeights({ visualRaw, behaviorRaw, visualWeight, cameraAvailable }) {
  if (!cameraAvailable) return 'Camera unavailable. Behaviour-only mode.';
  if (visualWeight === 0) return 'Visual signal unusable. Behaviour carries the estimate.';
  if (visualRaw < MIN_USEFUL_RELIABILITY) return 'Visual signal degraded. Visual weight reduced.';
  if (behaviorRaw < MIN_USEFUL_RELIABILITY) {
    return 'Too little behaviour evidence yet. Behaviour weight reduced.';
  }
  return 'Both modalities reliable. Evidence combined.';
}

/**
 * Corroboration floor for disengagement.
 *
 * Looking away is not disengagement. A child can solve a problem while staring at
 * the ceiling. Gaze evidence may only push disengagement past the action
 * threshold when behaviour agrees, so whenever behaviour is reliable AND reports
 * the learner still interacting, the fused estimate is capped below that band.
 */
export const DISENGAGEMENT_CORROBORATION = {
  behaviorReliabilityRequired: 0.4,
  behaviorEvidenceRequired: 0.35,
  cap: 0.45,
};

/** Fuses one window into confusion and disengagement probabilities. */
export function fuseLearnerState({
  visualFeatures,
  behaviorFeatures,
  visualReliability = 0,
  behaviorReliability = 0,
  baselineDeviation = {},
  cameraAvailable = true,
} = {}) {
  const weights = computeModalityWeights({
    visualReliability,
    behaviorReliability,
    cameraAvailable,
  });

  const visualEvidence = cameraAvailable
    ? scoreVisualEvidence(visualFeatures, baselineDeviation)
    : { confusion: null, disengagement: null };
  const behaviorEvidence = scoreBehaviorEvidence(behaviorFeatures, baselineDeviation);

  const confusionProbability = blend(visualEvidence.confusion, behaviorEvidence.confusion, weights);

  let disengagementProbability = blend(
    visualEvidence.disengagement,
    behaviorEvidence.disengagement,
    weights
  );

  const uncorroborated =
    behaviorReliability >= DISENGAGEMENT_CORROBORATION.behaviorReliabilityRequired &&
    (behaviorEvidence.disengagement ?? 0) < DISENGAGEMENT_CORROBORATION.behaviorEvidenceRequired &&
    disengagementProbability > DISENGAGEMENT_CORROBORATION.cap;

  if (uncorroborated) {
    disengagementProbability = DISENGAGEMENT_CORROBORATION.cap;
  }

  return {
    confusionProbability,
    disengagementProbability,
    visualWeight: weights.visualWeight,
    behaviorWeight: weights.behaviorWeight,
    visualReliability: round2(clamp01(cameraAvailable ? visualReliability : 0)),
    behaviorReliability: round2(clamp01(behaviorReliability)),
    fusionMode: weights.mode,
    fusionReason: weights.reason,
    modalityEvidence: { visual: visualEvidence, behavior: behaviorEvidence },
    disengagementCorroborated: !uncorroborated,
  };
}

/** Weighted blend that redistributes weight when a modality has no reading. */
function blend(visualValue, behaviorValue, weights) {
  const hasVisual = visualValue != null && weights.visualWeight > 0;
  const hasBehavior = behaviorValue != null && weights.behaviorWeight > 0;

  if (hasVisual && hasBehavior) {
    return round2(
      clamp01(visualValue * weights.visualWeight + behaviorValue * weights.behaviorWeight)
    );
  }
  if (hasBehavior) return round2(clamp01(behaviorValue));
  if (hasVisual) return round2(clamp01(visualValue));
  return 0;
}
