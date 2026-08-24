export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

export const AVATARS = [
  { id: 'a1', label: 'Nova', emoji: 'star-explorer', color: '#6C5CE7' },
  { id: 'a2', label: 'Pip', emoji: 'fox-scout', color: '#FF9F5A' },
  { id: 'a3', label: 'Luma', emoji: 'owl-sage', color: '#3FA9F5' },
  { id: 'a4', label: 'Coral', emoji: 'turtle-friend', color: '#16BFA6' },
  { id: 'a5', label: 'Ember', emoji: 'dragon-buddy', color: '#FF6B6B' },
  { id: 'a6', label: 'Petal', emoji: 'panda-pal', color: '#35C46A' },
];

export const DEFAULT_CHILD = {
  name: 'Kavindu',
  grade: 'Grade 5',
  school: 'Royal Junior College',
  language: 'en',
  avatarId: 'a1',
  level: 12,
  xp: 2450,
  xpToNext: 2800,
  coins: 1250,
  streak: 7,
};

export const SKILLS = [
  { id: 'math', name: 'Mathematics', pct: 76, color: 'var(--color-primary)', trend: '+6%' },
  { id: 'lang', name: 'Language', pct: 88, color: 'var(--color-teal)', trend: '+3%' },
  { id: 'reasoning', name: 'Reasoning', pct: 68, color: 'var(--color-orange)', trend: '+9%' },
  { id: 'gk', name: 'General Knowledge', pct: 84, color: 'var(--color-sky)', trend: '+2%' },
];

export const FOCUS_SKILLS = [
  {
    id: 'fractions',
    name: 'Fractions',
    pct: 62,
    note: 'Keep practicing — you\'re improving!',
    color: 'var(--color-primary)',
  },
  {
    id: 'patterns',
    name: 'Logical Patterns',
    pct: 68,
    note: 'Almost mastered!',
    color: 'var(--color-orange)',
  },
];

export const WORLDS = [
  {
    id: 'number-kingdom',
    name: 'Number Kingdom',
    subject: 'Mathematics',
    color: '#6C5CE7',
    light: '#EFECFD',
    progress: 62,
    stars: 12,
    maxStars: 20,
    unlocked: true,
    missions: [
      { id: 'm1', name: 'Number Patterns', stars: 3, status: 'done' },
      { id: 'm2', name: 'Fractions', stars: 2, status: 'done' },
      { id: 'm3', name: 'Time Challenge', stars: 3, status: 'current' },
      { id: 'm4', name: 'Word Problems', stars: 1, status: 'locked' },
      { id: 'm5', name: 'Boss Challenge', stars: 0, status: 'locked' },
    ],
  },
  {
    id: 'word-forest',
    name: 'Word Forest',
    subject: 'Language',
    color: '#16BFA6',
    light: '#E4FAF5',
    progress: 88,
    stars: 17,
    maxStars: 20,
    unlocked: true,
    missions: [
      { id: 'm1', name: 'Synonyms Trail', stars: 3, status: 'done' },
      { id: 'm2', name: 'Grammar Grove', stars: 3, status: 'done' },
      { id: 'm3', name: 'Comprehension Cave', stars: 3, status: 'done' },
      { id: 'm4', name: 'Story Weaving', stars: 2, status: 'current' },
      { id: 'm5', name: 'Boss Challenge', stars: 0, status: 'locked' },
    ],
  },
  {
    id: 'logic-island',
    name: 'Logic Island',
    subject: 'Reasoning',
    color: '#FF9F5A',
    light: '#FFF1E4',
    progress: 45,
    stars: 9,
    maxStars: 20,
    unlocked: true,
    missions: [
      { id: 'm1', name: 'Pattern Trails', stars: 3, status: 'done' },
      { id: 'm2', name: 'Odd One Out', stars: 2, status: 'done' },
      { id: 'm3', name: 'Logic Bridges', stars: 0, status: 'current' },
      { id: 'm4', name: 'Mirror Maze', stars: 0, status: 'locked' },
      { id: 'm5', name: 'Boss Challenge', stars: 0, status: 'locked' },
    ],
  },
  {
    id: 'nature-lab',
    name: 'Nature Lab',
    subject: 'Science',
    color: '#35C46A',
    light: '#E6F9EC',
    progress: 30,
    stars: 6,
    maxStars: 20,
    unlocked: true,
    missions: [
      { id: 'm1', name: 'Plant Life Trail', stars: 3, status: 'done' },
      { id: 'm2', name: 'Weather Watch', stars: 0, status: 'current' },
      { id: 'm3', name: 'Animal Homes', stars: 0, status: 'locked' },
      { id: 'm4', name: 'Our Ecosystem', stars: 0, status: 'locked' },
      { id: 'm5', name: 'Boss Challenge', stars: 0, status: 'locked' },
    ],
  },
  {
    id: 'shape-city',
    name: 'Shape City',
    subject: 'Geometry',
    color: '#3FA9F5',
    light: '#E8F5FE',
    progress: 0,
    stars: 0,
    maxStars: 20,
    unlocked: false,
    missions: [],
  },
  {
    id: 'puzzle-peak',
    name: 'Puzzle Peak',
    subject: 'Problem Solving',
    color: '#FF6B6B',
    light: '#FFEBEB',
    progress: 0,
    stars: 0,
    maxStars: 20,
    unlocked: false,
    missions: [],
  },
];

