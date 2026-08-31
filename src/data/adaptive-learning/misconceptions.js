/**
 * Candidate misunderstandings for skill GI-PS-01 and the likelihood weights that
 * drive the belief update. The weights are hand-tuned for a reproducible demo and
 * carry no empirical calibration — never present the output as a finding.
 */

export const ERROR_CODES = {
  ROTATION_DIRECTION_CONFUSION: 'ROTATION_DIRECTION_CONFUSION',
  SEQUENCE_RULE_CONFUSION: 'SEQUENCE_RULE_CONFUSION',
  POSITION_TRACKING_WEAKNESS: 'POSITION_TRACKING_WEAKNESS',
};

/** Child-safe phrasing for each error code, used in the Research View only. */
export const ERROR_CODE_LABELS = {
  ROTATION_DIRECTION_CONFUSION: 'Rotation Direction Confusion',
  SEQUENCE_RULE_CONFUSION: 'Sequence Rule Confusion',
  POSITION_TRACKING_WEAKNESS: 'Position Tracking Weakness',
};

export const MISCONCEPTIONS = [
  {
    id: 'M1',
    key: 'rotationDirection',
    label: 'Rotation-Direction Confusion',
    desc: 'Recognizes rotation but applies the direction incorrectly.',
  },
  {
    id: 'M2',
    key: 'sequenceRule',
    label: 'Sequence-Rule Confusion',
    desc: 'Does not consistently identify the repeating transformation rule.',
  },
  {
    id: 'M3',
    key: 'positionTracking',
    label: 'Position-Tracking Weakness',
    desc: "Loses track of how an object's marked position changes.",
  },
  {
    id: 'M4',
    key: 'other',
    label: 'Other / Uncertain',
    desc: 'Remaining probability mass held back rather than forced onto one cause.',
  },
];

/** Uniform prior — the model starts by assuming nothing. */
export const DEFAULT_BELIEFS = {
  rotationDirection: 0.25,
  sequenceRule: 0.25,
  positionTracking: 0.25,
  other: 0.25,
};

/**
 * Multiplicative weights, applied once per incorrect gameplay event and then
 * renormalised. The ROTATION_DIRECTION_CONFUSION row is tuned so three such
 * events from the uniform prior land on 62 / 23 / 10 / 5.
 */
export const LIKELIHOODS = {
  ROTATION_DIRECTION_CONFUSION: {
    rotationDirection: 1.39,
    sequenceRule: 1.0,
    positionTracking: 0.76,
    other: 0.6,
  },
  SEQUENCE_RULE_CONFUSION: {
    rotationDirection: 0.8,
    sequenceRule: 1.45,
    positionTracking: 0.9,
    other: 0.65,
  },
  POSITION_TRACKING_WEAKNESS: {
    rotationDirection: 0.8,
    sequenceRule: 0.9,
    positionTracking: 1.45,
    other: 0.65,
  },
};

export const BELIEF_KEYS = MISCONCEPTIONS.map((m) => m.key);

/** Labels shown alongside the probability bars. */
export const MODEL_LABEL = 'Prototype Probabilistic Learner Model';
export const MODEL_SUBTITLE =
  'The system keeps multiple possible explanations instead of assuming one cause is certain.';

export function getMisconceptionByKey(key) {
  return MISCONCEPTIONS.find((m) => m.key === key) ?? null;
}
