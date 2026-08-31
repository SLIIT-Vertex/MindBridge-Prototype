/**
 * Learner-specific behavioural baselines.
 *
 * The research claim of this component is that a raw threshold ("a 20 second
 * response means confusion") is not learner-neutral. Every comparison is made
 * against the learner's OWN history, expressed as mean + standard deviation so a
 * deviation can be reported in sigma rather than seconds.
 *
 * Two contrasting profiles ship with the prototype precisely so the difference
 * is demonstrable: a 20s response is +0.4 sigma for Kavindu and +3.3 sigma for
 * Nethmi. A production build would compute these from the learner's rolling
 * session store; the shape below is the contract that store must satisfy.
 */

export const BASELINE_FIELDS = [
  { key: 'responseTimeSec', label: 'Response time', unit: 's', higherIsStruggle: true },
  { key: 'inactivitySec', label: 'Inactivity', unit: 's', higherIsStruggle: true },
  { key: 'attemptsPerItem', label: 'Attempts per item', unit: '', higherIsStruggle: true },
  { key: 'recentAccuracy', label: 'Recent accuracy', unit: '', higherIsStruggle: false },
  { key: 'hintsPerActivity', label: 'Hint usage', unit: '', higherIsStruggle: true },
  { key: 'interactionsPerMinute', label: 'Interaction rate', unit: '/min', higherIsStruggle: false },
  { key: 'gazeOnTaskRatio', label: 'Gaze on task', unit: '', higherIsStruggle: false },
];

/** A deliberately deliberate, slow-and-steady learner. */
const KAVINDU = {
  learnerId: 'learner-kavindu',
  learnerName: 'Kavindu',
  grade: 5,
  sessionsObserved: 14,
  updatedAt: '2026-08-29',
  note: 'Takes time by preference. Long responses are normal, not a struggle signal.',
  typical: {
    responseTimeSec: 18,
    inactivitySec: 6,
    attemptsPerItem: 1.4,
    recentAccuracy: 0.78,
    hintsPerActivity: 0.6,
    interactionsPerMinute: 5.2,
    gazeOnTaskRatio: 0.82,
  },
  sd: {
    responseTimeSec: 5,
    inactivitySec: 3,
    attemptsPerItem: 0.5,
    recentAccuracy: 0.12,
    hintsPerActivity: 0.5,
    interactionsPerMinute: 1.6,
    gazeOnTaskRatio: 0.09,
  },
};

/** A fast responder. The same 20s response is a strong deviation here. */
const NETHMI = {
  learnerId: 'learner-nethmi',
  learnerName: 'Nethmi',
  grade: 5,
  sessionsObserved: 11,
  updatedAt: '2026-08-28',
  note: 'Answers quickly. A long pause is unusual and carries more meaning.',
  typical: {
    responseTimeSec: 7,
    inactivitySec: 3,
    attemptsPerItem: 1.1,
    recentAccuracy: 0.86,
    hintsPerActivity: 0.2,
    interactionsPerMinute: 9.4,
    gazeOnTaskRatio: 0.88,
  },
  sd: {
    responseTimeSec: 4,
    inactivitySec: 2,
    attemptsPerItem: 0.35,
    recentAccuracy: 0.1,
    hintsPerActivity: 0.3,
    interactionsPerMinute: 2.4,
    gazeOnTaskRatio: 0.07,
  },
};

export const LEARNER_BASELINES = {
  [KAVINDU.learnerId]: KAVINDU,
  [NETHMI.learnerId]: NETHMI,
};

export const DEFAULT_LEARNER_ID = KAVINDU.learnerId;

export function getLearnerBaseline(learnerId = DEFAULT_LEARNER_ID) {
  return LEARNER_BASELINES[learnerId] ?? LEARNER_BASELINES[DEFAULT_LEARNER_ID];
}

/**
 * The contrast used on the research screens: one observation, two learners, two
 * very different meanings. Kept as data so the copy and the maths cannot drift.
 */
export const BASELINE_CONTRAST = {
  observation: 'A 20 second response',
  field: 'responseTimeSec',
  value: 20,
  learnerIds: [KAVINDU.learnerId, NETHMI.learnerId],
};

/**
 * Where a real implementation would persist baselines. A rolling update keeps
 * the baseline adaptive without letting one bad session reshape it.
 */
export const BASELINE_UPDATE_RULE =
  'Rolling mean over the last 14 sessions, updated after each completed session.';
