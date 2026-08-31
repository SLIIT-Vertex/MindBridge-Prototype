/**
 * Adaptive Learning session reducer. Pure module (no React), so the whole
 * research trajectory can be replayed and asserted in Node. In-memory only.
 */

import { DEFAULT_BELIEFS } from '../../data/adaptive-learning/misconceptions';
import { SUPPORT_STATUS } from '../../data/adaptive-learning/learningSupports';
import {
  averageResponseTime,
  countErrorCodes,
  createEvent,
  dominantErrorCode as pickDominantErrorCode,
  SESSION_META,
} from './eventLogger';
import { buildEvidence, detectDifficulty } from './difficultyDetector';
import { canTransition, phaseIndex } from './phaseMachine';
import { getQuestion } from '../../data/adaptive-learning/patternQuestions';
import { DEMO_SEED_STEPS, getScriptedAttempt } from '../../data/adaptive-learning/demoScenario';
import { topBelief as pickTopBelief, updateBeliefs } from './misconceptionModel';
import { getSupportPredictions, rankSupports, selectSupport } from './supportSelector';
import { calculateIndependenceGain } from './independenceGain';
import { updateSupportEffectiveness, upsertHistory } from './policyUpdater';

const EMPTY_SCORE_BUCKET = {
  answeredIds: [],
  questionsAnswered: 0,
  correct: 0,
  score: null,
};

export function createInitialState(overrides = {}) {
  return {
    learner: {
      id: SESSION_META.learnerId,
      name: SESSION_META.learnerName,
      grade: SESSION_META.grade,
    },
    domain: { id: 'GI', name: 'General Intelligence & Aptitude' },
    skill: { id: 'GI-PS-01', name: 'Pattern & Sequence Reasoning' },

    phase: 'HOME',

    /** Evidence timeline across every phase, not just gameplay. */
    events: [],
    attemptsByQuestion: {},

    baseline: { ...EMPTY_SCORE_BUCKET },
    supportedPractice: { ...EMPTY_SCORE_BUCKET },
    independentCheck: { ...EMPTY_SCORE_BUCKET },

    /** Gameplay-only counters, read by the difficulty detector. */
    gameplay: {
      attempts: 0,
      relatedErrors: 0,
      averageResponseTimeMs: 0,
      avgResponseTimeOnErrorsMs: 0,
      dominantErrorCode: null,
      errorCodeCounts: {},
    },

    difficulty: { detected: false, confidence: 0, evidence: [], signals: [], signalsMet: 0 },
    explicitHelpRequested: false,

    misconceptionBeliefs: { ...DEFAULT_BELIEFS },

    supportPredictions: null,
    selectedSupport: null,
    supportStatus: SUPPORT_STATUS.NONE,

    independenceGain: null,
    supportEffectivenessHistory: [],

    researchViewEnabled: false,
    demoScenarioEnabled: true,

    /** Presenter-only affective overlay from the original companion demo. */
    affectiveDemo: { state: null, showCard: false, showBreak: false },

    ...overrides,
  };
}

/**
 * Records an answer against a measurement bucket. Only the FIRST attempt on a
 * question counts, so a retry can never inflate a score.
 */
function accumulateAnswer(bucket, event) {
  if (bucket.answeredIds.includes(event.questionId)) return bucket;

  const answeredIds = [...bucket.answeredIds, event.questionId];
  const correct = bucket.correct + (event.isCorrect ? 1 : 0);

  return {
    answeredIds,
    questionsAnswered: answeredIds.length,
    correct,
    score: correct / answeredIds.length,
  };
}

export function setPhase(state, nextPhase, { force = false } = {}) {
  if (state.phase === nextPhase) return state;

  if (!force && !canTransition(state.phase, nextPhase)) {
    // Warn rather than throw: a throw inside the reducer would unmount the demo.
    console.warn(
      `[adaptive-learning] Blocked phase transition ${state.phase} -> ${nextPhase}. ` +
        'Use jumpToPhase() for an intentional demo skip.'
    );
    return state;
  }

  // The independent check must never run while support is up.
  if (nextPhase === 'INDEPENDENT_CHECK' && state.supportStatus === SUPPORT_STATUS.ACTIVE) {
    console.warn(
      '[adaptive-learning] Blocked INDEPENDENT_CHECK: learning support is still active. ' +
        'Withdraw support first.'
    );
    return state;
  }

  return { ...state, phase: nextPhase };
}

