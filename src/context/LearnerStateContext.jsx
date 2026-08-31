/**
 * Learner-state session provider.
 *
 * A thin React wrapper over the pure sessionReducer, matching how
 * AdaptiveLearningContext is organised. Nested INSIDE AppProvider so it can read
 * the persisted camera preference, and kept separate from it because none of this
 * state should survive a refresh.
 *
 * The window clock lives here: one interval closes the open temporal window every
 * WINDOW_SECONDS, runs the pipeline and opens the next one. Nothing in the UI
 * decides a learner state; screens only read the window this provider produced.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';

import { CAMERA_MODE, SUPPORT_TYPE } from '../data/learner-state/supportCopy';
import { getLearnerBaseline } from '../data/learner-state/learnerBaselines';
import {
  cooldownRemaining,
  createInitialState,
  idleSeconds,
  learnerStateReducer,
} from '../services/learner-state/sessionReducer';
import {
  CAMERA_PERMISSION,
  getCameraHealth,
  NO_CAMERA_HEALTH,
  releaseCamera,
  requestCamera,
} from '../services/learner-state/cameraSession';
import { liveWindowInput, scenarioWindowInput } from '../services/learner-state/signalSource';
import { WINDOW_MS, WINDOW_SECONDS } from '../services/learner-state/temporalWindow';
import { sendSupportRequest } from '../services/learner-state/tutorHandoff';

const LearnerStateContext = createContext(null);

/** Camera modes with no visual signal at all. */
const CAMERA_OFF_MODES = new Set([CAMERA_MODE.OFF, CAMERA_MODE.DENIED]);

