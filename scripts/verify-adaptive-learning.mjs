/**
 * Phase 1 verification for the Adaptive Learning research logic.
 *
 * The services under src/services/adaptive-learning/ are pure ESM with no React
 * imports, so they can be exercised directly in Node. This asserts every number
 * the brief quotes, which means a future edit to a likelihood weight or a
 * scripted response time cannot silently desynchronise the demo.
 *
 * Run with:  node scripts/verify-adaptive-learning.mjs
 */

import { DEFAULT_BELIEFS, ERROR_CODES } from '../src/data/adaptive-learning/misconceptions.js';
import {
  ALL_QUESTIONS,
  BASELINE_QUESTIONS,
  GAMEPLAY_QUESTIONS,
  INDEPENDENT_QUESTIONS,
  SUPPORTED_QUESTIONS,
  getQuestion,
} from '../src/data/adaptive-learning/patternQuestions.js';
import {
  DEMO_EXPECTATIONS,
  DEMO_SCRIPT,
  getScriptedAttempt,
  verifyDemoScenario,
} from '../src/data/adaptive-learning/demoScenario.js';
import {
  toPercentages,
  topBelief,
  updateBeliefs,
} from '../src/services/adaptive-learning/misconceptionModel.js';
import {
  buildEvidence,
  detectDifficulty,
} from '../src/services/adaptive-learning/difficultyDetector.js';
import {
  getSupportPredictions,
  selectSupport,
} from '../src/services/adaptive-learning/supportSelector.js';
import {
  calculateIndependenceGain,
  toPercentagePoints,
} from '../src/services/adaptive-learning/independenceGain.js';
import { updateSupportEffectiveness } from '../src/services/adaptive-learning/policyUpdater.js';
import { canTransition } from '../src/services/adaptive-learning/phaseMachine.js';
import {
  adaptiveReducer,
  createInitialState,
} from '../src/services/adaptive-learning/sessionReducer.js';
import { SUPPORT_STATUS } from '../src/data/adaptive-learning/learningSupports.js';

let failures = 0;

function check(label, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (!pass) failures += 1;
  const mark = pass ? 'PASS' : 'FAIL';
  const detail = pass ? `${JSON.stringify(actual)}` : `got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`;
  console.log(`  [${mark}] ${label}: ${detail}`);
}

function checkTrue(label, actual) {
  check(label, Boolean(actual), true);
}

function near(actual, expected, tolerance = 1e-9) {
  return Math.abs(actual - expected) <= tolerance;
}

function checkNear(label, actual, expected, tolerance = 1e-9) {
  const pass = near(actual, expected, tolerance);
  if (!pass) failures += 1;
  console.log(
    `  [${pass ? 'PASS' : 'FAIL'}] ${label}: ${actual}${pass ? '' : ` (want ~${expected})`}`
  );
}

const questionsById = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));

// ---------------------------------------------------------------- data integrity
console.log('\nData integrity');

check('question count', ALL_QUESTIONS.length, 9);
check('baseline items', BASELINE_QUESTIONS.length, 3);
check('gameplay items', GAMEPLAY_QUESTIONS.length, 2);
check('supported items', SUPPORTED_QUESTIONS.length, 1);
check('independent items', INDEPENDENT_QUESTIONS.length, 3);

check('unique question ids', new Set(ALL_QUESTIONS.map((q) => q.id)).size, ALL_QUESTIONS.length);

// Every question must have exactly one correct option, and every distractor an error code.
let optionShapeOk = true;
ALL_QUESTIONS.forEach((q) => {
  const correct = q.options.filter((o) => o.id === q.correctOption);
  if (correct.length !== 1) optionShapeOk = false;
  if (correct[0]?.errorCode !== null) optionShapeOk = false;
  q.options.forEach((o) => {
    if (o.id !== q.correctOption && !o.errorCode) optionShapeOk = false;
  });
});
checkTrue('every question has 1 correct option and all distractors carry error codes', optionShapeOk);

// No two questions may present the identical symbol + sequence, or the "parallel
// forms" claim behind Independence Gain collapses.
const signatures = ALL_QUESTIONS.map(
  (q) => `${q.sequence.map((s) => `${s.symbol}:${s.rotation ?? s.order}`).join('>')}`
);
check('no duplicate sequences across the whole bank', new Set(signatures).size, signatures.length);

