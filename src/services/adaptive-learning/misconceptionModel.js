/**
 * Prototype Probabilistic Learner Model. Pure module; `updateBeliefs` never
 * mutates its input.
 *
 * Keeps a distribution over plausible causes of an error instead of labelling
 * the child: each incorrect answer multiplies beliefs by a likelihood vector and
 * renormalises. Not a validated Bayesian network — label it as a prototype
 * wherever it surfaces in the UI.
 */

import {
  BELIEF_KEYS,
  DEFAULT_BELIEFS,
  LIKELIHOODS,
  MISCONCEPTIONS,
  getMisconceptionByKey,
} from '../../data/adaptive-learning/misconceptions';

/** Rescales a belief map so the values sum to 1. */
export function normalizeBeliefs(beliefs) {
  const total = BELIEF_KEYS.reduce((sum, key) => sum + (beliefs[key] ?? 0), 0);
  if (total <= 0) return { ...DEFAULT_BELIEFS };

  const normalized = {};
  BELIEF_KEYS.forEach((key) => {
    normalized[key] = (beliefs[key] ?? 0) / total;
  });
  return normalized;
}

/** Unknown or null error codes leave the distribution untouched. */
export function updateBeliefs(beliefs, errorCode) {
  const likelihood = LIKELIHOODS[errorCode];
  if (!likelihood) return { ...beliefs };

  const weighted = {};
  BELIEF_KEYS.forEach((key) => {
    weighted[key] = (beliefs[key] ?? 0) * (likelihood[key] ?? 1);
  });

  return normalizeBeliefs(weighted);
}

/** The most probable misunderstanding, with its label and M-id attached. */
export function topBelief(beliefs) {
  let bestKey = BELIEF_KEYS[0];
  BELIEF_KEYS.forEach((key) => {
    if ((beliefs[key] ?? 0) > (beliefs[bestKey] ?? 0)) bestKey = key;
  });

  const misconception = getMisconceptionByKey(bestKey);
  return {
    key: bestKey,
    label: misconception?.label ?? bestKey,
    misconceptionId: misconception?.id ?? null,
    probability: beliefs[bestKey] ?? 0,
  };
}

/**
 * Integer percentages via largest-remainder rounding, so the bars total exactly
 * 100 — naive Math.round can yield 99 or 101.
 */
export function toPercentages(beliefs) {
  const raw = BELIEF_KEYS.map((key) => {
    const value = (beliefs[key] ?? 0) * 100;
    const floor = Math.floor(value);
    return { key, floor, remainder: value - floor };
  });

  const result = {};
  raw.forEach((entry) => {
    result[entry.key] = entry.floor;
  });

  const deficit = 100 - raw.reduce((sum, entry) => sum + entry.floor, 0);

  // Ties break on the canonical key order, keeping the output deterministic.
  const byRemainder = [...raw].sort(
    (a, b) => b.remainder - a.remainder || BELIEF_KEYS.indexOf(a.key) - BELIEF_KEYS.indexOf(b.key)
  );

  for (let i = 0; i < deficit && i < byRemainder.length; i += 1) {
    result[byRemainder[i].key] += 1;
  }

  return result;
}

/** Display-ready rows for MisconceptionBeliefBars, most likely first. */
export function toBeliefRows(beliefs) {
  const percentages = toPercentages(beliefs);
  return MISCONCEPTIONS.map((misconception) => ({
    id: misconception.id,
    key: misconception.key,
    label: misconception.label,
    desc: misconception.desc,
    probability: beliefs[misconception.key] ?? 0,
    percentage: percentages[misconception.key] ?? 0,
  })).sort((a, b) => b.probability - a.probability);
}
