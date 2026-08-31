/**
 * Every word a 9-10 year old can see, in one file.
 *
 * RULES FOR THIS FILE, checked whenever a string is added:
 *   1. No numbers the child has to interpret. No probability, no percentage, no
 *      seconds, no sigma, no reliability.
 *   2. No research vocabulary: no "state", "signal", "estimate", "window",
 *      "pipeline", "feature", "confidence", "detected".
 *   3. Nothing that describes the CHILD ("you look confused", "you are
 *      disengaged"). Talk about the work, or about what Mindy does.
 *   4. Short sentences. Everyday words. An offer the child can refuse.
 *
 * Anything technical belongs in supportCopy.js (research labels) or in the
 * grown-ups section, never here.
 */

/** Camera states, in words a child understands. */
export const CHILD_CAMERA_COPY = {
  active: {
    label: 'Camera on',
    detail: 'Mindy is helping while you learn.',
  },
  limited: {
    label: 'Camera is fuzzy',
    detail: 'That is okay. Mindy still helps you.',
  },
  off: {
    label: 'Camera off',
    detail: 'Mindy still helps you while you learn.',
  },
  denied: {
    label: 'Camera off',
    detail: 'Mindy still helps you while you learn.',
  },
};

/** The "How Mindy Helps" page. */
export const COMPANION_COPY = {
  title: 'How Mindy Helps',
  intro: 'I stay with you while you learn. I only pop in when it helps.',
  cards: [
    {
      id: 'time',
      icon: 'Hourglass',
      color: '#FF9F5A',
      bg: '#FFF1E4',
      title: 'I give you time to think',
      body: 'Tricky bits are good for your brain. I wait while you work them out.',
    },
    {
      id: 'stuck',
      icon: 'Lightbulb',
      color: '#6C5CE7',
      bg: '#EFECFD',
      title: 'I help when you get stuck',
      body: 'If something stays hard for a while, I will offer you a small hint.',
    },
    {
      id: 'you',
      icon: 'Heart',
      color: '#16BFA6',
      bg: '#E4FAF5',
      title: 'Everyone works differently',
      body: 'I learn how you like to work. Fast or slow, both are great.',
    },
    {
      id: 'choice',
      icon: 'ThumbsUp',
      color: '#3FA9F5',
      bg: '#E8F5FE',
      title: 'You are in charge',
      body: 'You can always say no thanks. I will just keep you company.',
    },
  ],
  cameraHeading: 'Right now',
  privacyLine: 'Your camera is never saved or recorded.',
  cta: 'Start learning',
  grownUps: 'For grown-ups',
};

/** Camera permission, written so a child and a parent can both read it. */
export const CAMERA_ASK_COPY = {
  title: 'Can Mindy use the camera?',
  body: 'It helps Mindy notice when you might want a hint. Your camera is never saved or recorded.',
  points: [
    'Nothing is recorded or kept.',
    'Mindy never tries to work out who you are.',
    'You can turn it off any time.',
  ],
  allow: 'Yes, turn it on',
  decline: 'No, keep it off',
  asking: 'Just a moment…',
  declined: 'No problem. Mindy will still help you while you learn.',
  unavailable: 'This device has no camera. Mindy will still help you while you learn.',
};

/** The Smart Learning Support entry screen. */
export const SUPPORT_INTRO_COPY = {
  title: 'Mindy learns with you',
  body: 'I keep you company while you practise, and offer help when it is useful.',
  behaviourTitle: 'How I help',
  behaviourBody: 'I notice when a question is taking a while, so I can offer a hint at the right moment.',
  start: 'Start learning',
  privacyLink: 'For grown-ups: privacy and camera',
};

/** End-of-session wrap-up lines. Praise the effort, never label the child. */
export const SESSION_END_COPY = {
  none: 'You worked through this one all by yourself.',
  accepted: 'You used a hint when you needed it and kept going. Nice work.',
  declined: 'You kept going through the tricky parts on your own.',
};

/** Child-facing privacy page. Detail lives behind the grown-ups section. */
export const CHILD_PRIVACY_COPY = {
  title: 'Your camera and you',
  headline: 'Your camera is never saved or recorded.',
  points: [
    {
      id: 'nothing-kept',
      icon: 'EyeOff',
      color: '#16BFA6',
      bg: '#E4FAF5',
      title: 'Nothing is kept',
      body: 'The camera picture is never saved, never sent anywhere, and nobody watches it.',
    },
    {
      id: 'no-name',
      icon: 'ShieldCheck',
      color: '#6C5CE7',
      bg: '#EFECFD',
      title: 'Mindy does not know faces',
      body: 'Mindy never tries to work out who you are from the camera.',
    },
    {
      id: 'your-choice',
      icon: 'ThumbsUp',
      color: '#3FA9F5',
      bg: '#E8F5FE',
      title: 'It is your choice',
      body: 'You can turn the camera off whenever you like. Learning works just the same.',
    },
  ],
  grownUpsTitle: 'For grown-ups',
  grownUpsHint: 'The technical detail behind these promises.',
};