// Independent-check items must not reuse any earlier sequence.
const earlier = new Set(
  [...BASELINE_QUESTIONS, ...GAMEPLAY_QUESTIONS, ...SUPPORTED_QUESTIONS].map(
    (q) => `${q.sequence.map((s) => `${s.symbol}:${s.rotation ?? s.order}`).join('>')}`
  )
);
checkTrue(
  'independent items are parallel forms, not repeats',
  INDEPENDENT_QUESTIONS.every(
    (q) => !earlier.has(`${q.sequence.map((s) => `${s.symbol}:${s.rotation ?? s.order}`).join('>')}`)
  )
);

// Every scripted question id must exist.
checkTrue(
  'every demo-script id resolves to a real question',
  Object.keys(DEMO_SCRIPT).every((id) => getQuestion(id) !== null)
);

// -------------------------------------------------------------- belief model
console.log('\nMisconception model (plan section 6.3)');

let beliefs = { ...DEFAULT_BELIEFS };
for (let i = 0; i < 3; i += 1) {
  beliefs = updateBeliefs(beliefs, ERROR_CODES.ROTATION_DIRECTION_CONFUSION);
}

check('3 rotation-direction events -> percentages', toPercentages(beliefs), {
  rotationDirection: 62,
  sequenceRule: 23,
  positionTracking: 10,
  other: 5,
});

const pct = toPercentages(beliefs);
check(
  'percentages sum to exactly 100',
  Object.values(pct).reduce((a, b) => a + b, 0),
  100
);

checkNear('rotationDirection posterior', beliefs.rotationDirection, 0.61872, 1e-4);
check('top belief is M1', topBelief(beliefs).misconceptionId, 'M1');

const untouched = { ...DEFAULT_BELIEFS };
updateBeliefs(untouched, ERROR_CODES.ROTATION_DIRECTION_CONFUSION);
check('updateBeliefs does not mutate its input', untouched, DEFAULT_BELIEFS);

check(
  'a correct answer (null error code) leaves beliefs unchanged',
  toPercentages(updateBeliefs(beliefs, null)),
  pct
);

// ---------------------------------------------------------- difficulty detector
console.log('\nDifficulty detector (plan section 6.3)');

const triggerEvidence = buildEvidence({
  relatedErrors: 3,
  errorCodeCounts: { [ERROR_CODES.ROTATION_DIRECTION_CONFUSION]: 3 },
  dominantErrorCode: ERROR_CODES.ROTATION_DIRECTION_CONFUSION,
  avgResponseTimeOnErrorsMs: 17600,
  attemptsOnCurrentItem: 2,
});
const triggered = detectDifficulty(triggerEvidence);

checkTrue('difficulty detected at the third related error', triggered.detected);
check('signals met', triggered.signalsMet, 4);
check('confidence', triggered.confidence, 0.84);

const singleError = detectDifficulty(
  buildEvidence({
    relatedErrors: 1,
    errorCodeCounts: { [ERROR_CODES.ROTATION_DIRECTION_CONFUSION]: 1 },
    dominantErrorCode: ERROR_CODES.ROTATION_DIRECTION_CONFUSION,
    avgResponseTimeOnErrorsMs: 16200,
    attemptsOnCurrentItem: 1,
  })
);
check('one slow error does NOT trigger difficulty', singleError.detected, false);
check('one slow error meets a single signal', singleError.signalsMet, 1);

const twoErrors = detectDifficulty(
  buildEvidence({
    relatedErrors: 2,
    errorCodeCounts: { [ERROR_CODES.ROTATION_DIRECTION_CONFUSION]: 2 },
    dominantErrorCode: ERROR_CODES.ROTATION_DIRECTION_CONFUSION,
    avgResponseTimeOnErrorsMs: 17650,
    attemptsOnCurrentItem: 1,
  })
);
check('two errors on distinct items still do not trigger', twoErrors.detected, false);

// ---------------------------------------------------------------- support selector
console.log('\nSupport selector (brief section 35)');

const predictions = getSupportPredictions({
  skillId: 'GI-PS-01',
  misconceptionBeliefs: beliefs,
});
check('predictions with rotationDirection >= 0.5', predictions, {
  visualRotation: 0.58,
  guidedReasoning: 0.42,
  workedExample: 0.31,
});
check('selected support', selectSupport(predictions).id, 'visual-rotation');
check('selected predicted IG', selectSupport(predictions).predictedIG, 0.58);

