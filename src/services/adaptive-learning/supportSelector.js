/**
 * Adaptive Support Selector — a contextual multi-armed bandit simulated with
 * deterministic rules, so a supervisor can see why a support was chosen.
 *
 * Support is selected for its predicted later UNSUPPORTED improvement, not for
 * helping the child answer the current question. Pure module.
 */

import { SUPPORTS } from '../../data/adaptive-learning/learningSupports';

/** Belief threshold above which the rotation-specific policy branch applies. */
export const ROTATION_BELIEF_THRESHOLD = 0.5;

/** Predicted Independence Gain per support, given the learner context. */
export function getSupportPredictions(context = {}) {
  const { skillId, misconceptionBeliefs = {} } = context;

  if (skillId === 'GI-PS-01' && (misconceptionBeliefs.rotationDirection ?? 0) >= ROTATION_BELIEF_THRESHOLD) {
    return { visualRotation: 0.58, guidedReasoning: 0.42, workedExample: 0.31 };
  }

  return { visualRotation: 0.4, guidedReasoning: 0.45, workedExample: 0.35 };
}

/** Supports ranked by predicted Independence Gain, highest first. */
export function rankSupports(predictions = {}) {
  return SUPPORTS.map((support) => ({
    id: support.id,
    key: support.key,
    label: support.label,
    icon: support.icon,
    desc: support.desc,
    predictedIG: predictions[support.key] ?? 0,
  })).sort((a, b) => b.predictedIG - a.predictedIG);
}

/** Picks the support with the highest predicted Independence Gain. */
export function selectSupport(predictions = {}) {
  const ranked = rankSupports(predictions);
  if (ranked.length === 0) return null;

  const winner = ranked[0];
  return {
    id: winner.id,
    key: winner.key,
    label: winner.label,
    icon: winner.icon,
    desc: winner.desc,
    predictedIG: winner.predictedIG,
  };
}

