/**
 * Adaptive Learning session provider — a thin React wrapper; every transition
 * lives in the pure sessionReducer and its sibling services.
 *
 * Kept separate from AppContext, which has no phase machine, event log or reset.
 * Nested INSIDE AppProvider so pages can still call addXp / addCoins. State is
 * IN-MEMORY ONLY, so a refresh gives a clean demo — do not add persistence.
 */

import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';

import { SUPPORT_STATUS } from '../data/adaptive-learning/learningSupports';
import {
  adaptiveReducer,
  createInitialState,
} from '../services/adaptive-learning/sessionReducer';
import { hasReachedPhase } from '../services/adaptive-learning/phaseMachine';
import {
  toBeliefRows,
  topBelief as pickTopBelief,
} from '../services/adaptive-learning/misconceptionModel';
import {
  getSupportPredictions,
  rankSupports,
} from '../services/adaptive-learning/supportSelector';
import { formatIndependenceGain } from '../services/adaptive-learning/independenceGain';

const AdaptiveLearningContext = createContext(null);

export function AdaptiveLearningProvider({ children }) {
  const [state, dispatch] = useReducer(adaptiveReducer, undefined, () => createInitialState());

  const answerQuestion = useCallback(
    ({ question, optionId, responseTimeMs, timestamp = Date.now() }) =>
      dispatch({
        type: 'ANSWER_QUESTION',
        payload: { question, optionId, responseTimeMs, timestamp },
      }),
    []
  );

  const goToPhase = useCallback((phase) => dispatch({ type: 'SET_PHASE', payload: { phase } }), []);

  const jumpToPhase = useCallback(
    (phase) => dispatch({ type: 'JUMP_TO_PHASE', payload: { phase } }),
    []
  );

  /**
   * Presenter jump that replays the scripted trajectory up to `phase`, unlike
   * jumpToPhase, which only moves the marker and leaves the session as it was.
   */
  const seedToPhase = useCallback(
    (phase, timestamp = Date.now()) =>
      dispatch({ type: 'SEED_SESSION', payload: { phase, timestamp } }),
    []
  );

  const requestHelp = useCallback(() => dispatch({ type: 'REQUEST_HELP' }), []);

  const chooseSupport = useCallback(
    (support = null) => dispatch({ type: 'SELECT_SUPPORT', payload: { support } }),
    []
  );

  /** Presenter override: force a support by id, keeping the model's prediction. */
  const forceSupport = useCallback(
    (supportId) => dispatch({ type: 'SELECT_SUPPORT', payload: { supportId } }),
    []
  );

  const setSupportStatus = useCallback(
    (status) => dispatch({ type: 'SET_SUPPORT_STATUS', payload: { status } }),
    []
  );

  const recordIndependence = useCallback(() => dispatch({ type: 'RECORD_INDEPENDENCE' }), []);

  const updatePolicy = useCallback(
    (timestamp = Date.now()) => dispatch({ type: 'UPDATE_POLICY', payload: { timestamp } }),
    []
  );

  const toggleResearchView = useCallback(
    (enabled) => dispatch({ type: 'TOGGLE_RESEARCH_VIEW', payload: { enabled } }),
    []
  );

  const toggleDemoScenario = useCallback(
    (enabled) => dispatch({ type: 'TOGGLE_DEMO_SCENARIO', payload: { enabled } }),
    []
  );

  const simulateAffectiveState = useCallback(
    (stateKey) => dispatch({ type: 'SIMULATE_AFFECTIVE', payload: { state: stateKey } }),
    []
  );

  const dismissAffectiveSupport = useCallback(() => dispatch({ type: 'DISMISS_AFFECTIVE' }), []);

  const openAffectiveBreak = useCallback(() => dispatch({ type: 'OPEN_AFFECTIVE_BREAK' }), []);

  const closeAffectiveBreak = useCallback(() => dispatch({ type: 'CLOSE_AFFECTIVE_BREAK' }), []);

  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);

  /** Presentation-ready values so pages never recompute research logic in JSX. */
  const derived = useMemo(() => {
    const predictions =
      state.supportPredictions ??
      getSupportPredictions({
        skillId: state.skill.id,
        misconceptionBeliefs: state.misconceptionBeliefs,
      });

    return {
      beliefRows: toBeliefRows(state.misconceptionBeliefs),
      topBelief: pickTopBelief(state.misconceptionBeliefs),
      rankedSupports: rankSupports(predictions),
      independenceGainView: formatIndependenceGain(state.independenceGain),
      latestPolicyRecord:
        state.supportEffectivenessHistory[state.supportEffectivenessHistory.length - 1] ?? null,
      recentEvents: state.events.slice(-5).reverse(),
      unsupportedBefore: state.baseline.score,
      unsupportedAfter: state.independentCheck.score,
      supportActive: state.supportStatus === SUPPORT_STATUS.ACTIVE,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      derived,
      answerQuestion,
      goToPhase,
      jumpToPhase,
      seedToPhase,
      requestHelp,
      chooseSupport,
      forceSupport,
      setSupportStatus,
      recordIndependence,
      updatePolicy,
      toggleResearchView,
      toggleDemoScenario,
      simulateAffectiveState,
      dismissAffectiveSupport,
      openAffectiveBreak,
      closeAffectiveBreak,
      resetSession,
      hasReached: (phase) => hasReachedPhase(state.phase, phase),
    }),
    [
      state,
      derived,
      answerQuestion,
      goToPhase,
      jumpToPhase,
      seedToPhase,
      requestHelp,
      chooseSupport,
      forceSupport,
      setSupportStatus,
      recordIndependence,
      updatePolicy,
      toggleResearchView,
      toggleDemoScenario,
      simulateAffectiveState,
      dismissAffectiveSupport,
      openAffectiveBreak,
      closeAffectiveBreak,
      resetSession,
    ]
  );

  return (
    <AdaptiveLearningContext.Provider value={value}>{children}</AdaptiveLearningContext.Provider>
  );
}

// eslint-disable-next-line react/only-export-components -- provider and hook intentionally share this prototype context module, matching AppContext.jsx.
export function useAdaptive() {
  const context = useContext(AdaptiveLearningContext);
  if (!context) {
    throw new Error('useAdaptive must be used inside an AdaptiveLearningProvider');
  }
  return context;
}