check(
  'fallback predictions when belief is below threshold',
  getSupportPredictions({ skillId: 'GI-PS-01', misconceptionBeliefs: DEFAULT_BELIEFS }),
  { visualRotation: 0.4, guidedReasoning: 0.45, workedExample: 0.35 }
);
check(
  'fallback selects guided reasoning',
  selectSupport(getSupportPredictions({ skillId: 'GI-PS-01', misconceptionBeliefs: DEFAULT_BELIEFS }))
    .id,
  'guided-reasoning'
);

// ------------------------------------------------------------- independence gain
console.log('\nIndependence Gain (brief sections 27 and 36)');

const ig = calculateIndependenceGain(1 / 3, 1);
checkNear('gain fraction', ig.gain, 2 / 3, 1e-9);
check('gain in percentage points', toPercentagePoints(ig.gain), 67);
check('null before -> null result', calculateIndependenceGain(null, 1), null);
check('null after -> null result', calculateIndependenceGain(1 / 3, null), null);

// ------------------------------------------------------------------ policy update
console.log('\nPolicy update (brief section 28)');

const record = updateSupportEffectiveness({
  learnerId: 'demo-learner-001',
  skillId: 'GI-PS-01',
  misconceptionId: topBelief(beliefs).misconceptionId,
  supportType: 'visual-rotation',
  predictedIG: 0.58,
  observedIG: ig.gain,
  timestamp: 0,
});
check('record misconception', record.misconceptionId, 'M1');
check('record support', record.supportType, 'visual-rotation');
check('record predicted IG', record.predictedIG, 0.58);
check('observed beat predicted', record.observedIG > record.predictedIG, true);

// ------------------------------------------------------------------ phase machine
console.log('\nPhase machine (brief section 38)');

check('forward one step allowed', canTransition('BASELINE', 'GAMEPLAY'), true);
check('backwards allowed', canTransition('RESULT', 'BASELINE'), true);
check('forward skip blocked', canTransition('BASELINE', 'RESULT'), false);
check('same phase allowed', canTransition('BASELINE', 'BASELINE'), true);
check('unknown phase rejected', canTransition('BASELINE', 'NOPE'), false);

// -------------------------------------------------------------- demo trajectory
console.log('\nScripted demo trajectory (plan section 6.4)');

const scenario = verifyDemoScenario(questionsById);

checkNear('Unsupported Before', scenario.unsupportedBefore, DEMO_EXPECTATIONS.unsupportedBefore);
checkNear('Unsupported After', scenario.unsupportedAfter, DEMO_EXPECTATIONS.unsupportedAfter);
check('baseline average response time (ms)', scenario.baselineAvgResponseTimeMs, 14800);
check('gameplay error average response time (ms)', scenario.gameplayErrorAvgResponseTimeMs, 17600);
check('related errors at trigger', scenario.relatedErrorsAtTrigger, 3);

// Replay the scripted gameplay errors through the real belief model.
let replayBeliefs = { ...DEFAULT_BELIEFS };
['PT-G1-Q1', 'PT-G2-Q1'].forEach((id) => {
  const question = questionsById[id];
  (DEMO_SCRIPT[id] ?? []).forEach((attempt) => {
    if (question.correctOption === attempt.optionId) return;
    const option = question.options.find((o) => o.id === attempt.optionId);
    replayBeliefs = updateBeliefs(replayBeliefs, option.errorCode);
  });
});
check(
  'replaying the scripted gameplay errors reproduces 62/23/10/5',
  toPercentages(replayBeliefs),
  DEMO_EXPECTATIONS.beliefPercentages
);

// Every scripted gameplay error must be a rotation-direction error, or the
// dominant-error-code signal would not fire.
let allRotation = true;
['PT-G1-Q1', 'PT-G2-Q1'].forEach((id) => {
  const question = questionsById[id];
  (DEMO_SCRIPT[id] ?? []).forEach((attempt) => {
    if (question.correctOption === attempt.optionId) return;
    const option = question.options.find((o) => o.id === attempt.optionId);
    if (option.errorCode !== ERROR_CODES.ROTATION_DIRECTION_CONFUSION) allRotation = false;
  });
});
checkTrue('all scripted gameplay errors are rotation-direction errors', allRotation);

// The scripted baseline must produce exactly one correct answer.
const baselineCorrect = BASELINE_QUESTIONS.filter(
  (q) => getScriptedAttempt(q.id, 1).optionId === q.correctOption
).length;
check('scripted baseline correct answers', baselineCorrect, 1);

