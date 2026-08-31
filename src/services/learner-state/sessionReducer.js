/**
 * Learner-state session reducer. Pure module.
 *
 * Every transition lives here so the React layer stays a thin wrapper, matching
 * how the Adaptive Learning component is organised. Deliberately IN-MEMORY only:
 * a refresh must give a clean session, and window-level evidence is not something
 * a prototype should be persisting.
 */

import { CAMERA_MODE, SUPPORT_NEED, SUPPORT_TYPE } from '../../data/learner-state/supportCopy';
import { DEFAULT_LEARNER_ID } from '../../data/learner-state/learnerBaselines';
import { CAMERA_PERMISSION } from './cameraSession';
import { runLearnerStateWindow } from './pipeline';
import {
  createTemporalWindow,
  pushWindow,
  resetWindowCounter,
  WINDOW_SECONDS,
} from './temporalWindow';
import { buildActivityRequest, buildTutorSupportRequest, requiresTutor } from './tutorHandoff';
import { INTERVENTION_COOLDOWN_WINDOWS } from './adaptiveDecision';

let sessionCounter = 0;

export function createInitialState(overrides = {}) {
  sessionCounter += 1;
  resetWindowCounter();
  const startTime = Date.now();

  return {
    sessionId: `ls-session-${String(sessionCounter).padStart(3, '0')}`,
    learnerId: DEFAULT_LEARNER_ID,
    startTime,

    /** Whether the pipeline is ticking. Only true inside a learning session. */
    monitoring: false,

    cameraPermission: CAMERA_PERMISSION.UNKNOWN,
    /** What the learner asked for. The effective mode is derived per window. */
    requestedCameraMode: CAMERA_MODE.OFF,

    currentWindow: createTemporalWindow({ startTime, index: 1 }),
    windows: [],

    /** Events captured inside the open window, cleared on every window close. */
    pendingEvents: [],
    lastInteractionAt: startTime,

    /** Rolling context supplied by the Gamified Learning Module. */
    activityContext: {
      recentAccuracy: null,
      taskCompletionRatio: null,
      activityId: null,
      skillId: null,
    },

    /** Weak-area context supplied by Learner Profile / Assessment. */
    weakAreaContext: null,

    decision: null,
    activePrompt: null,
    windowsSinceIntervention: Infinity,
    priorDisengagementInterventions: 0,
    interventions: [],
    outboundRequests: [],

    researchViewEnabled: false,
    /**
     * Whether the research affordance may appear on a learning screen at all.
     * OFF by default, so a child who starts a session from Home gets a pure
     * child experience with no research entry point anywhere. The presenter
     * turns it on from Demo Controls, behind the parent PIN.
     */
    presenterMode: false,
    scenarioId: null,
    scenarioStep: 0,

    ...overrides,
  };
}

