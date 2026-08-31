/**
 * The three learning-support types (the UI term for a scaffold). All are
 * implemented; the Adaptive Support Selector decides which one is delivered.
 *
 * `icon` holds a lucide-react export name resolved by the presentation layer.
 * Note MessageCircleQuestionMark — MessageCircleQuestion does not exist in v1.
 */

export const SUPPORT_IDS = {
  VISUAL_ROTATION: 'visual-rotation',
  GUIDED_REASONING: 'guided-reasoning',
  WORKED_EXAMPLE: 'worked-example',
};

export const SUPPORTS = [
  {
    id: 'visual-rotation',
    key: 'visualRotation',
    label: 'Animated Visual Rotation',
    icon: 'RotateCw',
    desc: 'Watch the symbol physically turn one quarter at a time.',
    howItWorks:
      'The arrow animates a 90° clockwise turn. Then the child turns it themselves.',
  },
  {
    id: 'guided-reasoning',
    key: 'guidedReasoning',
    label: 'Guided Reasoning',
    icon: 'MessageCircleQuestionMark',
    desc: 'Answer small questions that lead to the rule.',
    howItWorks:
      'No spinning arrow. Three tiny questions: which way did it turn, how far, and what comes next.',
  },
  {
    id: 'worked-example',
    key: 'workedExample',
    label: 'Worked Example',
    icon: 'BookOpenCheck',
    desc: 'Study a solved example, step by step.',
    howItWorks:
      'A finished sequence is shown, then explained in numbered steps. No quiz and no animation.',
  },
];

/** Support status values used by the reducer. */
export const SUPPORT_STATUS = {
  NONE: 'none',
  ACTIVE: 'active',
  REMOVED: 'removed',
};

/** Research View labelling for the selector (brief section 22). */
export const SELECTOR_LABEL = 'Adaptive Support Selector';
export const SELECTOR_TECHNICAL_LABEL = '(Contextual Multi-Armed Bandit simulation)';
export const SELECTOR_HEADING = 'WHICH SUPPORT IS MOST LIKELY TO BUILD INDEPENDENCE?';

/** The caption that carries the core research claim (brief section 24). */
export const SUPPORTED_RESULT_CAVEAT =
  'This result shows success WITH help. It does not yet prove independent learning.';

/** Guided Reasoning question ladder (brief section 21B). */
export const GUIDED_REASONING_STEPS = [
  {
    id: 'direction',
    prompt: 'Look at the first two arrows. Which way did it turn?',
    highlight: [0, 1],
    layout: 'two',
    options: [
      {
        id: 'left',
        label: 'The other way',
        sub: 'away from the clock',
        turn: -90,
        correct: false,
      },
      {
        id: 'right',
        label: 'This way',
        sub: 'clockwise, like a clock',
        turn: 90,
        correct: true,
      },
    ],
    feedback: 'Yes - clockwise, like a clock. Up became Right.',
  },
  {
    id: 'quarters',
    prompt: 'How far did it turn each time?',
    highlight: [0, 1],
    layout: 'three',
    options: [
      { id: '1', label: '1 quarter', sub: 'one slice', wedges: 1, correct: true },
      { id: '2', label: '2 quarters', sub: 'halfway', wedges: 2, correct: false },
      { id: '3', label: '3 quarters', sub: 'almost around', wedges: 3, correct: false },
    ],
    feedback: 'One quarter turn — just one slice — every step.',
  },
  {
    id: 'next',
    prompt: 'After Down, one more quarter turn points…',
    highlight: [2, 3],
    layout: 'three',
    options: [
      { id: 'up', label: 'Up', rotation: 0, correct: false },
      { id: 'left', label: 'Left', rotation: 270, correct: true },
      { id: 'right', label: 'Right', rotation: 90, correct: false },
    ],
    feedback: 'Down → Left. Same rule: one quarter turn clockwise.',
  },
];

/** Worked Example steps (brief section 21C). */
export const WORKED_EXAMPLE = {
  sequence: [
    { symbol: 'arrow', rotation: 0 },
    { symbol: 'arrow', rotation: 90 },
    { symbol: 'arrow', rotation: 180 },
    { symbol: 'arrow', rotation: 270 },
  ],
  steps: [
    {
      id: 'quarter',
      title: 'A quarter turn',
      body: 'A circle has 4 slices. Moving one slice is a quarter turn — like a clock going from 12 to 3. That is Up → Right.',
      diagramFrom: 0,
    },
    {
      id: 'rule',
      title: 'The same turn every time',
      body: 'Each arrow turns one quarter clockwise: Up → Right, Right → Down, Down → Left.',
      highlightIndex: 0,
    },
    {
      id: 'next',
      title: 'So after Down comes Left',
      body: 'Keep the same quarter turn. The last arrow points Left.',
      highlightIndex: 2,
    },
  ],
};

/** Visual Rotation demonstration steps (brief section 23). */
export const VISUAL_ROTATION_STEPS = [
  { rotation: 0, caption: 'Start here — pointing Up.' },
  { rotation: 90, caption: 'One quarter turn: Up → Right' },
  { rotation: 180, caption: 'One quarter turn: Right → Down' },
  { rotation: 270, caption: 'One quarter turn: Down → Left' },
];

export const VISUAL_ROTATION_PROMPT =
  'Your turn. One quarter turn clockwise — Up becomes Right.';
export const VISUAL_ROTATION_SUCCESS =
  'Yes — one quarter turn clockwise. Up → Right → Down → Left.';