const independentCorrect = INDEPENDENT_QUESTIONS.filter(
  (q) => getScriptedAttempt(q.id, 1).optionId === q.correctOption
).length;
check('scripted independent-check correct answers', independentCorrect, 3);

// ------------------------------------------- full trajectory through the reducer
console.log('\nFull session replay through the real reducer');

let s = createInitialState();
let clock = 0;

const answer = (questionId, attemptNumber) => {
  const question = questionsById[questionId];
  const attempt = getScriptedAttempt(questionId, attemptNumber);
  clock += attempt.responseTimeMs;
  s = adaptiveReducer(s, {
    type: 'ANSWER_QUESTION',
    payload: {
      question,
      optionId: attempt.optionId,
      responseTimeMs: attempt.responseTimeMs,
      timestamp: clock,
    },
  });
};

const go = (phase) => {
  s = adaptiveReducer(s, { type: 'SET_PHASE', payload: { phase } });
};

// Home -> curriculum -> skill -> baseline
go('CURRICULUM');
go('SKILL_OVERVIEW');
go('BASELINE');
check('phase after navigation', s.phase, 'BASELINE');

// Independent Baseline
answer('GI-PS-B01', 1);
answer('GI-PS-B02', 1);
answer('GI-PS-B03', 1);

checkNear('Unsupported Before from reducer', s.baseline.score, 1 / 3);
check('baseline answered', s.baseline.questionsAnswered, 3);
check('baseline correct', s.baseline.correct, 1);
check('baseline did NOT move beliefs (decision D5)', toPercentages(s.misconceptionBeliefs), {
  rotationDirection: 25,
  sequenceRule: 25,
  positionTracking: 25,
  other: 25,
});
check('baseline did NOT count related errors (decision D5)', s.gameplay.relatedErrors, 0);
check('baseline events are still logged', s.events.length, 3);
check('no difficulty during baseline', s.difficulty.detected, false);

// Pattern Temple
go('GAMEPLAY');

answer('PT-G1-Q1', 1); // error 1
check('one error does not trigger difficulty', s.difficulty.detected, false);
check('related errors after gate 1 miss', s.gameplay.relatedErrors, 1);
check('phase still GAMEPLAY', s.phase, 'GAMEPLAY');

answer('PT-G1-Q1', 2); // correct, gate 1 opens
check('gate 1 second attempt correct', s.events[s.events.length - 1].isCorrect, true);
check('correct answer did not reweight beliefs (decision D6)', s.gameplay.relatedErrors, 1);
check('Gate 1 retry must not trigger difficulty', s.difficulty.detected, false);
check('phase still GAMEPLAY after Gate 1 opens', s.phase, 'GAMEPLAY');

answer('PT-G2-Q1', 1); // error 2
check('two errors on distinct items still no trigger', s.difficulty.detected, false);
check('related errors', s.gameplay.relatedErrors, 2);

answer('PT-G2-Q1', 2); // error 3 -> trigger
checkTrue('difficulty detected on the third related error', s.difficulty.detected);
check('related errors at trigger', s.gameplay.relatedErrors, 3);
check('confidence at trigger', s.difficulty.confidence, 0.84);
check('signals met at trigger', s.difficulty.signalsMet, 4);
check('avg response time on errors (ms)', s.gameplay.avgResponseTimeOnErrorsMs, 17600);
check('dominant error code', s.gameplay.dominantErrorCode, ERROR_CODES.ROTATION_DIRECTION_CONFUSION);
check('reducer auto-advanced the phase', s.phase, 'DIFFICULTY_DETECTED');
check('beliefs after gameplay evidence', toPercentages(s.misconceptionBeliefs), {
  rotationDirection: 62,
  sequenceRule: 23,
  positionTracking: 10,
  other: 5,
});

// Support selection
go('MISCONCEPTION_UPDATED');
s = adaptiveReducer(s, { type: 'SELECT_SUPPORT', payload: {} });
check('selected support', s.selectedSupport.id, 'visual-rotation');
check('predicted IG', s.selectedSupport.predictedIG, 0.58);
check('support predictions stored', s.supportPredictions, {
  visualRotation: 0.58,
  guidedReasoning: 0.42,
  workedExample: 0.31,
});

go('SUPPORT_SELECTED');
go('SUPPORT_ACTIVE');
s = adaptiveReducer(s, {
  type: 'SET_SUPPORT_STATUS',
  payload: { status: SUPPORT_STATUS.ACTIVE },
});