export function learnerStateReducer(state, action) {
  switch (action.type) {
    case 'START_SESSION': {
      const startTime = action.payload?.timestamp ?? Date.now();
      resetWindowCounter();
      return {
        ...state,
        monitoring: true,
        startTime,
        currentWindow: createTemporalWindow({ startTime, index: 1 }),
        windows: [],
        pendingEvents: [],
        lastInteractionAt: startTime,
        decision: null,
        activePrompt: null,
        windowsSinceIntervention: Infinity,
        priorDisengagementInterventions: 0,
        interventions: [],
        outboundRequests: [],
        scenarioStep: 0,
      };
    }

    case 'STOP_SESSION':
      return { ...state, monitoring: false, activePrompt: null };

    case 'SET_LEARNER':
      return { ...state, learnerId: action.payload.learnerId };

    case 'SET_CAMERA_PERMISSION': {
      const { permission } = action.payload;
      const granted = permission === CAMERA_PERMISSION.GRANTED;
      return {
        ...state,
        cameraPermission: permission,
        requestedCameraMode: granted
          ? CAMERA_MODE.ACTIVE
          : permission === CAMERA_PERMISSION.DENIED
            ? CAMERA_MODE.DENIED
            : CAMERA_MODE.OFF,
      };
    }

    case 'SET_CAMERA_MODE':
      return { ...state, requestedCameraMode: action.payload.mode };

    case 'SET_ACTIVITY_CONTEXT':
      return { ...state, activityContext: { ...state.activityContext, ...action.payload } };

    case 'SET_WEAK_AREA_CONTEXT':
      return { ...state, weakAreaContext: action.payload };

    /** One interaction from the Gamified Learning Module. */
    case 'RECORD_EVENT': {
      const event = { ...action.payload, at: action.payload.at ?? Date.now() };
      return {
        ...state,
        pendingEvents: [...state.pendingEvents, event],
        lastInteractionAt: event.at,
      };
    }

    /** Closes the open window: runs the pipeline and opens the next one. */
    case 'CLOSE_WINDOW': {
      const { windowInput, endTime, cameraMode } = action.payload;

      const closed = runLearnerStateWindow({
        window: state.currentWindow,
        visualInput: windowInput.visualInput,
        behaviorInput: windowInput.behaviorInput,
        cameraMode: cameraMode ?? state.requestedCameraMode,
        learnerId: state.learnerId,
        history: state.windows,
        windowsSinceIntervention: state.windowsSinceIntervention,
        priorDisengagementInterventions: state.priorDisengagementInterventions,
        endTime,
      });

      const decision = closed.decision;
      const intervening = decision.supportNeed === SUPPORT_NEED.INTERVENE;
      const prompts = decision.supportType !== SUPPORT_TYPE.NONE;

      const next = {
        ...state,
        currentWindow: createTemporalWindow({
          startTime: endTime,
          index: closed.index + 1,
        }),
        windows: pushWindow(state.windows, closed),
        pendingEvents: [],
        decision,
        scenarioStep: state.scenarioId ? state.scenarioStep + 1 : 0,
        windowsSinceIntervention: intervening
          ? 0
          : Number.isFinite(state.windowsSinceIntervention)
            ? state.windowsSinceIntervention + 1
            : Infinity,
      };

      // A prompt is shown for an intervention, and for the one monitor-level
      // support that is allowed to speak: light encouragement.
      if (prompts) {
        next.activePrompt = {
          supportType: decision.supportType,
          classification: decision.classification,
          windowId: closed.id,
          shownAt: endTime,
        };
      }

      if (intervening) {
        next.interventions = [
          ...state.interventions,
          {
            windowId: closed.id,
            at: endTime,
            classification: decision.classification,
            supportType: decision.supportType,
            confidence: decision.confidence,
            persistenceTrend: decision.trend,
            accepted: null,
          },
        ];

        if (decision.classification === 'disengagement') {
          next.priorDisengagementInterventions = state.priorDisengagementInterventions + 1;
        }

        // The outbound request. This component asks; another component answers.
        const request = requiresTutor(decision)
          ? buildTutorSupportRequest({
              learnerId: state.learnerId,
              sessionId: state.sessionId,
              window: closed,
              decision,
              weakAreaContext: state.weakAreaContext,
              recentAttempts: state.pendingEvents.filter((e) => e.type === 'answer').slice(-5),
            })
          : buildActivityRequest({ sessionId: state.sessionId, decision });

        if (request) {
          next.outboundRequests = [...state.outboundRequests, request].slice(-8);
        }
      }

      return next;
    }

    /** The child answered the prompt. */
    case 'RESOLVE_PROMPT': {
      const { accepted } = action.payload;
      const interventions = [...state.interventions];
      const last = interventions[interventions.length - 1];
      if (last && last.accepted === null) {
        interventions[interventions.length - 1] = { ...last, accepted };
      }
      return { ...state, activePrompt: null, interventions };
    }

    case 'DISMISS_PROMPT':
      return { ...state, activePrompt: null };

    case 'TOGGLE_RESEARCH_VIEW':
      return {
        ...state,
        researchViewEnabled: action.payload?.enabled ?? !state.researchViewEnabled,
      };

    case 'SET_PRESENTER_MODE': {
      const enabled = action.payload?.enabled ?? !state.presenterMode;
      return {
        ...state,
        presenterMode: enabled,
        // Leaving presenter mode must also close the drawer, or the research
        // panel would stay open over the child screen.
        researchViewEnabled: enabled ? state.researchViewEnabled : false,
      };
    }

    case 'SET_SCENARIO':
      return { ...state, scenarioId: action.payload.scenarioId, scenarioStep: 0 };

    /**
     * Clears the EVIDENCE, not the setup. A presenter resetting mid-demo keeps
     * the scenario, camera state and baseline they just chose, and the window
     * clock keeps running if a session was already live.
     */
    case 'RESET_SESSION':
      return createInitialState({
        learnerId: state.learnerId,
        cameraPermission: state.cameraPermission,
        requestedCameraMode: state.requestedCameraMode,
        researchViewEnabled: state.researchViewEnabled,
        presenterMode: state.presenterMode,
        weakAreaContext: state.weakAreaContext,
        scenarioId: state.scenarioId,
        monitoring: state.monitoring,
      });

    default:
      return state;
  }
}

/** Seconds since the last recorded interaction, for the open window. */
export function idleSeconds(state, now = Date.now()) {
  return Math.max(0, Math.round((now - state.lastInteractionAt) / 1000));
}

/** Windows remaining before another intervention may fire. */
export function cooldownRemaining(state) {
  if (!Number.isFinite(state.windowsSinceIntervention)) return 0;
  return Math.max(0, INTERVENTION_COOLDOWN_WINDOWS - state.windowsSinceIntervention);
}

export { WINDOW_SECONDS };
