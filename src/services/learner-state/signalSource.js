/**
 * Window input assembly. Pure module.
 *
 * Turns whatever the session actually has into the two inputs the pipeline
 * expects. Three sources are supported and they are interchangeable, which is
 * what lets a scripted supervisor demo and a live session share one pipeline:
 *
 *   1. scenarioWindowInput - a presenter scenario trajectory
 *   2. liveWindowInput     - real gameplay events plus camera track health
 *   3. a real inference API - drop in at `simulateVisualReading` (see below)
 */

import { aggregateBehaviorEvents } from './behaviorFeatures';
import { getScenario } from '../../data/learner-state/demoScenarios';
import { clamp01 } from './mathUtils';
import { WINDOW_SECONDS } from './temporalWindow';

/**
 * Inputs for window `index` of a presenter scenario.
 *
 * A scenario shorter than the session simply holds its final window, so a
 * scenario can be left running while the point is discussed.
 */
export function scenarioWindowInput(scenarioId, index = 0) {
  const scenario = getScenario(scenarioId);
  if (!scenario) return null;

  const step = scenario.windows[Math.min(index, scenario.windows.length - 1)];
  return {
    visualInput: { simulated: step.visual },
    behaviorInput: step.behavior,
    scenarioLabel: scenario.label,
    stepIndex: Math.min(index, scenario.windows.length - 1),
    stepCount: scenario.windows.length,
  };
}

/**
 * Inputs for a live window.
 *
 * @param {object} input
 * @param {Array}  input.events        - interaction events captured in the window
 * @param {number} input.idleSeconds   - seconds since the last interaction
 * @param {number} input.recentAccuracy
 * @param {number} input.taskCompletionRatio
 * @param {object} input.cameraHealth  - `{ available, trackLive, framesAnalysed }`
 */
export function liveWindowInput({
  events = [],
  idleSeconds = 0,
  recentAccuracy = null,
  taskCompletionRatio = null,
  cameraHealth = { available: false },
} = {}) {
  const behaviorInput = aggregateBehaviorEvents(events, {
    windowSeconds: WINDOW_SECONDS,
    idleSeconds,
    recentAccuracy,
    taskCompletionRatio,
  });

  return {
    visualInput: cameraHealth.available
      ? { simulated: simulateVisualReading({ cameraHealth, behaviorInput, idleSeconds }) }
      : {},
    behaviorInput,
  };
}

/**
 * THE MOCK, AND THE SEAM THAT REPLACES IT.
 *
 * A real build runs a face-landmark / gaze model over the window's frames and
 * returns the same six normalised features. Until that model exists, readings are
 * generated from camera track health plus a weak, deliberately imperfect coupling
 * to what the learner is doing, so the two modalities are neither identical (in
 * which case fusion would be meaningless) nor unrelated (in which case the demo
 * would look random).
 *
 * To go live: replace this function body with the model call. Nothing else in the
 * pipeline changes, because every later stage reads only the returned features.
 */
export function simulateVisualReading({ cameraHealth = {}, behaviorInput = {}, idleSeconds = 0 }) {
  const quality = clamp01(cameraHealth.trackLive ? (cameraHealth.quality ?? 0.85) : 0.3);
  const jitter = (seed) => ((Math.sin(seed * 12.9898) + 1) / 2) * 0.12 - 0.06;
  const seed = (behaviorInput.interactionCount ?? 0) + idleSeconds;

  const busy = clamp01((behaviorInput.interactionCount ?? 0) / 4);
  const struggling = clamp01(
    ((behaviorInput.incorrectAttempts ?? 0) + (behaviorInput.repeatedAttempts ?? 0)) / 4
  );
  const idle = clamp01(idleSeconds / 30);

  return {
    eyeOpenness: clamp01(0.85 - 0.3 * idle + jitter(seed + 1)),
    gazeOnTaskRatio: clamp01(0.88 - 0.5 * idle + 0.05 * busy + jitter(seed + 2)),
    headStability: clamp01(0.85 - 0.3 * idle - 0.15 * struggling + jitter(seed + 3)),
    facialDynamics: clamp01(0.2 + 0.55 * struggling - 0.15 * idle + jitter(seed + 4)),
    faceVisibilityRatio: clamp01(quality * 1.05 + jitter(seed + 5)),
    landmarkConfidence: clamp01(quality + jitter(seed + 6)),
    illuminationQuality: clamp01(quality * 0.98 + jitter(seed + 7)),
    framesAnalysed: cameraHealth.framesAnalysed ?? Math.round(WINDOW_SECONDS * 15),
  };
}