// Supported practice — correct, but WITH help
go('SUPPORTED_PRACTICE');
answer('PT-SP-Q1', 1);
check('supported practice correct', s.supportedPractice.correct, 1);
check('supported event records the active support', s.events[s.events.length - 1].supportType, 'visual-rotation');
checkTrue('supported event flags supportActive', s.events[s.events.length - 1].supportActive);

// The independent check must be blocked while support is still active.
const blocked = adaptiveReducer(s, { type: 'SET_PHASE', payload: { phase: 'SUPPORT_WITHDRAWN' } });
const blockedJump = adaptiveReducer(blocked, {
  type: 'JUMP_TO_PHASE',
  payload: { phase: 'INDEPENDENT_CHECK' },
});
check('INDEPENDENT_CHECK blocked while support is active', blockedJump.phase, 'SUPPORT_WITHDRAWN');

// Withdraw support
go('SUPPORT_WITHDRAWN');
s = adaptiveReducer(s, {
  type: 'SET_SUPPORT_STATUS',
  payload: { status: SUPPORT_STATUS.REMOVED },
});
check('support withdrawn', s.supportStatus, 'removed');

// Independent Check
go('INDEPENDENT_CHECK');
check('independent check entered once support is removed', s.phase, 'INDEPENDENT_CHECK');

answer('GI-PS-I01', 1);
answer('GI-PS-I02', 1);
answer('GI-PS-I03', 1);

check('Unsupported After from reducer', s.independentCheck.score, 1);
checkTrue(
  'no independent event was recorded as supported',
  s.events.filter((e) => e.phase === 'independent').every((e) => e.supportActive === false)
);

// Independence Gain
go('RESULT');
s = adaptiveReducer(s, { type: 'RECORD_INDEPENDENCE' });
checkNear('Independence Gain from reducer', s.independenceGain.gain, 2 / 3);
check('Independence Gain in pp', toPercentagePoints(s.independenceGain.gain), 67);

// Policy update
go('POLICY_UPDATED');
s = adaptiveReducer(s, { type: 'UPDATE_POLICY', payload: { timestamp: clock } });
check('history length', s.supportEffectivenessHistory.length, 1);
check('history support', s.supportEffectivenessHistory[0].supportType, 'visual-rotation');
check('history predicted IG', s.supportEffectivenessHistory[0].predictedIG, 0.58);
checkNear('history observed IG', s.supportEffectivenessHistory[0].observedIG, 2 / 3);
check('history observation count', s.supportEffectivenessHistory[0].observationCount, 1);
check('history misconception', s.supportEffectivenessHistory[0].misconceptionId, 'M1');

// Reward -> Summary
go('REWARD');
go('SUMMARY');
check('final phase', s.phase, 'SUMMARY');
check('total events logged', s.events.length, 11);

// Guards
console.log('\nReducer guards');

const fresh = createInitialState();
const noGain = adaptiveReducer(fresh, { type: 'RECORD_INDEPENDENCE' });
check('Independence Gain refused without both scores', noGain.independenceGain, null);

const noPolicy = adaptiveReducer(fresh, { type: 'UPDATE_POLICY', payload: { timestamp: 0 } });
check('policy refused before Independence Gain', noPolicy.supportEffectivenessHistory.length, 0);

const skipped = adaptiveReducer(fresh, { type: 'SET_PHASE', payload: { phase: 'RESULT' } });
check('forward skip blocked by reducer', skipped.phase, 'HOME');

const forced = adaptiveReducer(fresh, { type: 'JUMP_TO_PHASE', payload: { phase: 'RESULT' } });
check('demo jump allowed with force', forced.phase, 'RESULT');

// Reset preserves presenter toggles.
const toggled = adaptiveReducer(
  adaptiveReducer(s, { type: 'TOGGLE_RESEARCH_VIEW', payload: { enabled: true } }),
  { type: 'TOGGLE_DEMO_SCENARIO', payload: { enabled: false } }
);
const reset = adaptiveReducer(toggled, { type: 'RESET_SESSION' });
check('reset clears the session', reset.events.length, 0);
check('reset returns to HOME', reset.phase, 'HOME');
check('reset keeps researchViewEnabled', reset.researchViewEnabled, true);
check('reset keeps demoScenarioEnabled', reset.demoScenarioEnabled, false);
check('reset clears beliefs', toPercentages(reset.misconceptionBeliefs), {
  rotationDirection: 25,
  sequenceRule: 25,
  positionTracking: 25,
  other: 25,
});