export const MINI_GAME_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'Complete the pattern',
    display: '2, 4, 8, 16, __',
    options: ['24', '28', '32', '36'],
    correct: '32',
    hint: 'Look at how each number changes — try multiplying.',
  },
  {
    id: 'q2',
    prompt: 'Solve the fraction',
    display: '3/4 + 1/4 = ?',
    options: ['1/2', '1', '4/8', '2'],
    correct: '1',
    hint: 'Check the denominators first — are they the same?',
  },
  {
    id: 'q3',
    prompt: 'Find the odd one out',
    display: 'Circle · Square · Triangle · Sphere',
    options: ['Circle', 'Square', 'Triangle', 'Sphere'],
    correct: 'Sphere',
    hint: 'Three of these are flat shapes. One is not.',
  },
  {
    id: 'q4',
    prompt: 'What is the next number?',
    display: '1, 1, 2, 3, 5, __',
    options: ['6', '7', '8', '9'],
    correct: '8',
    hint: 'Try adding the two numbers before it.',
  },
];

export const PRACTICE_PAPER = {
  title: "Kavindu's Practice Paper",
  questions: 25,
  minutes: 40,
  difficulty: 'Medium',
  focus: [
    { name: 'Fractions', pct: 35, color: 'var(--color-primary)' },
    { name: 'Logical Reasoning', pct: 25, color: 'var(--color-orange)' },
    { name: 'Language', pct: 20, color: 'var(--color-teal)' },
    { name: 'General Knowledge', pct: 20, color: 'var(--color-sky)' },
  ],
  reason: 'We noticed that fractions and logical reasoning need a little more practice, so this paper gives you extra questions from those areas.',
};

export const PAPER_RESULT = {
  score: 78,
  correct: 20,
  retry: 5,
  minutes: 34,
  breakdown: [
    { name: 'Fractions', pct: 62, color: 'var(--color-primary)' },
    { name: 'Language', pct: 88, color: 'var(--color-teal)' },
    { name: 'Reasoning', pct: 72, color: 'var(--color-orange)' },
    { name: 'General Knowledge', pct: 91, color: 'var(--color-sky)' },
  ],
  focusNext: ['Fractions', 'Pattern reasoning'],
};

export const ACHIEVEMENTS = [
  { id: 'b1', label: '7 Day Explorer', icon: 'flame', earned: true },
  { id: 'b2', label: 'Math Star', icon: 'star', earned: true },
  { id: 'b3', label: 'Reading Hero', icon: 'book-open', earned: true },
  { id: 'b4', label: 'Puzzle Master', icon: 'brain', earned: false, hint: 'Complete 3 more missions to unlock.' },
  { id: 'b5', label: 'Practice Champion', icon: 'target', earned: false, hint: 'Finish 2 more practice papers to unlock.' },
  { id: 'b6', label: 'Mission Master', icon: 'trophy', earned: false, hint: 'Reach Level 15 to unlock.' },
];

