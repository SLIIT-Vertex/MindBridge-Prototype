/**
 * Presenter scenarios.
 *
 * Each scenario supplies the RAW per-window signal readings only. Nothing here
 * names a state or a decision: the classification still has to fall out of
 * reliability estimation, baseline comparison, fusion and persistence analysis.
 * That is the point — a scripted demo that skipped the pipeline would prove
 * nothing about the pipeline.
 *
 * `windows` is a trajectory, replayed one entry per temporal window, so
 * persistence trends and multi-window persistence rules can actually be seen.
 */

/** Healthy camera readings, spread into each scenario as the starting point. */
const CLEAR_VISUAL = {
  eyeOpenness: 0.82,
  gazeOnTaskRatio: 0.86,
  headStability: 0.84,
  facialDynamics: 0.3,
  faceVisibilityRatio: 0.95,
  landmarkConfidence: 0.91,
  illuminationQuality: 0.88,
  framesAnalysed: 300,
};

const DIM_VISUAL = {
  eyeOpenness: 0.6,
  gazeOnTaskRatio: 0.55,
  headStability: 0.5,
  facialDynamics: 0.35,
  faceVisibilityRatio: 0.38,
  landmarkConfidence: 0.29,
  illuminationQuality: 0.24,
  framesAnalysed: 300,
};

export const DEMO_SCENARIOS = [
  {
    id: 'engaged',
    label: 'Engaged',
    hint: 'Working steadily, both modalities clear.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL },
        behavior: {
          responseTimeSec: 17,
          incorrectAttempts: 0,
          repeatedAttempts: 0,
          hintRequests: 0,
          inactivitySec: 3,
          recentAccuracy: 0.82,
          taskCompletionRatio: 0.8,
          interactionCount: 3,
        },
      },
    ],
  },
  {
    id: 'productive_confusion',
    label: 'Productive confusion',
    hint: 'Struggling, but still actively attempting. Support should hold back.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.83, facialDynamics: 0.62, headStability: 0.72 },
        behavior: {
          responseTimeSec: 29,
          incorrectAttempts: 1,
          repeatedAttempts: 1,
          hintRequests: 0,
          inactivitySec: 4,
          recentAccuracy: 0.62,
          taskCompletionRatio: 0.7,
          interactionCount: 4,
        },
      },
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.81, facialDynamics: 0.66, headStability: 0.7 },
        behavior: {
          responseTimeSec: 31,
          incorrectAttempts: 1,
          repeatedAttempts: 2,
          hintRequests: 0,
          inactivitySec: 3,
          recentAccuracy: 0.6,
          taskCompletionRatio: 0.7,
          interactionCount: 5,
        },
      },
    ],
  },
  {
    id: 'intervention_confusion',
    label: 'Intervention-worthy confusion',
    hint: 'Confusion holds across windows while persistence falls away.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.8, facialDynamics: 0.64, headStability: 0.71 },
        behavior: {
          responseTimeSec: 30,
          incorrectAttempts: 1,
          repeatedAttempts: 1,
          hintRequests: 0,
          inactivitySec: 4,
          recentAccuracy: 0.58,
          taskCompletionRatio: 0.6,
          interactionCount: 4,
        },
      },
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.74, facialDynamics: 0.7, headStability: 0.64 },
        behavior: {
          responseTimeSec: 34,
          incorrectAttempts: 2,
          repeatedAttempts: 2,
          hintRequests: 1,
          inactivitySec: 8,
          recentAccuracy: 0.5,
          taskCompletionRatio: 0.5,
          interactionCount: 3,
        },
      },
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.68, facialDynamics: 0.72, headStability: 0.58 },
        behavior: {
          responseTimeSec: 41,
          incorrectAttempts: 3,
          repeatedAttempts: 3,
          hintRequests: 2,
          inactivitySec: 13,
          recentAccuracy: 0.42,
          taskCompletionRatio: 0.4,
          interactionCount: 2,
        },
      },
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.62, facialDynamics: 0.68, headStability: 0.55 },
        behavior: {
          responseTimeSec: 46,
          incorrectAttempts: 3,
          repeatedAttempts: 4,
          hintRequests: 2,
          inactivitySec: 17,
          recentAccuracy: 0.38,
          taskCompletionRatio: 0.35,
          interactionCount: 1,
        },
      },
    ],
  },
  {
    id: 'disengagement',
    label: 'Disengagement',
    hint: 'Gaze away AND interaction collapsing — both are needed.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.42, facialDynamics: 0.14, headStability: 0.45, eyeOpenness: 0.66 },
        behavior: {
          responseTimeSec: 0,
          incorrectAttempts: 0,
          repeatedAttempts: 0,
          hintRequests: 0,
          inactivitySec: 16,
          recentAccuracy: 0.7,
          taskCompletionRatio: 0.5,
          interactionCount: 1,
        },
      },
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.25, facialDynamics: 0.08, headStability: 0.3, eyeOpenness: 0.58 },
        behavior: {
          responseTimeSec: 0,
          incorrectAttempts: 0,
          repeatedAttempts: 0,
          hintRequests: 0,
          inactivitySec: 26,
          recentAccuracy: 0.7,
          taskCompletionRatio: 0.5,
          interactionCount: 0,
          skips: 1,
        },
      },
    ],
  },
  {
    id: 'gaze_away_only',
    label: 'Gaze away only',
    hint: 'Looking away but still answering — must NOT read as disengagement.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL, gazeOnTaskRatio: 0.22, facialDynamics: 0.12, headStability: 0.28 },
        behavior: {
          responseTimeSec: 16,
          incorrectAttempts: 0,
          repeatedAttempts: 0,
          hintRequests: 0,
          inactivitySec: 2,
          recentAccuracy: 0.84,
          taskCompletionRatio: 0.8,
          interactionCount: 5,
        },
      },
    ],
  },
  {
    id: 'poor_lighting',
    label: 'Poor lighting / face lost',
    hint: 'Visual reliability collapses, so behaviour carries the estimate.',
    windows: [
      {
        visual: { ...DIM_VISUAL },
        behavior: {
          responseTimeSec: 38,
          incorrectAttempts: 3,
          repeatedAttempts: 3,
          hintRequests: 1,
          inactivitySec: 14,
          recentAccuracy: 0.44,
          taskCompletionRatio: 0.4,
          interactionCount: 3,
        },
      },
      {
        visual: { ...DIM_VISUAL, faceVisibilityRatio: 0.2, landmarkConfidence: 0.18 },
        behavior: {
          responseTimeSec: 44,
          incorrectAttempts: 3,
          repeatedAttempts: 4,
          hintRequests: 2,
          inactivitySec: 19,
          recentAccuracy: 0.4,
          taskCompletionRatio: 0.35,
          interactionCount: 2,
        },
      },
    ],
  },
  {
    id: 'thin_behaviour',
    label: 'Sparse behaviour evidence',
    hint: 'Window just opened — behaviour weight drops until evidence arrives.',
    windows: [
      {
        visual: { ...CLEAR_VISUAL, facialDynamics: 0.55, gazeOnTaskRatio: 0.8 },
        behavior: {
          responseTimeSec: 0,
          incorrectAttempts: 0,
          repeatedAttempts: 0,
          hintRequests: 0,
          inactivitySec: 4,
          recentAccuracy: 0.72,
          taskCompletionRatio: 0.6,
          interactionCount: 0,
        },
      },
    ],
  },
];

export function getScenario(id) {
  return DEMO_SCENARIOS.find((scenario) => scenario.id === id) ?? null;
}

export const DEMO_BANNER = 'Prototype demo \u2014 signals are simulated, the pipeline is real.';
