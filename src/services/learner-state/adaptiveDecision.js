/**
 * Persistence-aware adaptive decision making. Pure module.
 *
 * The rule this component exists to demonstrate: detecting confusion is NOT a
 * reason to interrupt. Confusion while persistence holds is productive, and the
 * correct action is to stay out of the way. Confusion that survives several
 * windows while persistence drains is the case worth intervening in.
 *
 * Disengagement is a separate branch with separate actions. Offering a hint to a
 * disengaged learner answers a question they have stopped asking.
 */

import { CLASSIFICATION, SUPPORT_NEED, SUPPORT_TYPE } from '../../data/learner-state/supportCopy';
import { PERSISTENCE_TREND } from './persistenceAnalyzer';
import {
  PERSISTENT_CONFUSION_WINDOWS,
  trailingConfusionWindows,
  trailingDisengagementWindows,
} from './temporalWindow';
import { round2 } from './mathUtils';

export const THRESHOLDS = {
  CONFUSION_ELEVATED: 0.5,
  CONFUSION_HIGH: 0.62,
  DISENGAGEMENT_ELEVATED: 0.55,
  DISENGAGEMENT_HIGH: 0.68,
  PERSISTENCE_HEALTHY: 0.5,
  PERSISTENCE_LOW: 0.42,
  /** Response time this far above the learner's own norm counts as substantial. */
  RESPONSE_TIME_SIGMA: 2,
};

/** Windows to wait after an intervention before another may fire. */
export const INTERVENTION_COOLDOWN_WINDOWS = 3;

/**
 * Safety valve. Confusion that has held this long is escalated even while
 * persistence still looks healthy, because "productive" stops being a fair
 * description of a struggle that has run for roughly two minutes unbroken.
 */
export const EXTENDED_CONFUSION_WINDOWS = 6;

/**
 * Chooses the support need and type for the window being closed.
 *
 * @param {object} input
 * @param {object} input.stateEstimate     - output of `fuseLearnerState`
 * @param {object} input.persistence       - output of `analysePersistenceTrend`
 * @param {object} input.baselineDeviation - output of `compareWithLearnerBaseline`
 * @param {object} input.behaviorFeatures  - the window's behaviour vector
 * @param {Array}  input.history           - closed windows, oldest first
 * @param {number} input.windowsSinceIntervention
 * @param {number} input.priorDisengagementInterventions - re-engagement offers already made this session
 */
