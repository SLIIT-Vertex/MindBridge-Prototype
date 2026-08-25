import { DEMO_SCENARIOS } from '../data/learnerStateMockData.js';

const SUPPORT_BY_STATE = {
  engaged: 'continue_activity',
  confusion: 'offer_additional_support',
  frustration: 'offer_reset_or_easier_step',
  low_alertness: 'suggest_short_break',
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function estimateLearnerState({
  responseTime = 8,
  incorrectAttempts = 0,
  repeatedAttempts = 0,
  inactivitySeconds = 0,
  recentAccuracy = 1,
  rapidAnswers = false,
  visualSignals = {},
  cameraEnabled = true,
  forcedState,
} = {}) {
  const hasLowAlertnessSignals =
    inactivitySeconds >= 20 ||
    responseTime >= 24 ||
    (cameraEnabled && (visualSignals.eyeClosure || visualSignals.possibleYawn));
  const hasFrustrationSignals = incorrectAttempts >= 3 && (rapidAnswers || repeatedAttempts >= 3);
  const hasConfusionSignals = incorrectAttempts >= 2 || responseTime >= 16 || repeatedAttempts >= 2;

  let state = forcedState;
  if (!state) {
    if (hasLowAlertnessSignals) state = 'low_alertness';
    else if (hasFrustrationSignals) state = 'frustration';
    else if (hasConfusionSignals) state = 'confusion';
    else state = 'engaged';
  }

  const evidenceStrength =
    (incorrectAttempts * 0.05) +
    (repeatedAttempts * 0.04) +
    (inactivitySeconds * 0.004) +
    ((1 - recentAccuracy) * 0.18) +
    (cameraEnabled && (visualSignals.gazeChange || visualSignals.headPoseChange) ? 0.06 : 0);

  return {
    state,
    confidence: Number(clamp(0.69 + evidenceStrength, 0.69, 0.94).toFixed(2)),
    sourceMode: cameraEnabled ? 'multimodal' : 'behavior_only',
    visualSignals: cameraEnabled
      ? {
          gazeChange: Boolean(visualSignals.gazeChange),
          eyeClosure: Boolean(visualSignals.eyeClosure),
          headPoseChange: Boolean(visualSignals.headPoseChange),
          possibleYawn: Boolean(visualSignals.possibleYawn),
        }
      : null,
    learningSignals: {
      incorrectAttempts,
      repeatedAttempts,
      responseTime,
      inactivitySeconds,
      recentAccuracy,
      rapidAnswers,
    },
    recommendedSupport: SUPPORT_BY_STATE[state],
  };
}

export function simulateLearnerState(state, cameraEnabled = true) {
  const scenario = DEMO_SCENARIOS[state] || DEMO_SCENARIOS.engaged;
  return estimateLearnerState({ ...scenario, cameraEnabled, forcedState: state });
}

export function findRecurringPattern(sessions) {
  const recentEveningSessions = sessions.filter((session) => session.hour >= 19 && session.hour <= 20);
  const lowAlertnessSessions = recentEveningSessions.filter(
    (session) => session.dominantState === 'low_alertness'
  );

  if (lowAlertnessSessions.length < 3) return null;

  return {
    id: 'evening-low-alertness',
    title: 'Lower alertness during late evening sessions',
    observed: `${lowAlertnessSessions.length} of the last ${recentEveningSessions.length} evening sessions`,
    timeWindow: 'Approximately 7:30 PM – 8:00 PM',
    insight: `Repeated low-alertness indicators were observed in ${lowAlertnessSessions.length} recent evening learning sessions between approximately 7:30 PM and 8:00 PM.`,
    recommendation: 'Consider moving challenging activities to an earlier time where possible.',
    learningBehaviour: ['Longer response times', 'Increased inactivity', 'Reduced recent accuracy'],
    visualIndicators: ['Prolonged eye-closure indicators', 'Reduced head movement'],
  };
}