export const DAILY_REWARDS = [
  { day: 1, done: true },
  { day: 2, done: true },
  { day: 3, done: true },
  { day: 4, done: false, today: true, reward: 100 },
  { day: 5, done: false },
  { day: 6, done: false },
  { day: 7, done: false, reward: 300 },
];

export const AVATAR_SHOP = {
  hair: [
    { id: 'h1', label: 'Classic', cost: 0 },
    { id: 'h2', label: 'Curly', cost: 150 },
    { id: 'h3', label: 'Wavy', cost: 150 },
  ],
  shirt: [
    { id: 's1', label: 'Blue Hoodie', cost: 0 },
    { id: 's2', label: 'Sunset Tee', cost: 120 },
    { id: 's3', label: 'Explorer Jacket', cost: 250 },
  ],
  accessories: [
    { id: 'x1', label: 'Wizard Hat', cost: 300 },
    { id: 'x2', label: 'Star Glasses', cost: 200 },
    { id: 'x3', label: 'None', cost: 0 },
  ],
  background: [
    { id: 'bg1', label: 'Sky', cost: 0 },
    { id: 'bg2', label: 'Forest', cost: 100 },
    { id: 'bg3', label: 'Galaxy', cost: 350 },
  ],
};

export const MINDY_SUGGESTIONS = [
  { id: 's1', icon: 'lightbulb', label: 'Explain something' },
  { id: 's2', icon: 'help-circle', label: 'Help with a question' },
  { id: 's3', icon: 'target', label: 'Practice my weak areas' },
  { id: 's4', icon: 'repeat', label: "Revise today's lesson" },
];

export const WEEKLY_PATTERN = [
  { day: 'Mon', state: 'engaged', note: 'Engaged' },
  { day: 'Tue', state: 'engaged', note: 'Engaged' },
  { day: 'Wed', state: 'confused', note: 'Confusion around Fractions' },
  { day: 'Thu', state: 'engaged', note: 'Engaged' },
  { day: 'Fri', state: 'low', note: 'Low alertness after 25 min' },
  { day: 'Sat', state: 'engaged', note: 'Engaged' },
  { day: 'Sun', state: 'engaged', note: 'Engaged' },
];

export const PATTERN_SUGGESTIONS = [
  'Practice fractions in shorter 15-minute sessions.',
  'Start difficult activities earlier in the session.',
];

export const NOTIFICATIONS = [
  { id: 'n1', icon: 'gamepad-2', text: "Today's mission is ready!", time: '9:00 AM' },
  { id: 'n2', icon: 'file-text', text: 'Your new personalized practice paper is ready.', time: 'Yesterday' },
  { id: 'n3', icon: 'star', text: 'You earned the Logic Explorer badge!', time: 'Yesterday' },
  { id: 'n4', icon: 'lightbulb', text: 'Mindy has a revision activity for fractions.', time: '2 days ago' },
  { id: 'n5', icon: 'sprout', text: 'Great progress! Your fraction accuracy improved by 12%.', time: '3 days ago' },
];

export const PARENT_SUMMARY = {
  learningTime: '124 min',
  accuracy: '82%',
  improved: ['Language', 'General Knowledge'],
  needsSupport: ['Fractions', 'Logical Patterns'],
  recommended: 'Short 15-minute fraction sessions, 3x this week.',
  observations: [
    'Fractions required additional support in 3 sessions this week.',
    'Performance improved after shorter practice activities.',
  ],
};

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Learning made just for you',
    body: 'MindBridge understands your progress and helps you practice what you need most.',
    illustration: 'learn',
    color: '#6C5CE7',
  },
  {
    id: 2,
    title: 'Learn through adventures',
    body: 'Complete missions, earn rewards and master new skills while playing.',
    illustration: 'play',
    color: '#16BFA6',
  },
  {
    id: 3,
    title: "We're here when learning feels difficult",
    body: 'MindBridge notices learning patterns and gives you the right support at the right time.',
    illustration: 'support',
    color: '#FF9F5A',
  },
];
