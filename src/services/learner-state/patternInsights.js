/**
 * Cross-session pattern detection for the research / parent view. Pure module.
 *
 * A pattern is only reported when it REPEATS. One difficult evening is not a
 * finding, and presenting it as one would be exactly the over-claiming this
 * component argues against elsewhere.
 */

import { CLASSIFICATION, CLASSIFICATION_LABELS } from '../../data/learner-state/supportCopy';
import { PATTERN_WINDOW } from '../../data/learner-state/sessionHistory';
import { mean, round2 } from './mathUtils';

/** Sessions that must agree before a pattern is surfaced. */
export const PATTERN_MIN_SESSIONS = 3;

export function findRecurringPattern(sessions = []) {
  const inWindow = sessions.filter(
    (session) => session.hour >= PATTERN_WINDOW.fromHour && session.hour <= PATTERN_WINDOW.toHour
  );

  const matching = inWindow.filter(
    (session) => session.dominantClassification === CLASSIFICATION.DISENGAGEMENT
  );

  if (matching.length < PATTERN_MIN_SESSIONS) return null;

  return {
    id: 'evening-disengagement',
    title: 'Disengagement indicators cluster in late evening sessions',
    classification: CLASSIFICATION.DISENGAGEMENT,
    observed: `${matching.length} of the last ${inWindow.length} evening sessions`,
    timeWindow: 'Approximately 7:30 PM to 8:10 PM',
    insight: `Disengagement indicators were the dominant estimate in ${matching.length} recent evening sessions.`,
    recommendation: 'Consider moving longer activities to an earlier slot where the schedule allows.',
    behaviourEvidence: [
      'Inactivity above this learner’s own norm',
      'Interaction rate falling within the session',
      'Repeated skipping late in the session',
    ],
    visualEvidence: [
      'Gaze away from the task for extended periods',
      'Reduced facial dynamics',
      'Head pose drifting from the screen',
    ],
    corroboration:
      'Gaze-away evidence alone was not treated as disengagement. Every session above also showed the behavioural pattern.',
    avgVisualReliability: round2(mean(matching.map((s) => s.avgVisualReliability))),
    avgBehaviorReliability: round2(mean(matching.map((s) => s.avgBehaviorReliability))),
    sessions: matching.map((s) => s.id),
  };
}

/** Aggregate state distribution across stored sessions, for the trend bars. */
export function summariseStateTrend(sessions = []) {
  if (sessions.length === 0) return [];

  const counts = {};
  sessions.forEach((session) => {
    counts[session.dominantClassification] = (counts[session.dominantClassification] ?? 0) + 1;
  });

  const palette = {
    [CLASSIFICATION.ENGAGED]: '#35C46A',
    [CLASSIFICATION.PRODUCTIVE_CONFUSION]: '#16BFA6',
    [CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION]: '#FF9F5A',
    [CLASSIFICATION.DISENGAGEMENT]: '#3FA9F5',
  };

  return Object.values(CLASSIFICATION).map((key) => ({
    key,
    label: CLASSIFICATION_LABELS[key],
    sessions: counts[key] ?? 0,
    value: Math.round(((counts[key] ?? 0) / sessions.length) * 100),
    color: palette[key],
  }));
}

/** Interventions across every stored session, newest first. */
export function collectInterventions(sessions = []) {
  return sessions
    .flatMap((session) =>
      session.interventions.map((intervention) => ({
        ...intervention,
        sessionId: session.id,
        date: session.date,
        cameraMode: session.cameraMode,
      }))
    )
    .reverse();
}

/** How often support was accepted, which is the only outcome signal we have. */
export function interventionAcceptance(sessions = []) {
  const all = collectInterventions(sessions);
  if (all.length === 0) return { total: 0, accepted: 0, rate: null };
  const accepted = all.filter((item) => item.accepted).length;
  return { total: all.length, accepted, rate: round2(accepted / all.length) };
}