// Retries must never inflate an unsupported measurement.
let retry = createInitialState();
retry = adaptiveReducer(retry, { type: 'JUMP_TO_PHASE', payload: { phase: 'BASELINE' } });
const b01 = questionsById['GI-PS-B01'];
retry = adaptiveReducer(retry, {
  type: 'ANSWER_QUESTION',
  payload: { question: b01, optionId: 'A', responseTimeMs: 1000, timestamp: 1 },
});
retry = adaptiveReducer(retry, {
  type: 'ANSWER_QUESTION',
  payload: { question: b01, optionId: 'B', responseTimeMs: 1000, timestamp: 2 },
});
check('a baseline retry cannot upgrade the score', retry.baseline.correct, 0);
check('a baseline retry does not add a second answered item', retry.baseline.questionsAnswered, 1);

// ------------------------------------------------- demo seeding (plan section 15)
console.log('\nDemo jump seeding');

const seed = (phase) =>
  adaptiveReducer(createInitialState(), { type: 'SEED_SESSION', payload: { phase, timestamp: 0 } });

// A jump to the baseline must arrive CLEAN — seeding past it would hand the
// presenter a screen whose score is already decided.
const seededBaseline = seed('BASELINE');
check('seed to BASELINE lands on the right phase', seededBaseline.phase, 'BASELINE');
check('seed to BASELINE logs no answers yet', seededBaseline.events.length, 0);

const seededSupport = seed('SUPPORT_SELECTED');
check('seed to SUPPORT_SELECTED phase', seededSupport.phase, 'SUPPORT_SELECTED');
checkNear('seed to SUPPORT_SELECTED keeps Unsupported Before', seededSupport.baseline.score, 1 / 3);
checkTrue('seed to SUPPORT_SELECTED has detected difficulty', seededSupport.difficulty.detected);
check('seed to SUPPORT_SELECTED confidence', seededSupport.difficulty.confidence, 0.84);
check('seed to SUPPORT_SELECTED beliefs', toPercentages(seededSupport.misconceptionBeliefs), {
  rotationDirection: 62,
  sequenceRule: 23,
  positionTracking: 10,
  other: 5,
});
check('seed to SUPPORT_SELECTED selected support', seededSupport.selectedSupport.id, 'visual-rotation');

const seededCheck = seed('INDEPENDENT_CHECK');
check('seed to INDEPENDENT_CHECK phase', seededCheck.phase, 'INDEPENDENT_CHECK');
check('seed to INDEPENDENT_CHECK withdraws support', seededCheck.supportStatus, 'removed');
check('seed to INDEPENDENT_CHECK ran supported practice', seededCheck.supportedPractice.correct, 1);
check('seed to INDEPENDENT_CHECK leaves the check unanswered', seededCheck.independentCheck.questionsAnswered, 0);

const seededResult = seed('RESULT');
check('seed to RESULT completes the check', seededResult.independentCheck.score, 1);
check('seed to RESULT holds no gain yet', seededResult.independenceGain, null);

const seededSummary = seed('SUMMARY');
check('seed to SUMMARY phase', seededSummary.phase, 'SUMMARY');
checkNear('seed to SUMMARY Independence Gain', seededSummary.independenceGain.gain, 2 / 3);
check('seed to SUMMARY wrote one policy record', seededSummary.supportEffectivenessHistory.length, 1);
check(
  'seed to SUMMARY observation count stays 1',
  seededSummary.supportEffectivenessHistory[0].observationCount,
  1
);
check('seed to SUMMARY total events', seededSummary.events.length, 11);
check('seeding is idempotent', seed('SUMMARY').events.length, seededSummary.events.length);

// A forced support must still carry the prediction the model would have given it.
const forcedSupport = adaptiveReducer(seed('SUPPORT_ACTIVE'), {
  type: 'SELECT_SUPPORT',
  payload: { supportId: 'worked-example' },
});
check('forced support id', forcedSupport.selectedSupport.id, 'worked-example');
check('forced support keeps its predicted IG', forcedSupport.selectedSupport.predictedIG, 0.31);

// ------------------------------------------------------------------------ result
console.log(
  failures === 0 ? '\nAll Phase 1 checks passed.\n' : `\n${failures} check(s) FAILED.\n`
);

process.exit(failures === 0 ? 0 : 1);
