/**
 * Support-effectiveness update: the observed unsupported result is stored as
 * evidence so the estimate for that support can change.
 *
 * Pure module; `timestamp` comes from the caller. A local in-memory record, not
 * a trained bandit — nothing here learns across sessions.
 */

/** Builds one effectiveness record. */
export function updateSupportEffectiveness({
  learnerId,
  skillId,
  misconceptionId,
  supportType,
  predictedIG,
  observedIG,
  timestamp,
}) {
  return {
    learnerId,
    skillId,
    misconceptionId,
    supportType,
    predictedIG,
    observedIG,
    observationCount: 1,
    updatedAt: timestamp,
  };
}

/**
 * Inserts or merges a record, keyed by learner + skill + misconception + support,
 * so a repeated demo accumulates observations on the same arm. `observedIG` is
 * stored as a running mean.
 */
export function upsertHistory(history = [], record) {
  if (!record) return history;

  const index = history.findIndex(
    (entry) =>
      entry.learnerId === record.learnerId &&
      entry.skillId === record.skillId &&
      entry.misconceptionId === record.misconceptionId &&
      entry.supportType === record.supportType
  );

  if (index === -1) return [...history, record];

  const existing = history[index];
  const observationCount = existing.observationCount + 1;
  const merged = {
    ...existing,
    predictedIG: record.predictedIG,
    observedIG:
      (existing.observedIG * existing.observationCount + record.observedIG) / observationCount,
    observationCount,
    updatedAt: record.updatedAt,
  };

  const next = [...history];
  next[index] = merged;
  return next;
}

/** Interpretive line for the result screen: did the observation beat the prediction? */
export function describePolicyUpdate(record) {
  if (!record) return 'No observation recorded yet.';

  if (record.observedIG > record.predictedIG) {
    return 'Observed independence exceeded the prediction, so the estimate for this support in this context moves up.';
  }
  if (record.observedIG < record.predictedIG) {
    return 'Observed independence fell short of the prediction, so the estimate for this support in this context moves down.';
  }
  return 'Observed independence matched the prediction, so the estimate stays where it is.';
}

export const POLICY_UPDATED_LABEL = 'EFFECTIVENESS ESTIMATE UPDATED';
