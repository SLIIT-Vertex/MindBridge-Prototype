/**
 * Phase state machine. Pure module, kept out of AdaptiveLearningContext so the
 * transition rules can be tested without mounting React.
 */

export const PHASES = [
  'HOME',
  'CURRICULUM',
  'SKILL_OVERVIEW',
  'BASELINE',
  'GAMEPLAY',
  'DIFFICULTY_DETECTED',
  'MISCONCEPTION_UPDATED',
  'SUPPORT_SELECTED',
  'SUPPORT_ACTIVE',
  'SUPPORTED_PRACTICE',
  'SUPPORT_WITHDRAWN',
  'INDEPENDENT_CHECK',
  'RESULT',
  'POLICY_UPDATED',
  'REWARD',
  'SUMMARY',
];

/** Human-readable phase names for the Research View context card. */
export const PHASE_LABELS = {
  HOME: 'Prototype Home',
  CURRICULUM: 'Curriculum Area',
  SKILL_OVERVIEW: 'Skill Overview',
  BASELINE: 'Independent Baseline',
  GAMEPLAY: 'Gamified Practice',
  DIFFICULTY_DETECTED: 'Difficulty Detected',
  MISCONCEPTION_UPDATED: 'Likely Misunderstanding Estimated',
  SUPPORT_SELECTED: 'Support Selected',
  SUPPORT_ACTIVE: 'Support Delivered',
  SUPPORTED_PRACTICE: 'Supported Practice',
  SUPPORT_WITHDRAWN: 'Support Removed',
  INDEPENDENT_CHECK: 'Independent Check',
  RESULT: 'Independence Gain',
  POLICY_UPDATED: 'Support Effectiveness Updated',
  REWARD: 'Reward',
  SUMMARY: 'Research Summary',
};

export function phaseIndex(phase) {
  return PHASES.indexOf(phase);
}

export function phaseLabel(phase) {
  return PHASE_LABELS[phase] ?? phase;
}

/**
 * One step forward, or any rewind so demo controls can replay. Larger forward
 * skips need the `force` flag at the call site.
 */
export function canTransition(from, to) {
  const fromIndex = phaseIndex(from);
  const toIndex = phaseIndex(to);
  if (fromIndex === -1 || toIndex === -1) return false;
  return toIndex <= fromIndex + 1;
}

/** True once the session has reached `target` or moved past it. */
export function hasReachedPhase(current, target) {
  return phaseIndex(current) >= phaseIndex(target);
}
