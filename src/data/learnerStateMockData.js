/**
 * LEGACY — kept only for the Adaptive Learning research drawer.
 *
 * `AffectiveStateOverlay` and the adaptive-learning `DemoScenarioControls` render
 * these entries to overlay a scripted Possible Frustration / Low-Alertness card
 * on the Learn screens. They are NOT the learner-state component's model.
 *
 * The learner-state component now estimates CONFUSION and DISENGAGEMENT, and its
 * child-facing copy lives in `data/learner-state/supportCopy.js`, keyed by the
 * SUPPORT TYPE that was decided rather than by a state name. See
 * `services/learner-state/` for the pipeline that replaced the old
 * `learnerStateService`.
 */

export const LEARNER_STATES = {
  engaged: {
    label: 'Engaged',
    childLabel: 'Learning Support Active',
    tone: 'success',
    title: "You're doing well! Keep going 🌟",
    body: 'Your learning rhythm looks comfortable.',
    actions: [],
  },
  confusion: {
    label: 'Possible Confusion',
    childLabel: 'A Tricky Moment',
    tone: 'orange',
    title: 'This one seems a little tricky.',
    body: 'Would you like some extra help?',
    actions: [
      { id: 'retry', label: 'Try Again', style: 'ghost' },
      { id: 'help', label: 'Get Help', style: 'primary' },
    ],
  },
  frustration: {
    label: 'Possible Frustration',
    childLabel: 'Time for a Gentle Reset',
    tone: 'primary',
    title: "You've been working hard.",
    body: "Let's slow down for a moment.",
    actions: [
      { id: 'pause', label: 'Short Pause', style: 'primary' },
      { id: 'easier', label: 'Easier Step', style: 'ghost' },
      { id: 'continue', label: 'Continue', style: 'ghost' },
    ],
  },
  low_alertness: {
    label: 'Low-Alertness Indicators',
    childLabel: 'A Little Less Active',
    tone: 'teal',
    title: 'How about a quick break?',
    body: 'You seem a little less active than usual.',
    actions: [
      { id: 'break', label: 'Take a Break', style: 'primary' },
      { id: 'water', label: 'Drink Water', style: 'ghost' },
      { id: 'continue', label: 'Continue', style: 'ghost' },
    ],
  },
};
