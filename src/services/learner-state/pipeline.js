/**
 * The learner-state pipeline, end to end. Pure module.
 *
 *   features -> reliability -> baseline comparison -> temporal window ->
 *   reliability-aware fusion -> state estimate -> persistence trajectory ->
 *   adaptive decision
 *
 * One call closes one temporal window. Everything the decision rests on is
 * returned on the window itself, so the research panel renders the record rather
 * than recomputing anything, and a reviewer can trace any decision backwards.
 */

import { getLearnerBaseline } from '../../data/learner-state/learnerBaselines';
import { CAMERA_MODE } from '../../data/learner-state/supportCopy';
import {
  degradeVisualFeatures,
  deriveVisualFeatures,
  estimateVisualReliability,
} from './visualFeatures';
import { estimateBehaviorReliability, normaliseBehaviorFeatures } from './behaviorFeatures';
import { compareWithLearnerBaseline } from './learnerBaselineService';
import { fuseLearnerState, VISUAL_LIMITED_THRESHOLD } from './reliabilityFusion';
import { analysePersistenceTrend, scorePersistence } from './persistenceAnalyzer';
import { decideSupport } from './adaptiveDecision';
import { closeTemporalWindow, WINDOW_SECONDS } from './temporalWindow';

/** Camera modes in which no visual signal is available at all. */
const CAMERA_UNAVAILABLE = new Set([CAMERA_MODE.OFF, CAMERA_MODE.DENIED]);

/**
 * Runs one temporal window through every stage.
 *
 * @param {object} input
 * @param {object} input.window        - the open TemporalWindow being closed
 * @param {object} input.visualInput   - `{ frameStats }` or `{ simulated }`
 * @param {object} input.behaviorInput - aggregated behaviour features for the window
 * @param {string} input.cameraMode    - requested camera mode for the session
 * @param {string} input.learnerId
 * @param {Array}  input.history       - closed windows, oldest first
 * @param {number} input.windowsSinceIntervention
 * @param {number} input.priorDisengagementInterventions
 * @param {number} input.endTime
 */
export function runLearnerStateWindow({
  window,
  visualInput = {},
  behaviorInput = {},
  cameraMode = CAMERA_MODE.ACTIVE,
  learnerId,
  history = [],
  windowsSinceIntervention = Infinity,
  priorDisengagementInterventions = 0,
  endTime = Date.now(),
} = {}) {
  const cameraAvailable = !CAMERA_UNAVAILABLE.has(cameraMode);

  // 1. Feature pipelines. A LIMITED camera mode degrades the capture itself, so
  //    the drop in reliability downstream is measured rather than asserted.
  const rawVisual = cameraAvailable ? deriveVisualFeatures(visualInput) : deriveVisualFeatures({});
  const visualFeatures =
    cameraMode === CAMERA_MODE.LIMITED ? degradeVisualFeatures(rawVisual) : rawVisual;
  const behaviorFeatures = normaliseBehaviorFeatures(behaviorInput, {
    windowSeconds: WINDOW_SECONDS,
  });

  // 2. Reliability estimation, independent of what the features seem to mean.
  const visualReliability = estimateVisualReliability(visualFeatures, { cameraAvailable });
  const behaviorReliability = estimateBehaviorReliability(behaviorFeatures, {
    windowSeconds: WINDOW_SECONDS,
    windowElapsedSec: Math.max(0, (endTime - window.startTime) / 1000),
  });

  // 3. Learner-specific baseline comparison. Every downstream threshold reads
  //    the deviations produced here rather than the raw readings.
  const baseline = getLearnerBaseline(learnerId);
  const baselineDeviation = compareWithLearnerBaseline(
    { visualFeatures, behaviorFeatures },
    baseline
  );

  // 4/5. Reliability-aware fusion into the two learner states.
  const stateEstimate = fuseLearnerState({
    visualFeatures,
    behaviorFeatures,
    visualReliability: visualReliability.score,
    behaviorReliability: behaviorReliability.score,
    baselineDeviation,
    cameraAvailable,
  });

  // 6. Persistence for this window, then the trajectory across recent windows.
  const persistenceScore = scorePersistence({
    behaviorFeatures,
    baselineDeviation,
    visualFeatures: cameraAvailable ? visualFeatures : null,
  });
  const persistence = analysePersistenceTrend(history, persistenceScore);

  // 7. The decision, which is the only stage allowed to talk about support.
  const decision = decideSupport({
    stateEstimate,
    persistence,
    baselineDeviation,
    behaviorFeatures,
    history,
    windowsSinceIntervention,
    priorDisengagementInterventions,
  });

  const effectiveCameraMode = resolveCameraMode(cameraMode, visualReliability.score);

  const closed = closeTemporalWindow(
    {
      ...window,
      visualFeatures,
      behaviorFeatures,
      reliability: {
        visual: visualReliability.score,
        behavior: behaviorReliability.score,
        visualDetail: visualReliability,
        behaviorDetail: behaviorReliability,
      },
      weights: {
        visual: stateEstimate.visualWeight,
        behavior: stateEstimate.behaviorWeight,
      },
      baselineDeviation,
      stateEstimate,
      persistenceScore,
      persistence,
      decision,
      cameraMode: effectiveCameraMode,
    },
    endTime
  );

  return closed;
}

/**
 * The camera state the UI reports.
 *
 * "Limited" is derived, not chosen: a granted camera whose reliability has fallen
 * below the usable band reports as Visual Signal Limited without the learner
 * having changed any setting.
 */
export function resolveCameraMode(requestedMode, visualReliabilityScore) {
  if (CAMERA_UNAVAILABLE.has(requestedMode)) return requestedMode;
  if (visualReliabilityScore < VISUAL_LIMITED_THRESHOLD) return CAMERA_MODE.LIMITED;
  return CAMERA_MODE.ACTIVE;
}

/** True when the estimate is currently carried by behaviour alone. */
export function isBehaviorOnly(window) {
  return (window?.weights?.visual ?? 0) === 0;
}