export function decideSupport({
  stateEstimate,
  persistence,
  baselineDeviation = {},
  behaviorFeatures = {},
  history = [],
  windowsSinceIntervention = Infinity,
  priorDisengagementInterventions = 0,
} = {}) {
  const confusion = stateEstimate?.confusionProbability ?? 0;
  const disengagement = stateEstimate?.disengagementProbability ?? 0;
  const persistenceScore = persistence?.current ?? null;
  const trend = persistence?.trend ?? PERSISTENCE_TREND.UNKNOWN;

  const confusionRun = trailingConfusionWindows(history, THRESHOLDS.CONFUSION_ELEVATED) + 1;
  const disengagementRun =
    trailingDisengagementWindows(history, THRESHOLDS.DISENGAGEMENT_ELEVATED) + 1;

  const rationale = [];
  const inCooldown = windowsSinceIntervention < INTERVENTION_COOLDOWN_WINDOWS;

  // Disengagement is checked first: a learner who has stopped engaging cannot
  // use a hint about the current question.
  if (disengagement >= THRESHOLDS.DISENGAGEMENT_ELEVATED) {
    if (!stateEstimate?.disengagementCorroborated) {
      rationale.push('Gaze-away evidence was not corroborated by learning behaviour.');
    } else {
      rationale.push(
        `Disengagement ${fmt(disengagement)} across ${disengagementRun} window${plural(disengagementRun)}.`
      );
      if ((baselineDeviation.inactivitySecZ ?? 0) >= 1.5) {
        rationale.push(`Inactivity ${sigma(baselineDeviation.inactivitySecZ)} above own norm.`);
      }
      if ((baselineDeviation.interactionsPerMinuteZ ?? 0) <= -1) {
        rationale.push('Interaction rate has fallen below own norm.');
      }

      if (inCooldown) {
        return decision({
          classification: CLASSIFICATION.DISENGAGEMENT,
          supportNeed: SUPPORT_NEED.MONITOR,
          supportType: SUPPORT_TYPE.NONE,
          confusion,
          disengagement,
          persistenceScore,
          trend,
          confusionRun,
          disengagementRun,
          rationale: [...rationale, 'Support recently offered. Holding for the cooldown window.'],
        });
      }

      // One window is not a pattern. A single quiet window is watched; acting
      // needs either a second agreeing window or an unambiguous reading.
      const established =
        disengagementRun >= 2 || disengagement >= THRESHOLDS.DISENGAGEMENT_HIGH;

      if (!established) {
        return decision({
          classification: CLASSIFICATION.DISENGAGEMENT,
          supportNeed: SUPPORT_NEED.MONITOR,
          supportType: SUPPORT_TYPE.NONE,
          confusion,
          disengagement,
          persistenceScore,
          trend,
          confusionRun,
          disengagementRun,
          rationale: [...rationale, 'First window only. Waiting for a second window to agree.'],
        });
      }

      // A nudge comes first. Only when a re-engagement offer has already been
      // made and not taken does the activity itself get changed.
      const wantsChange = priorDisengagementInterventions >= 1;

      return decision({
        classification: CLASSIFICATION.DISENGAGEMENT,
        supportNeed: SUPPORT_NEED.INTERVENE,
        supportType: wantsChange ? SUPPORT_TYPE.ACTIVITY_ADJUSTMENT : SUPPORT_TYPE.REENGAGEMENT,
        confusion,
        disengagement,
        persistenceScore,
        trend,
        confusionRun,
        disengagementRun,
        rationale: [
          ...rationale,
          wantsChange
            ? 'A re-engagement prompt has already been offered. Offering an activity change or a break.'
            : 'Offering a short re-engagement challenge.',
        ],
      });
    }
  }

  if (confusion >= THRESHOLDS.CONFUSION_ELEVATED) {
    rationale.push(
      `Confusion ${fmt(confusion)} across ${confusionRun} window${plural(confusionRun)}.`
    );

    const responseTimeZ = baselineDeviation.responseTimeSecZ ?? 0;
    const slowForLearner = responseTimeZ >= THRESHOLDS.RESPONSE_TIME_SIGMA;
    const repeatedErrors =
      (behaviorFeatures.incorrectAttempts ?? 0) >= 2 ||
      (behaviorFeatures.repeatedAttempts ?? 0) >= 2;

    if (slowForLearner) {
      rationale.push(`Response time ${sigma(responseTimeZ)} above own baseline.`);
    }

    const persistenceHolding =
      persistenceScore != null && persistenceScore >= THRESHOLDS.PERSISTENCE_HEALTHY;
    const persistenceDraining =
      trend === PERSISTENCE_TREND.FALLING ||
      (persistenceScore != null && persistenceScore < THRESHOLDS.PERSISTENCE_LOW);

    // Duration alone is not grounds to interrupt. Confusion that has lasted
    // several windows escalates when effort is NOT holding up; the extended
    // valve covers the case where it holds up for an implausibly long time.
    const persistentConfusion =
      (confusionRun >= PERSISTENT_CONFUSION_WINDOWS && !persistenceHolding) ||
      confusionRun >= EXTENDED_CONFUSION_WINDOWS;

    // PRODUCTIVE CONFUSION: still trying, and the struggle has not yet run long.
    if (persistenceHolding && !persistenceDraining && !persistentConfusion) {
      rationale.push(
        `Persistence ${fmt(persistenceScore)} and ${trend}. Learner is still working through it.`
      );
      return decision({
        classification: CLASSIFICATION.PRODUCTIVE_CONFUSION,
        supportNeed: SUPPORT_NEED.MONITOR,
        supportType:
          confusion >= THRESHOLDS.CONFUSION_HIGH
            ? SUPPORT_TYPE.LIGHT_ENCOURAGEMENT
            : SUPPORT_TYPE.NONE,
        confusion,
        disengagement,
        persistenceScore,
        trend,
        confusionRun,
        disengagementRun,
        rationale: [...rationale, 'Productive confusion. Allowing thinking time.'],
      });
    }

    // INTERVENTION-WORTHY CONFUSION: it has lasted, and effort is draining.
    if (persistentConfusion || persistenceDraining) {
      if (persistenceDraining) rationale.push(`Persistence trend is ${trend}.`);
      if (persistentConfusion) {
        rationale.push(
          `Confusion has held for ${confusionRun} consecutive windows while effort was not holding up.`
        );
      }

      if (inCooldown) {
        return decision({
          classification: CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION,
          supportNeed: SUPPORT_NEED.MONITOR,
          supportType: SUPPORT_TYPE.NONE,
          confusion,
          disengagement,
          persistenceScore,
          trend,
          confusionRun,
          disengagementRun,
          rationale: [...rationale, 'Support recently offered. Holding for the cooldown window.'],
        });
      }

      // A scaffold is the heavier request, reserved for the case a hint plainly
      // would not cover: high confusion, repeated errors, and a response time
      // well outside this learner's own range.
      const wantsScaffold =
        confusion >= THRESHOLDS.CONFUSION_HIGH && repeatedErrors && slowForLearner;

      return decision({
        classification: CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION,
        supportNeed: SUPPORT_NEED.INTERVENE,
        supportType: wantsScaffold ? SUPPORT_TYPE.SCAFFOLD : SUPPORT_TYPE.HINT,
        confusion,
        disengagement,
        persistenceScore,
        trend,
        confusionRun,
        disengagementRun,
        requiresTutorHandoff: wantsScaffold,
        rationale: [
          ...rationale,
          wantsScaffold
            ? 'Requesting a step-by-step scaffold from the AI Tutor.'
            : 'Requesting a hint.',
        ],
      });
    }

    // Elevated, but not yet resolvable either way: keep watching.
    return decision({
      classification: CLASSIFICATION.PRODUCTIVE_CONFUSION,
      supportNeed: SUPPORT_NEED.MONITOR,
      supportType: SUPPORT_TYPE.NONE,
      confusion,
      disengagement,
      persistenceScore,
      trend,
      confusionRun,
      disengagementRun,
      rationale: [...rationale, 'Not enough persistence history yet. Continuing to observe.'],
    });
  }

  return decision({
    classification: CLASSIFICATION.ENGAGED,
    supportNeed: SUPPORT_NEED.NONE,
    supportType: SUPPORT_TYPE.NONE,
    confusion,
    disengagement,
    persistenceScore,
    trend,
    confusionRun: 0,
    disengagementRun: 0,
    rationale: ['No elevated confusion or disengagement in this window.'],
  });
}

function decision(fields) {
  return {
    requiresTutorHandoff: false,
    ...fields,
    confidence: computeConfidence(fields),
  };
}

/**
 * Reporting confidence for the decision.
 *
 * Grows with the strength of the estimate and with how many consecutive windows
 * agree, which is what makes a multi-window decision more defensible than a
 * single reading. Not a statistically validated figure.
 */
export function computeConfidence({ confusion = 0, disengagement = 0, confusionRun = 0, trend }) {
  const strength = Math.max(confusion, disengagement);
  const runBonus = Math.min(0.12, 0.04 * Math.max(0, confusionRun - 1));
  const trendBonus = trend === PERSISTENCE_TREND.FALLING ? 0.06 : 0;
  return round2(Math.min(0.95, 0.45 + 0.45 * strength + runBonus + trendBonus));
}

export const DECISION_CAVEAT =
  'Prototype estimate. Probabilities and confidence are not statistically validated.';

function fmt(value) {
  return value == null ? '—' : value.toFixed(2);
}

function sigma(z) {
  return `${z > 0 ? '+' : ''}${z.toFixed(1)}σ`;
}

function plural(count) {
  return count === 1 ? '' : 's';
}
