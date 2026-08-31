/**
 * Temporal windowing. Pure module.
 *
 * A single frame or a single wrong answer is NOT a learner state. Everything the
 * component decides is computed over an aggregation window, and every window
 * carries the evidence that produced it so a decision stays auditable.
 *
 * Window length sits inside the 15-30 second band the research design specifies.
 * Shorter and a pause to think reads as a state; longer and support arrives after
 * the moment it was needed.
 */

import { round2 } from './mathUtils';

export const WINDOW_SECONDS = 20;
export const WINDOW_RANGE_SECONDS = [15, 30];
export const WINDOW_MS = WINDOW_SECONDS * 1000;

/** How many closed windows are kept for trend analysis. */
export const WINDOW_HISTORY_LIMIT = 12;

/** Windows of confusion evidence required before confusion counts as persistent. */
export const PERSISTENT_CONFUSION_WINDOWS = 3;

let windowCounter = 0;

/**
 * A TemporalWindow. Every field the research design names is present from
 * creation, so a partially-filled window is still a valid, inspectable record.
 */
export function createTemporalWindow({ startTime = Date.now(), index } = {}) {
  windowCounter += 1;
  return {
    id: `w${index ?? windowCounter}`,
    index: index ?? windowCounter,
    startTime,
    endTime: null,
    durationSec: 0,
    visualFeatures: null,
    behaviorFeatures: null,
    reliability: { visual: 0, behavior: 0 },
    weights: { visual: 0, behavior: 1 },
    baselineDeviation: null,
    stateEstimate: null,
    persistenceScore: null,
    decision: null,
    cameraMode: null,
  };
}

export function resetWindowCounter() {
  windowCounter = 0;
}

/** Closes a window at `endTime` and stamps its measured duration. */
export function closeTemporalWindow(window, endTime = Date.now()) {
  const durationSec = round2(Math.max(0, (endTime - window.startTime) / 1000)) ?? 0;
  return { ...window, endTime, durationSec };
}

/** Appends a closed window, keeping the history bounded. */
export function pushWindow(history = [], window) {
  return [...history, window].slice(-WINDOW_HISTORY_LIMIT);
}

/** Trailing windows whose confusion estimate is at or above `threshold`. */
export function trailingConfusionWindows(history = [], threshold = 0.5) {
  let count = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const confusion = history[i]?.stateEstimate?.confusionProbability ?? 0;
    if (confusion < threshold) break;
    count += 1;
  }
  return count;
}

/** Trailing windows whose disengagement estimate is at or above `threshold`. */
export function trailingDisengagementWindows(history = [], threshold = 0.5) {
  let count = 0;
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const value = history[i]?.stateEstimate?.disengagementProbability ?? 0;
    if (value < threshold) break;
    count += 1;
  }
  return count;
}

/** Window label for the research panel, e.g. "W7 - 00:20 to 00:40". */
export function formatWindowRange(window, sessionStart) {
  if (!window) return '\u2014';
  const from = Math.max(0, Math.round(((window.startTime ?? 0) - (sessionStart ?? 0)) / 1000));
  const to = Math.max(from, Math.round(((window.endTime ?? Date.now()) - (sessionStart ?? 0)) / 1000));
  return `${window.id.toUpperCase()} \u00B7 ${clock(from)}\u2013${clock(to)}`;
}

function clock(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