function handleAnswer(state, payload) {
  const { question, optionId, responseTimeMs, timestamp } = payload;
  if (!question) return state;

  const questionId = question.id;
  const attemptNumber = (state.attemptsByQuestion[questionId] ?? 0) + 1;
  const supportActive = state.supportStatus === SUPPORT_STATUS.ACTIVE;

  const event = createEvent({
    question,
    optionId,
    responseTimeMs,
    attemptNumber,
    supportActive,
    supportType: supportActive ? (state.selectedSupport?.id ?? null) : null,
    timestamp,
  });

  let next = {
    ...state,
    events: [...state.events, event],
    attemptsByQuestion: { ...state.attemptsByQuestion, [questionId]: attemptNumber },
  };

  if (question.phase === 'baseline') {
    next.baseline = accumulateAnswer(state.baseline, event);
  } else if (question.phase === 'supported') {
    next.supportedPractice = accumulateAnswer(state.supportedPractice, event);
  } else if (question.phase === 'independent') {
    next.independentCheck = accumulateAnswer(state.independentCheck, event);
  }

  // Only gameplay evidence drives the belief model and the difficulty detector;
  // the baseline is a clean measurement, not an evidence-gathering phase.
  if (question.phase !== 'gameplay') return next;

  const gameplayEvents = next.events.filter((e) => e.phase === 'gameplay');
  const gameplayErrors = gameplayEvents.filter((e) => !e.isCorrect);

  const errorCodeCounts = countErrorCodes(gameplayErrors);
  const dominantErrorCode = pickDominantErrorCode(errorCodeCounts);
  const avgResponseTimeOnErrorsMs = averageResponseTime(gameplayErrors);

  next.gameplay = {
    attempts: gameplayEvents.length,
    relatedErrors: gameplayErrors.length,
    averageResponseTimeMs: averageResponseTime(gameplayEvents),
    avgResponseTimeOnErrorsMs,
    dominantErrorCode,
    errorCodeCounts,
  };

  // Correct answers are logged but do not reweight beliefs.
  next.misconceptionBeliefs = event.isCorrect
    ? state.misconceptionBeliefs
    : updateBeliefs(state.misconceptionBeliefs, event.errorCode);

  // Only incorrect attempts re-evaluate difficulty: a correct retry would meet
  // the slow-response and repeat-attempt signals and fire after one error.
  // Once detected, the snapshot is frozen so a later item cannot un-detect it.
  if (!event.isCorrect) {
    const result = detectDifficulty(
      buildEvidence({
        relatedErrors: gameplayErrors.length,
        errorCodeCounts,
        dominantErrorCode,
        avgResponseTimeOnErrorsMs,
        attemptsOnCurrentItem: attemptNumber,
        explicitHelpRequested: state.explicitHelpRequested,
      })
    );

    if (result.detected || !state.difficulty.detected) {
      next.difficulty = result;
    }

    if (result.detected && !state.difficulty.detected) {
      next = setPhase(next, 'DIFFICULTY_DETECTED');
    }
  }

  return next;
}

/**
 * Replays the scripted trajectory up to `targetPhase` through the real reducer,
 * so a presenter jump lands on populated metrics. Starts from a fresh session,
 * which makes a jump an implicit reset.
 */
function seedSession(state, targetPhase, timestamp) {
  const targetIndex = phaseIndex(targetPhase);
  if (targetIndex === -1) {
    console.warn(`[adaptive-learning] Cannot seed unknown phase ${targetPhase}.`);
    return state;
  }

  let next = createInitialState({
    researchViewEnabled: state.researchViewEnabled,
    demoScenarioEnabled: state.demoScenarioEnabled,
  });

  let clock = timestamp ?? 0;

  DEMO_SEED_STEPS.forEach((step) => {
    if (phaseIndex(step.phase) >= targetIndex) return;

    // Answers must be logged under the phase the step declares, or the
    // gameplay-only evidence guard reads the wrong bucket.
    next = setPhase(next, step.phase, { force: true });

    switch (step.type) {
      case 'phase':
        next = setPhase(next, step.to, { force: true });
        break;

      case 'answer': {
        const question = getQuestion(step.questionId);
        const attempt = getScriptedAttempt(step.questionId, step.attempt);
        if (!question || !attempt) break;
        clock += attempt.responseTimeMs;
        next = handleAnswer(next, {
          question,
          optionId: attempt.optionId,
          responseTimeMs: attempt.responseTimeMs,
          timestamp: clock,
        });
        break;
      }

      case 'select-support':
        next = adaptiveReducer(next, { type: 'SELECT_SUPPORT', payload: {} });
        break;

      case 'support-status':
        next = { ...next, supportStatus: step.status };
        break;

      case 'record-independence':
        next = adaptiveReducer(next, { type: 'RECORD_INDEPENDENCE' });
        break;

      case 'update-policy':
        next = adaptiveReducer(next, { type: 'UPDATE_POLICY', payload: { timestamp: clock } });
        break;

      default:
        console.warn(`[adaptive-learning] Unknown seed step: ${step.type}`);
    }
  });

  return setPhase(next, targetPhase, { force: true });
}

