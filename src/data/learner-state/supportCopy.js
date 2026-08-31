/**
 * Child-facing copy and the research vocabulary behind it.
 *
 * RULE FOR EVERY STRING IN THIS FILE: the child is never told what was detected.
 * No "you look confused", no "you are disengaged", no emotion label, no score.
 * The copy talks about the LEARNING SITUATION and offers a choice. The state
 * name only ever appears in the research panel.
 */

/** The two learner states this component estimates. */
export const LEARNER_STATE_KEYS = {
  CONFUSION: 'confusion',
  DISENGAGEMENT: 'disengagement',
};

/** Escalation level of the decision, not of the child. */
export const SUPPORT_NEED = {
  NONE: 'none',
  MONITOR: 'monitor',
  INTERVENE: 'intervene',
};

export const SUPPORT_TYPE = {
  NONE: 'none',
  LIGHT_ENCOURAGEMENT: 'light_encouragement',
  HINT: 'hint',
  SCAFFOLD: 'scaffold',
  REENGAGEMENT: 'reengagement',
  ACTIVITY_ADJUSTMENT: 'activity_adjustment',
};

/** How each classification is named in the research panel only. */
export const CLASSIFICATION = {
  ENGAGED: 'engaged',
  PRODUCTIVE_CONFUSION: 'productive_confusion',
  INTERVENTION_WORTHY_CONFUSION: 'intervention_worthy_confusion',
  DISENGAGEMENT: 'disengagement',
};

export const CLASSIFICATION_LABELS = {
  [CLASSIFICATION.ENGAGED]: 'Engaged',
  [CLASSIFICATION.PRODUCTIVE_CONFUSION]: 'Productive confusion',
  [CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION]: 'Intervention-worthy confusion',
  [CLASSIFICATION.DISENGAGEMENT]: 'Disengagement',
};

export const CLASSIFICATION_TONES = {
  [CLASSIFICATION.ENGAGED]: 'success',
  [CLASSIFICATION.PRODUCTIVE_CONFUSION]: 'teal',
  [CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION]: 'orange',
  [CLASSIFICATION.DISENGAGEMENT]: 'primary',
};

/**
 * Child-facing prompt for each support type. `actions` reuse the ids that
 * StateSupportCard already dispatches, so the shared card renders these
 * unchanged. Every prompt is an offer the child can decline.
 */
export const SUPPORT_PROMPTS = {
  [SUPPORT_TYPE.LIGHT_ENCOURAGEMENT]: {
    tone: "teal",
    title: "Take your time.",
    body: "You are working it out. Keep going.",
    actions: [{ id: "dismiss", label: "Okay", style: "primary" }],
  },
  [SUPPORT_TYPE.HINT]: {
    tone: "orange",
    title: "Want a small hint?",
    body: "Just a little clue, then you finish it.",
    actions: [
      { id: "hint", label: "Yes please", style: "primary" },
      { id: "dismiss", label: "Not yet", style: "ghost" },
    ],
  },
  [SUPPORT_TYPE.SCAFFOLD]: {
    tone: "orange",
    title: "Shall we do it together?",
    body: "We can go one step at a time.",
    actions: [
      { id: "scaffold", label: "Yes please", style: "primary" },
      { id: "hint", label: "Just a hint", style: "ghost" },
      { id: "dismiss", label: "I will try", style: "ghost" },
    ],
  },
  [SUPPORT_TYPE.REENGAGEMENT]: {
    tone: "primary",
    title: "Ready for a quick challenge?",
    body: "A short one to get going again.",
    actions: [
      { id: "challenge", label: "Let’s go", style: "primary" },
      { id: "break", label: "Short break", style: "ghost" },
      { id: "dismiss", label: "Keep going", style: "ghost" },
    ],
  },
  [SUPPORT_TYPE.ACTIVITY_ADJUSTMENT]: {
    tone: "primary",
    title: "Want to try something else?",
    body: "A different game, same skill.",
    actions: [
      { id: "switch", label: "Yes please", style: "primary" },
      { id: "break", label: "Short break", style: "ghost" },
      { id: "dismiss", label: "Stay here", style: "ghost" },
    ],
  },
};

/** Research-panel description of what each support type asks the product to do. */
export const SUPPORT_TYPE_LABELS = {
  [SUPPORT_TYPE.NONE]: 'No support',
  [SUPPORT_TYPE.LIGHT_ENCOURAGEMENT]: 'Light encouragement',
  [SUPPORT_TYPE.HINT]: 'Request hint',
  [SUPPORT_TYPE.SCAFFOLD]: 'Request scaffold',
  [SUPPORT_TYPE.REENGAGEMENT]: 'Re-engagement prompt',
  [SUPPORT_TYPE.ACTIVITY_ADJUSTMENT]: 'Activity adjustment',
};

export const SUPPORT_NEED_LABELS = {
  [SUPPORT_NEED.NONE]: 'None',
  [SUPPORT_NEED.MONITOR]: 'Monitor',
  [SUPPORT_NEED.INTERVENE]: 'Intervene',
};

/** Camera / visual-signal states surfaced to the child and the researcher. */
export const CAMERA_MODE = {
  ACTIVE: 'active',
  LIMITED: 'limited',
  OFF: 'off',
  DENIED: 'denied',
};

export const CAMERA_MODE_COPY = {
  [CAMERA_MODE.ACTIVE]: {
    label: 'Camera Active',
    detail: 'Visual and learning-activity signals are both in use.',
    tone: 'teal',
  },
  [CAMERA_MODE.LIMITED]: {
    label: 'Visual Signal Limited',
    detail: 'Visual signals are unclear right now, so learning activity is weighted higher.',
    tone: 'orange',
  },
  [CAMERA_MODE.OFF]: {
    label: 'Camera Off',
    detail: 'Support continues from learning activity alone.',
    tone: 'ink',
  },
  [CAMERA_MODE.DENIED]: {
    label: 'Behaviour-Only Mode',
    detail: 'Camera is not available. Learning continues normally.',
    tone: 'ink',
  },
};

export const PRIVACY_COPY = {
  headline: 'Raw video is not stored. Derived features only.',
  session:
    'Camera analysis happens during the learning session. Raw video is not stored.',
  features:
    'Only summary measurements leave the camera step: eye openness, gaze direction, head pose, facial dynamics, face visibility and tracking confidence.',
  noIdentity: 'No facial identity recognition is performed at any point.',
  fallback: 'Behaviour-only mode enabled.',
  decline: 'Continue without camera',
};

export const TEMPORAL_COPY =
  'Learner state is estimated from patterns over time, not a single facial expression.';