export function LearnerStateProvider({ children }) {
  const [state, dispatch] = useReducer(learnerStateReducer, undefined, () => createInitialState());

  // The reducer is pure, so the window clock reads the live session through a ref
  // rather than closing over a stale render. Synced in an effect rather than
  // during render: the interval fires every WINDOW_SECONDS, long after commit.
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const startSession = useCallback(
    () => dispatch({ type: 'START_SESSION', payload: { timestamp: Date.now() } }),
    []
  );
  const stopSession = useCallback(() => dispatch({ type: 'STOP_SESSION' }), []);
  const setLearner = useCallback(
    (learnerId) => dispatch({ type: 'SET_LEARNER', payload: { learnerId } }),
    []
  );
  const setCameraMode = useCallback(
    (mode) => dispatch({ type: 'SET_CAMERA_MODE', payload: { mode } }),
    []
  );
  const setActivityContext = useCallback(
    (payload) => dispatch({ type: 'SET_ACTIVITY_CONTEXT', payload }),
    []
  );
  const setWeakAreaContext = useCallback(
    (payload) => dispatch({ type: 'SET_WEAK_AREA_CONTEXT', payload }),
    []
  );
  const toggleResearchView = useCallback(
    (enabled) => dispatch({ type: 'TOGGLE_RESEARCH_VIEW', payload: { enabled } }),
    []
  );
  const setPresenterMode = useCallback(
    (enabled) => dispatch({ type: 'SET_PRESENTER_MODE', payload: { enabled } }),
    []
  );
  const setScenario = useCallback(
    (scenarioId) => dispatch({ type: 'SET_SCENARIO', payload: { scenarioId } }),
    []
  );
  const resetSession = useCallback(() => dispatch({ type: 'RESET_SESSION' }), []);
  const dismissPrompt = useCallback(() => dispatch({ type: 'DISMISS_PROMPT' }), []);
  const resolvePrompt = useCallback(
    (accepted) => dispatch({ type: 'RESOLVE_PROMPT', payload: { accepted } }),
    []
  );

  /**
   * One interaction from the Gamified Learning Module. Screens call this; they
   * never call the pipeline directly.
   */
  const recordEvent = useCallback((event) => dispatch({ type: 'RECORD_EVENT', payload: event }), []);

  /** Real permission request. A refusal is a supported path, not an error. */
  const enableCamera = useCallback(async () => {
    const result = await requestCamera();
    dispatch({ type: 'SET_CAMERA_PERMISSION', payload: { permission: result.permission } });
    return result;
  }, []);

  const disableCamera = useCallback(() => {
    releaseCamera();
    dispatch({ type: 'SET_CAMERA_MODE', payload: { mode: CAMERA_MODE.OFF } });
  }, []);

  /** Closes the open window. Exposed so the research panel can step manually. */
  const closeWindow = useCallback((endTime = Date.now()) => {
    const current = stateRef.current;
    const cameraOff = CAMERA_OFF_MODES.has(current.requestedCameraMode);

    const windowInput = current.scenarioId
      ? scenarioWindowInput(current.scenarioId, current.scenarioStep)
      : liveWindowInput({
          events: current.pendingEvents,
          idleSeconds: idleSeconds(current, endTime),
          recentAccuracy: current.activityContext.recentAccuracy,
          taskCompletionRatio: current.activityContext.taskCompletionRatio,
          cameraHealth: cameraOff ? NO_CAMERA_HEALTH : getCameraHealth(),
        });

    if (!windowInput) return;

    dispatch({
      type: 'CLOSE_WINDOW',
      payload: { windowInput, endTime, cameraMode: current.requestedCameraMode },
    });
  }, []);

  // The window clock. One interval for the whole session.
  useEffect(() => {
    if (!state.monitoring) return undefined;
    const timer = window.setInterval(() => closeWindow(Date.now()), WINDOW_MS);
    return () => window.clearInterval(timer);
  }, [state.monitoring, closeWindow]);

  // The camera is held only while a session is monitoring, and released on
  // unmount, so no track outlives the screen that asked for it.
  useEffect(() => {
    if (!state.monitoring) releaseCamera();
    return () => releaseCamera();
  }, [state.monitoring]);

  // Outbound support requests leave through one seam, so swapping in a real
  // tutor endpoint is a change to `sendSupportRequest` and nothing else.
  const lastSentRef = useRef(0);
  useEffect(() => {
    const pending = state.outboundRequests.slice(lastSentRef.current);
    if (pending.length === 0) return;
    lastSentRef.current = state.outboundRequests.length;
    pending.forEach((request) => {
      sendSupportRequest(request);
    });
  }, [state.outboundRequests]);

  const derived = useMemo(() => {
    const latestWindow = state.windows[state.windows.length - 1] ?? null;
    const baseline = getLearnerBaseline(state.learnerId);
    const cameraOff = CAMERA_OFF_MODES.has(state.requestedCameraMode);

    return {
      baseline,
      latestWindow,
      /** The mode the UI shows: derived from reliability, not just the setting. */
      effectiveCameraMode:
        latestWindow?.cameraMode ??
        (cameraOff ? state.requestedCameraMode : CAMERA_MODE.ACTIVE),
      behaviorOnly: cameraOff || (latestWindow?.weights?.visual ?? 0) === 0,
      confusion: latestWindow?.stateEstimate?.confusionProbability ?? null,
      disengagement: latestWindow?.stateEstimate?.disengagementProbability ?? null,
      persistence: latestWindow?.persistence ?? null,
      cooldownWindows: cooldownRemaining(state),
      /** Prompts that speak to the child, newest last. */
      promptHistory: state.interventions,
      latestRequest: state.outboundRequests[state.outboundRequests.length - 1] ?? null,
      windowSeconds: WINDOW_SECONDS,
      hasPrompt: Boolean(state.activePrompt) && state.activePrompt.supportType !== SUPPORT_TYPE.NONE,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      derived,
      startSession,
      stopSession,
      setLearner,
      setCameraMode,
      setActivityContext,
      setWeakAreaContext,
      recordEvent,
      closeWindow,
      enableCamera,
      disableCamera,
      toggleResearchView,
      setPresenterMode,
      setScenario,
      resetSession,
      dismissPrompt,
      resolvePrompt,
    }),
    [
      state,
      derived,
      startSession,
      stopSession,
      setLearner,
      setCameraMode,
      setActivityContext,
      setWeakAreaContext,
      recordEvent,
      closeWindow,
      enableCamera,
      disableCamera,
      toggleResearchView,
      setPresenterMode,
      setScenario,
      resetSession,
      dismissPrompt,
      resolvePrompt,
    ]
  );

  return <LearnerStateContext.Provider value={value}>{children}</LearnerStateContext.Provider>;
}

// eslint-disable-next-line react/only-export-components -- provider and hook intentionally share this prototype context module, matching AppContext.jsx.
export function useLearnerState() {
  const context = useContext(LearnerStateContext);
  if (!context) {
    throw new Error('useLearnerState must be used inside a LearnerStateProvider');
  }
  return context;
}

export { CAMERA_PERMISSION };