export function adaptiveReducer(state, action) {
  switch (action.type) {
    case 'ANSWER_QUESTION':
      return handleAnswer(state, action.payload);

    case 'SET_PHASE':
      return setPhase(state, action.payload.phase);

    case 'JUMP_TO_PHASE':
      return setPhase(state, action.payload.phase, { force: true });

    case 'SEED_SESSION':
      return seedSession(state, action.payload.phase, action.payload.timestamp);

    case 'REQUEST_HELP': {
      // Feeds detector signal E.
      const next = { ...state, explicitHelpRequested: true };
      next.difficulty = detectDifficulty(
        buildEvidence({
          relatedErrors: state.gameplay.relatedErrors,
          errorCodeCounts: state.gameplay.errorCodeCounts,
          dominantErrorCode: state.gameplay.dominantErrorCode,
          avgResponseTimeOnErrorsMs: state.gameplay.avgResponseTimeOnErrorsMs,
          attemptsOnCurrentItem: 0,
          explicitHelpRequested: true,
        })
      );
      return next.difficulty.detected && !state.difficulty.detected
        ? setPhase(next, 'DIFFICULTY_DETECTED')
        : next;
    }

    case 'DETECT_DIFFICULTY':
      return { ...state, difficulty: action.payload.difficulty };

    case 'UPDATE_BELIEFS':
      return {
        ...state,
        misconceptionBeliefs: updateBeliefs(state.misconceptionBeliefs, action.payload.errorCode),
      };

    case 'SELECT_SUPPORT': {
      const predictions = getSupportPredictions({
        skillId: state.skill.id,
        misconceptionBeliefs: state.misconceptionBeliefs,
      });

      // Presenter override. Resolved against the current predictions so a forced
      // support still carries the predicted IG the model would have given it.
      const forced = action.payload?.supportId
        ? (rankSupports(predictions).find((s) => s.id === action.payload.supportId) ?? null)
        : null;

      return {
        ...state,
        supportPredictions: predictions,
        selectedSupport: forced ?? action.payload?.support ?? selectSupport(predictions),
      };
    }

    case 'SET_SUPPORT_STATUS':
      return { ...state, supportStatus: action.payload.status };

    case 'RECORD_INDEPENDENCE': {
      const result = calculateIndependenceGain(state.baseline.score, state.independentCheck.score);
      if (result == null) {
        console.warn(
          '[adaptive-learning] Independence Gain needs both a baseline score and an ' +
            'independent-check score. Nothing recorded.'
        );
        return state;
      }
      return { ...state, independenceGain: result };
    }

    case 'UPDATE_POLICY': {
      if (state.independenceGain == null) {
        console.warn('[adaptive-learning] Cannot update policy before Independence Gain exists.');
        return state;
      }

      const belief = pickTopBelief(state.misconceptionBeliefs);
      const record = updateSupportEffectiveness({
        learnerId: state.learner.id,
        skillId: state.skill.id,
        misconceptionId: belief.misconceptionId,
        supportType: state.selectedSupport?.id ?? null,
        predictedIG: state.selectedSupport?.predictedIG ?? null,
        observedIG: state.independenceGain.gain,
        timestamp: action.payload.timestamp,
      });

      return {
        ...state,
        supportEffectivenessHistory: upsertHistory(state.supportEffectivenessHistory, record),
      };
    }

    case 'TOGGLE_RESEARCH_VIEW':
      return {
        ...state,
        researchViewEnabled: action.payload?.enabled ?? !state.researchViewEnabled,
      };

    case 'TOGGLE_DEMO_SCENARIO':
      return {
        ...state,
        demoScenarioEnabled: action.payload?.enabled ?? !state.demoScenarioEnabled,
      };

    case 'SIMULATE_AFFECTIVE': {
      const nextState = action.payload?.state ?? null;
      if (nextState !== 'frustration' && nextState !== 'low_alertness') return state;
      return {
        ...state,
        researchViewEnabled: false,
        affectiveDemo: { state: nextState, showCard: true, showBreak: false },
      };
    }

    case 'DISMISS_AFFECTIVE':
      return {
        ...state,
        affectiveDemo: { state: null, showCard: false, showBreak: false },
      };

    case 'OPEN_AFFECTIVE_BREAK':
      return {
        ...state,
        affectiveDemo: { ...state.affectiveDemo, showCard: false, showBreak: true },
      };

    case 'CLOSE_AFFECTIVE_BREAK':
      return {
        ...state,
        affectiveDemo: { state: null, showCard: false, showBreak: false },
      };

    case 'RESET_SESSION':
      // Presenter toggles survive a reset.
      return createInitialState({
        researchViewEnabled: state.researchViewEnabled,
        demoScenarioEnabled: state.demoScenarioEnabled,
      });

    default:
      console.warn(`[adaptive-learning] Unknown action: ${action.type}`);
      return state;
  }
}
