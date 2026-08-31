/**
 * Question bank for skill GI-PS-01 (Pattern & Sequence Reasoning).
 *
 * ROTATION CONTRACT (must match SymbolRenderer):
 *   0 = up      90 = right (one quarter turn CLOCKWISE)
 * 180 = down   270 = left
 *  45 = up-right   135 = down-right   225 = down-left   315 = up-left
 *
 * Every distractor carries an `errorCode` (null on the correct option), which is
 * what the misconception model reads. `demoScenario.js` refers to these option
 * ids, so the two files must stay in sync.
 */

import { ERROR_CODES } from './misconceptions';

const SKILL_ID = 'GI-PS-01';

const CLOCKWISE_90 = { type: 'rotation', direction: 'clockwise', degrees: 90 };
const ALTERNATING = { type: 'alternating-position', direction: 'swap', degrees: 0 };

const { ROTATION_DIRECTION_CONFUSION, SEQUENCE_RULE_CONFUSION, POSITION_TRACKING_WEAKNESS } =
  ERROR_CODES;

/** Phase 4 — three unsupported items that measure Unsupported Before. */
export const BASELINE_QUESTIONS = [
  {
    id: 'GI-PS-B01',
    phase: 'baseline',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Which arrow comes next?',
    sequence: [
      { symbol: 'arrow', rotation: 0 },
      { symbol: 'arrow', rotation: 90 },
      { symbol: 'arrow', rotation: 180 },
    ],
    options: [
      { id: 'A', symbol: 'arrow', rotation: 90, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'B', symbol: 'arrow', rotation: 270, errorCode: null },
      { id: 'C', symbol: 'arrow', rotation: 0, errorCode: SEQUENCE_RULE_CONFUSION },
    ],
    correctOption: 'B',
    rule: CLOCKWISE_90,
    ruleText: 'Rotate 90 degrees clockwise each step.',
  },
  {
    id: 'GI-PS-B02',
    phase: 'baseline',
    skillId: SKILL_ID,
    type: 'alternating-position',
    prompt: 'Which pair comes next?',
    sequence: [
      { symbol: 'pair', order: 'dot-square' },
      { symbol: 'pair', order: 'square-dot' },
      { symbol: 'pair', order: 'dot-square' },
    ],
    options: [
      { id: 'A', symbol: 'pair', order: 'dot-square', errorCode: SEQUENCE_RULE_CONFUSION },
      { id: 'B', symbol: 'pair', order: 'square-dot', errorCode: null },
      { id: 'C', symbol: 'pair', order: 'dot-dot', errorCode: POSITION_TRACKING_WEAKNESS },
    ],
    correctOption: 'B',
    rule: ALTERNATING,
    ruleText: 'The two shapes swap places each step.',
  },
  {
    id: 'GI-PS-B03',
    phase: 'baseline',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Which shape comes next?',
    sequence: [
      { symbol: 'triangle', rotation: 0 },
      { symbol: 'triangle', rotation: 90 },
      { symbol: 'triangle', rotation: 180 },
    ],
    options: [
      { id: 'A', symbol: 'triangle', rotation: 90, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'B', symbol: 'triangle', rotation: 180, errorCode: POSITION_TRACKING_WEAKNESS },
      { id: 'C', symbol: 'triangle', rotation: 270, errorCode: null },
    ],
    correctOption: 'C',
    rule: CLOCKWISE_90,
    ruleText: 'Watch the marked corner turn 90 degrees clockwise each step.',
  },
];

/** Phase 5 — Pattern Temple gates 1 and 2. These feed the difficulty detector. */
export const GAMEPLAY_QUESTIONS = [
  {
    id: 'PT-G1-Q1',
    phase: 'gameplay',
    skillId: SKILL_ID,
    gate: 1,
    gateLabel: 'Direction Rule',
    type: 'rotation-sequence',
    prompt: 'The first gate needs the next arrow.',
    sequence: [
      { symbol: 'arrow', rotation: 0 },
      { symbol: 'arrow', rotation: 90 },
    ],
    options: [
      { id: 'A', symbol: 'arrow', rotation: 0, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'B', symbol: 'arrow', rotation: 270, errorCode: SEQUENCE_RULE_CONFUSION },
      { id: 'C', symbol: 'arrow', rotation: 180, errorCode: null },
    ],
    correctOption: 'C',
    rule: CLOCKWISE_90,
    ruleText: 'Rotate 90 degrees clockwise each step.',
  },
  {
    // Starts at 90 rather than 0 so this is NOT a repeat of GI-PS-B03, which uses
    // the same symbol. It also forces the learner past the 270 -> 0 wrap.
    id: 'PT-G2-Q1',
    phase: 'gameplay',
    skillId: SKILL_ID,
    gate: 2,
    gateLabel: 'Rotation Rule',
    type: 'rotation-sequence',
    prompt: 'The second gate needs the next shape.',
    sequence: [
      { symbol: 'triangle', rotation: 90 },
      { symbol: 'triangle', rotation: 180 },
      { symbol: 'triangle', rotation: 270 },
    ],
    options: [
      { id: 'A', symbol: 'triangle', rotation: 0, errorCode: null },
      { id: 'B', symbol: 'triangle', rotation: 180, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'C', symbol: 'triangle', rotation: 270, errorCode: POSITION_TRACKING_WEAKNESS },
    ],
    correctOption: 'A',
    rule: CLOCKWISE_90,
    ruleText: 'Watch the marked corner turn 90 degrees clockwise each step.',
  },
];

