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

export const VISUAL_SIGNALS = ['Eye openness', 'Gaze direction', 'Head position', 'Facial behaviour'];
export const BEHAVIOUR_SIGNALS = ['Response time', 'Incorrect attempts', 'Repeated attempts', 'Inactivity', 'Recent performance'];
