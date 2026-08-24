export const TUTOR_SCRIPTS = {
  fractions: {
    trigger: ["don't understand fractions", "fractions", "help with fractions"],
    reply: "That's okay! Imagine we have one pizza and cut it into 4 equal pieces. Each piece is called 1/4 of the pizza.",
    followUp: 'Want to try one together?',
  },
  default: {
    reply: "I'm here to help! Tell me what you're working on and we'll figure it out together.",
  },
};

export const HINT_SESSION = {
  question: '3/4 + 1/4 = ?',
  intro: "Let's solve it together.",
  hints: [
    'Look at the bottom numbers. Are they the same?',
    'Great! Because both denominators are 4, add the top numbers.',
  ],
  successMessage: 'You solved it yourself!',
  xp: 25,
};

export const LEARNER_STATE_CONTENT = {
  engaged: {
    label: 'Focused & Engaged',
    dotColor: 'success',
    title: "You're on a roll!",
    body: "Let's keep going.",
    actions: [],
  },
  confused: {
    label: 'Working Through a Tricky Bit',
    dotColor: 'orange',
    title: 'Want a little help?',
    body: 'This one looks tricky. I can give you a hint.',
    actions: [
      { id: 'hint', label: 'Give me a hint', style: 'primary' },
      { id: 'retry', label: "I'll try again", style: 'ghost' },
    ],
  },
  frustrated: {
    label: 'Needs a Gentle Reset',
    dotColor: 'primary',
    title: 'This is a tricky one',
    body: "Let's try it in a simpler way.",
    actions: [
      { id: 'easier', label: 'Show easier example', style: 'primary' },
      { id: 'break', label: 'Take a quick break', style: 'ghost' },
    ],
  },
  low: {
    label: 'Low Energy',
    dotColor: 'teal',
    title: 'Quick energy break?',
    body: "You've been learning for a while. A short break may help.",
    actions: [
      { id: 'break2', label: '2-minute break', style: 'primary' },
      { id: 'continue', label: 'Keep learning', style: 'ghost' },
    ],
  },
};

export const VISUAL_SIGNALS = ['Eye openness', 'Gaze direction', 'Head position', 'Facial behaviour'];
export const BEHAVIOUR_SIGNALS = ['Response time', 'Incorrect attempts', 'Repeated attempts', 'Inactivity', 'Recent performance'];