/** Phase 6 — one new problem solved WHILE support is still available. */
export const SUPPORTED_QUESTIONS = [
  {
    id: 'PT-SP-Q1',
    phase: 'supported',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Try this one with the help still on screen.',
    sequence: [
      { symbol: 'arrow', rotation: 45 },
      { symbol: 'arrow', rotation: 135 },
      { symbol: 'arrow', rotation: 225 },
    ],
    options: [
      { id: 'A', symbol: 'arrow', rotation: 135, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'B', symbol: 'arrow', rotation: 315, errorCode: null },
      { id: 'C', symbol: 'arrow', rotation: 45, errorCode: SEQUENCE_RULE_CONFUSION },
    ],
    correctOption: 'B',
    rule: CLOCKWISE_90,
    ruleText: 'Rotate 90 degrees clockwise each step.',
  },
];

/**
 * Phase 7 — parallel forms, NOT repeats: the same clockwise-90 rule on symbol and
 * orientation combinations the learner has not seen. Independence Gain rests on this.
 */
export const INDEPENDENT_QUESTIONS = [
  {
    id: 'GI-PS-I01',
    phase: 'independent',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Which arrow comes next?',
    sequence: [
      { symbol: 'arrow', rotation: 315 },
      { symbol: 'arrow', rotation: 45 },
      { symbol: 'arrow', rotation: 135 },
    ],
    options: [
      { id: 'A', symbol: 'arrow', rotation: 225, errorCode: null },
      { id: 'B', symbol: 'arrow', rotation: 45, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'C', symbol: 'arrow', rotation: 315, errorCode: SEQUENCE_RULE_CONFUSION },
    ],
    correctOption: 'A',
    rule: CLOCKWISE_90,
    ruleText: 'Rotate 90 degrees clockwise each step.',
  },
  {
    id: 'GI-PS-I02',
    phase: 'independent',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Which shape comes next?',
    sequence: [
      { symbol: 'triangle', rotation: 45 },
      { symbol: 'triangle', rotation: 135 },
      { symbol: 'triangle', rotation: 225 },
    ],
    options: [
      { id: 'A', symbol: 'triangle', rotation: 135, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'B', symbol: 'triangle', rotation: 315, errorCode: null },
      { id: 'C', symbol: 'triangle', rotation: 225, errorCode: POSITION_TRACKING_WEAKNESS },
    ],
    correctOption: 'B',
    rule: CLOCKWISE_90,
    ruleText: 'Watch the marked corner turn 90 degrees clockwise each step.',
  },
  {
    id: 'GI-PS-I03',
    phase: 'independent',
    skillId: SKILL_ID,
    type: 'rotation-sequence',
    prompt: 'Which shape comes next?',
    sequence: [
      { symbol: 'square', rotation: 0 },
      { symbol: 'square', rotation: 90 },
      { symbol: 'square', rotation: 180 },
    ],
    options: [
      { id: 'A', symbol: 'square', rotation: 270, errorCode: null },
      { id: 'B', symbol: 'square', rotation: 90, errorCode: ROTATION_DIRECTION_CONFUSION },
      { id: 'C', symbol: 'square', rotation: 0, errorCode: SEQUENCE_RULE_CONFUSION },
    ],
    correctOption: 'A',
    rule: CLOCKWISE_90,
    ruleText: 'Watch the marked corner turn 90 degrees clockwise each step.',
  },
];

export const ALL_QUESTIONS = [
  ...BASELINE_QUESTIONS,
  ...GAMEPLAY_QUESTIONS,
  ...SUPPORTED_QUESTIONS,
  ...INDEPENDENT_QUESTIONS,
];

export function getQuestion(id) {
  return ALL_QUESTIONS.find((q) => q.id === id) ?? null;
}

export function getOption(question, optionId) {
  if (!question) return null;
  return question.options.find((o) => o.id === optionId) ?? null;
}

export function isCorrectOption(question, optionId) {
  return Boolean(question) && question.correctOption === optionId;
}
