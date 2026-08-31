/**
 * Scripted demo trajectory. While `demoScenarioEnabled` is on, each item has a
 * pre-decided option and an injected response time, so every run reports the
 * same figures. The learner can still tap freely.
 *
 * Option ids MUST match `patternQuestions.js`.
 */

export const DEMO_BANNER = 'Prototype Demo Scenario Active';

/**
 * questionId -> attempts in order, index 0 being attempt 1. Beyond the scripted
 * attempts the last entry is reused.
 */
export const DEMO_SCRIPT = {
  // --- Independent Baseline: 1 correct of 3 -> Unsupported Before = 33% ---
  'GI-PS-B01': [{ optionId: 'A', responseTimeMs: 15600 }], // wrong  - rotation direction
  'GI-PS-B02': [{ optionId: 'B', responseTimeMs: 12400 }], // right
  'GI-PS-B03': [{ optionId: 'A', responseTimeMs: 16400 }], // wrong  - rotation direction

  // --- Pattern Temple gameplay: 3 related errors -> difficulty detected ---
  'PT-G1-Q1': [
    { optionId: 'A', responseTimeMs: 16200 }, // wrong - error 1
    { optionId: 'C', responseTimeMs: 8400 }, // right  - gate 1 opens
  ],
  'PT-G2-Q1': [
    { optionId: 'B', responseTimeMs: 19100 }, // wrong - error 2
    { optionId: 'B', responseTimeMs: 17500 }, // wrong - error 3 -> DIFFICULTY DETECTED
  ],

  // --- Supported practice: correct, but WITH help ---
  'PT-SP-Q1': [{ optionId: 'B', responseTimeMs: 11200 }],

  // --- Independent Check: 3 of 3 -> Unsupported After = 100% ---
  'GI-PS-I01': [{ optionId: 'A', responseTimeMs: 9800 }],
  'GI-PS-I02': [{ optionId: 'B', responseTimeMs: 8100 }],
  'GI-PS-I03': [{ optionId: 'A', responseTimeMs: 7400 }],
};

/** Expected figures, asserted against `verifyDemoScenario()` by the verify script. */
export const DEMO_EXPECTATIONS = {
  unsupportedBefore: 1 / 3,
  unsupportedAfter: 1,
  baselineAvgResponseTimeMs: 14800,
  gameplayErrorAvgResponseTimeMs: 17600,
  relatedErrorsAtTrigger: 3,
  signalsAtTrigger: 4,
  difficultyConfidence: 0.84,
  beliefPercentages: { rotationDirection: 62, sequenceRule: 23, positionTracking: 10, other: 5 },
  predictedIG: 0.58,
  observedIG: 2 / 3,
  independenceGainPercentagePoints: 67,
};

/** How long to wait before auto-revealing a scripted answer, in ms. */
export const DEMO_AUTO_ANSWER_DELAY_MS = 1400;

/**
 * The scripted trajectory as reducer-executable steps, so a presenter jump lands
 * in a populated state. Each step is tagged with the phase it executes IN, and
 * seeding runs every step whose phase sits strictly before the target — one
 * ordered list serves every jump destination. `sessionReducer` executes it.
 */
export const DEMO_SEED_STEPS = [
  { phase: 'HOME', type: 'phase', to: 'CURRICULUM' },
  { phase: 'CURRICULUM', type: 'phase', to: 'SKILL_OVERVIEW' },
  { phase: 'SKILL_OVERVIEW', type: 'phase', to: 'BASELINE' },

  { phase: 'BASELINE', type: 'answer', questionId: 'GI-PS-B01', attempt: 1 },
  { phase: 'BASELINE', type: 'answer', questionId: 'GI-PS-B02', attempt: 1 },
  { phase: 'BASELINE', type: 'answer', questionId: 'GI-PS-B03', attempt: 1 },

  { phase: 'GAMEPLAY', type: 'answer', questionId: 'PT-G1-Q1', attempt: 1 },
  { phase: 'GAMEPLAY', type: 'answer', questionId: 'PT-G1-Q1', attempt: 2 },
  { phase: 'GAMEPLAY', type: 'answer', questionId: 'PT-G2-Q1', attempt: 1 },
  { phase: 'GAMEPLAY', type: 'answer', questionId: 'PT-G2-Q1', attempt: 2 },

  { phase: 'MISCONCEPTION_UPDATED', type: 'select-support' },

  { phase: 'SUPPORT_ACTIVE', type: 'support-status', status: 'active' },
  { phase: 'SUPPORTED_PRACTICE', type: 'answer', questionId: 'PT-SP-Q1', attempt: 1 },
  { phase: 'SUPPORT_WITHDRAWN', type: 'support-status', status: 'removed' },

  { phase: 'INDEPENDENT_CHECK', type: 'answer', questionId: 'GI-PS-I01', attempt: 1 },
  { phase: 'INDEPENDENT_CHECK', type: 'answer', questionId: 'GI-PS-I02', attempt: 1 },
  { phase: 'INDEPENDENT_CHECK', type: 'answer', questionId: 'GI-PS-I03', attempt: 1 },

  { phase: 'RESULT', type: 'record-independence' },
  { phase: 'POLICY_UPDATED', type: 'update-policy' },
];

/** The scripted attempt for a question, or null when it is not scripted. */
export function getScriptedAttempt(questionId, attemptNumber = 1) {
  const attempts = DEMO_SCRIPT[questionId];
  if (!attempts || attempts.length === 0) return null;
  const index = Math.min(Math.max(attemptNumber, 1) - 1, attempts.length - 1);
  return attempts[index];
}

/**
 * Recomputes the headline figures straight from DEMO_SCRIPT, so editing a
 * response time cannot silently desynchronise them. Used by the verify script.
 */
export function verifyDemoScenario(questionsById) {
  const avg = (values) =>
    values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;

  const baselineIds = ['GI-PS-B01', 'GI-PS-B02', 'GI-PS-B03'];
  const gameplayIds = ['PT-G1-Q1', 'PT-G2-Q1'];
  const independentIds = ['GI-PS-I01', 'GI-PS-I02', 'GI-PS-I03'];

  const scoreOf = (ids) => {
    let correct = 0;
    ids.forEach((id) => {
      const attempt = getScriptedAttempt(id, 1);
      if (questionsById[id]?.correctOption === attempt?.optionId) correct += 1;
    });
    return correct / ids.length;
  };

  const baselineTimes = baselineIds.map((id) => getScriptedAttempt(id, 1).responseTimeMs);

  const gameplayErrorTimes = [];
  gameplayIds.forEach((id) => {
    const question = questionsById[id];
    (DEMO_SCRIPT[id] ?? []).forEach((attempt) => {
      if (question?.correctOption !== attempt.optionId) {
        gameplayErrorTimes.push(attempt.responseTimeMs);
      }
    });
  });

  return {
    unsupportedBefore: scoreOf(baselineIds),
    unsupportedAfter: scoreOf(independentIds),
    baselineAvgResponseTimeMs: avg(baselineTimes),
    gameplayErrorAvgResponseTimeMs: avg(gameplayErrorTimes),
    relatedErrorsAtTrigger: gameplayErrorTimes.length,
  };
}
