/**
 * Historical sessions for the research / admin view.
 *
 * Every record carries the reliability and weighting that produced its decision,
 * because "confusion 0.72" without "visual reliability 0.31, behaviour weight
 * 75%" is not a reviewable claim.
 */

import { CLASSIFICATION, SUPPORT_TYPE } from './supportCopy';
import { CAMERA_MODE } from './supportCopy';

export const SESSION_HISTORY = [
  {
    id: 'session-05',
    date: 'Aug 30',
    day: 'Saturday',
    startTime: '4:05 PM',
    endTime: '4:31 PM',
    hour: 16.08,
    cameraMode: CAMERA_MODE.ACTIVE,
    windows: 78,
    avgVisualReliability: 0.86,
    avgBehaviorReliability: 0.81,
    avgVisualWeight: 0.52,
    peakConfusion: 0.44,
    peakDisengagement: 0.21,
    dominantClassification: CLASSIFICATION.ENGAGED,
    interventions: [],
  },
  {
    id: 'session-04',
    date: 'Aug 29',
    day: 'Friday',
    startTime: '7:38 PM',
    endTime: '8:06 PM',
    hour: 19.63,
    cameraMode: CAMERA_MODE.ACTIVE,
    windows: 84,
    avgVisualReliability: 0.79,
    avgBehaviorReliability: 0.88,
    avgVisualWeight: 0.47,
    peakConfusion: 0.51,
    peakDisengagement: 0.74,
    dominantClassification: CLASSIFICATION.DISENGAGEMENT,
    interventions: [
      { atMinute: 19, type: SUPPORT_TYPE.REENGAGEMENT, accepted: true, persistenceTrend: 'falling' },
      { atMinute: 24, type: SUPPORT_TYPE.ACTIVITY_ADJUSTMENT, accepted: true, persistenceTrend: 'falling' },
    ],
  },
  {
    id: 'session-03',
    date: 'Aug 27',
    day: 'Wednesday',
    startTime: '5:10 PM',
    endTime: '5:34 PM',
    hour: 17.16,
    cameraMode: CAMERA_MODE.LIMITED,
    windows: 72,
    avgVisualReliability: 0.33,
    avgBehaviorReliability: 0.9,
    avgVisualWeight: 0.19,
    peakConfusion: 0.77,
    peakDisengagement: 0.28,
    dominantClassification: CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION,
    interventions: [
      { atMinute: 11, type: SUPPORT_TYPE.HINT, accepted: true, persistenceTrend: 'falling' },
      { atMinute: 18, type: SUPPORT_TYPE.SCAFFOLD, accepted: true, persistenceTrend: 'falling' },
    ],
  },
  {
    id: 'session-02',
    date: 'Aug 26',
    day: 'Tuesday',
    startTime: '7:42 PM',
    endTime: '8:10 PM',
    hour: 19.7,
    cameraMode: CAMERA_MODE.DENIED,
    windows: 81,
    avgVisualReliability: 0,
    avgBehaviorReliability: 0.87,
    avgVisualWeight: 0,
    peakConfusion: 0.68,
    peakDisengagement: 0.35,
    dominantClassification: CLASSIFICATION.PRODUCTIVE_CONFUSION,
    interventions: [
      { atMinute: 22, type: SUPPORT_TYPE.LIGHT_ENCOURAGEMENT, accepted: true, persistenceTrend: 'steady' },
    ],
  },
  {
    id: 'session-01',
    date: 'Aug 24',
    day: 'Sunday',
    startTime: '7:35 PM',
    endTime: '8:00 PM',
    hour: 19.58,
    cameraMode: CAMERA_MODE.ACTIVE,
    windows: 74,
    avgVisualReliability: 0.72,
    avgBehaviorReliability: 0.85,
    avgVisualWeight: 0.44,
    peakConfusion: 0.49,
    peakDisengagement: 0.71,
    dominantClassification: CLASSIFICATION.DISENGAGEMENT,
    interventions: [
      { atMinute: 17, type: SUPPORT_TYPE.REENGAGEMENT, accepted: false, persistenceTrend: 'falling' },
      { atMinute: 21, type: SUPPORT_TYPE.REENGAGEMENT, accepted: true, persistenceTrend: 'falling' },
    ],
  },
];

/**
 * Aggregate reliability picture across the stored sessions, used by the
 * research view to show that modality weighting genuinely moves between
 * sessions rather than sitting at a fixed 50/50.
 */
export const RELIABILITY_SUMMARY = SESSION_HISTORY.map((session) => ({
  id: session.id,
  label: session.date,
  visual: session.avgVisualReliability,
  behavior: session.avgBehaviorReliability,
  visualWeight: session.avgVisualWeight,
  cameraMode: session.cameraMode,
}));

/** Late-evening disengagement is the pattern the prototype is scripted to find. */
export const PATTERN_WINDOW = { fromHour: 19, toHour: 20.5 };
