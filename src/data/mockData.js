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
  title: "Kavindu's Weekly Mastery Paper",
  week: 'Week 34',
  generatedOn: '25 Aug 2026',
  dueDate: '31 Aug 2026',
  questions: 20,
  marks: 50,
  minutes: 60,
  difficulty: 'Adaptive',
  weakAreaWeight: 70,
  normalWeight: 30,
  languageVersions: ['English', 'Sinhala', 'Tamil'],
  focus: [
    { name: 'Weak Areas', pct: 70, color: 'var(--color-coral)' },
    { name: 'Grade-Level Revision', pct: 30, color: 'var(--color-sky)' },
  ],
  weakAreas: [
    { skill: 'Fractions', source: 'Number Kingdom game', accuracy: 54, questions: 7 },
    { skill: 'Pattern reasoning', source: 'Logic Island game', accuracy: 58, questions: 5 },
    { skill: 'Word problems', source: 'Boss challenge attempts', accuracy: 61, questions: 2 },
  ],
  normalAreas: [
    { skill: 'Language comprehension', accuracy: 86, questions: 3 },
    { skill: 'General knowledge', accuracy: 84, questions: 2 },
    { skill: 'Measurement', accuracy: 78, questions: 1 },
  ],
  reason: 'Game results show weaker performance in fractions, pattern reasoning and word problems. This weekly paper therefore assigns 14 questions to those areas and 6 questions to normal grade-level revision.',
};

export const PAPER_LANGUAGE_COPY = {
  en: {
    label: 'English',
    paperTitle: "Kavindu's Weekly Mastery Paper",
    school: 'MindBridge Adaptive Learning',
    exam: 'Grade 5 Integrated Practice Paper',
    instructions: [
      'Write all answers clearly in the spaces provided.',
      'Show working for mathematics questions.',
      'A parent may upload photos of the completed paper for automatic marking.',
    ],
    student: 'Student',
    grade: 'Grade',
    date: 'Date',
    time: 'Time allowed',
    marks: 'Total marks',
    sectionA: 'Section A - Weak Area Practice',
    sectionB: 'Section B - Grade-Level Revision',
    footer: 'End of paper',
  },
  si: {
    label: 'සිංහල',
    paperTitle: 'කවිඳුගේ සතිපතා දක්ෂතා ප්‍රශ්න පත්‍රය',
    school: 'MindBridge අනුවර්තී ඉගෙනුම්',
    exam: '5 ශ්‍රේණිය ඒකාබද්ධ පුහුණු ප්‍රශ්න පත්‍රය',
    instructions: [
      'සියලු පිළිතුරු ලබා දී ඇති ඉඩ තුළ පැහැදිලිව ලියන්න.',
      'ගණිත ප්‍රශ්න සඳහා ක්‍රියාමාර්ග පෙන්වන්න.',
      'සම්පූර්ණ කළ පත්‍රයේ ඡායාරූප දෙමාපියන්ට උඩුගත කර ස්වයංක්‍රීයව ලකුණු ලබා ගත හැක.',
    ],
    student: 'සිසුවා',
    grade: 'ශ්‍රේණිය',
    date: 'දිනය',
    time: 'කාලය',
    marks: 'මුළු ලකුණු',
    sectionA: 'A කොටස - දුර්වල අංශ පුහුණුව',
    sectionB: 'B කොටස - ශ්‍රේණි මට්ටමේ පුනරීක්ෂණය',
    footer: 'ප්‍රශ්න පත්‍රය අවසන්',
  },
  ta: {
    label: 'தமிழ்',
    paperTitle: 'கவிந்துவின் வாராந்திர திறன் வினாத்தாள்',
    school: 'MindBridge ஏற்புமுறை கற்றல்',
    exam: 'தரம் 5 ஒருங்கிணைந்த பயிற்சி வினாத்தாள்',
    instructions: [
      'அனைத்து பதில்களையும் கொடுக்கப்பட்ட இடங்களில் தெளிவாக எழுதுங்கள்.',
      'கணிதக் கேள்விகளுக்கு செய்முறையைக் காட்டுங்கள்.',
      'முடித்த வினாத்தாளின் புகைப்படங்களை பெற்றோர் பதிவேற்றி தானியங்கி மதிப்பீட்டை பெறலாம்.',
    ],
    student: 'மாணவர்',
    grade: 'தரம்',
    date: 'தேதி',
    time: 'நேரம்',
    marks: 'மொத்த மதிப்பெண்கள்',
    sectionA: 'பகுதி A - பலவீன பகுதி பயிற்சி',
    sectionB: 'பகுதி B - தரநிலை மீளாய்வு',
    footer: 'வினாத்தாள் முடிவு',
  },
};

export const WEEKLY_PAPER_QUESTIONS = [
  { id: 1, section: 'weak', skill: 'Fractions', marks: 2, prompt: 'Find: 3/4 + 1/8. Show your working.' },
  { id: 2, section: 'weak', skill: 'Fractions', marks: 2, prompt: 'Shade 2/3 of the rectangle below.' },
  { id: 3, section: 'weak', skill: 'Fractions', marks: 3, prompt: 'Nimal ate 1/4 of a cake and his sister ate 2/8. What fraction was eaten altogether?' },
  { id: 4, section: 'weak', skill: 'Fractions', marks: 2, prompt: 'Circle the largest fraction: 1/2, 3/5, 4/10, 2/3.' },
  { id: 5, section: 'weak', skill: 'Fractions', marks: 3, prompt: 'A bottle has 3/5 litre of water. If 1/5 litre is poured out, how much is left?' },
  { id: 6, section: 'weak', skill: 'Fractions', marks: 2, prompt: 'Write two equivalent fractions for 4/6.' },
  { id: 7, section: 'weak', skill: 'Fractions', marks: 3, prompt: 'Convert 7/4 into a mixed number.' },
  { id: 8, section: 'weak', skill: 'Pattern reasoning', marks: 2, prompt: 'Complete the pattern: 3, 6, 12, 24, __.' },
  { id: 9, section: 'weak', skill: 'Pattern reasoning', marks: 2, prompt: 'Draw the next shape pattern: circle, square, square, circle, square, square, __.' },
  { id: 10, section: 'weak', skill: 'Pattern reasoning', marks: 3, prompt: 'Find the missing number: 5, 10, 20, __, 80. Explain the rule.' },
  { id: 11, section: 'weak', skill: 'Pattern reasoning', marks: 3, prompt: 'A code changes CAT to DBU. Use the same rule to change DOG.' },
  { id: 12, section: 'weak', skill: 'Pattern reasoning', marks: 2, prompt: 'Which number does not belong: 8, 16, 24, 31, 40?' },
  { id: 13, section: 'weak', skill: 'Word problems', marks: 3, prompt: 'A bus has 36 seats. 3/4 of the seats are full. How many seats are occupied?' },
  { id: 14, section: 'weak', skill: 'Word problems', marks: 3, prompt: 'A shop sold 18 pencils in the morning and twice as many in the evening. How many pencils were sold altogether?' },
  { id: 15, section: 'normal', skill: 'Language comprehension', marks: 2, prompt: 'Read: "The little plant bent toward the sunlight." What does bent mean here?' },
  { id: 16, section: 'normal', skill: 'Language comprehension', marks: 2, prompt: 'Write one synonym for happy and use it in a sentence.' },
  { id: 17, section: 'normal', skill: 'Language comprehension', marks: 2, prompt: 'Underline the verb: The children quickly opened their books.' },
  { id: 18, section: 'normal', skill: 'General knowledge', marks: 2, prompt: 'Name the planet closest to the Sun.' },
  { id: 19, section: 'normal', skill: 'General knowledge', marks: 2, prompt: 'Write one way children can save water at home.' },
  { id: 20, section: 'normal', skill: 'Measurement', marks: 2, prompt: 'Convert 2 metres and 35 centimetres into centimetres.' },
];

export const SKILL_MASTERY_DASHBOARD = [
  { skill: 'Fractions', mastery: 54, status: 'Needs support', trend: '+4%', evidence: 'Missed 6 of 13 related game questions', action: 'Add visual fraction models to next paper', color: 'var(--color-coral)' },
  { skill: 'Pattern reasoning', mastery: 58, status: 'Developing', trend: '+7%', evidence: 'Takes longer on sequence and rule questions', action: 'Use short pattern drills before games', color: 'var(--color-orange)' },
  { skill: 'Word problems', mastery: 61, status: 'Developing', trend: '+3%', evidence: 'Understands operations but misses keywords', action: 'Ask student to underline important numbers', color: 'var(--color-sky)' },
  { skill: 'Measurement', mastery: 78, status: 'Nearly mastered', trend: '+5%', evidence: 'Good accuracy in conversion questions', action: 'Keep as normal revision', color: 'var(--color-teal)' },
  { skill: 'Language comprehension', mastery: 86, status: 'Mastered', trend: '+2%', evidence: 'Strong reading and vocabulary accuracy', action: 'Maintain weekly revision', color: 'var(--color-success)' },
  { skill: 'General knowledge', mastery: 84, status: 'Mastered', trend: '+1%', evidence: 'Consistent performance in mixed quizzes', action: 'Maintain weekly revision', color: 'var(--color-success)' },
];

export const PAPER_SCAN_RESULT = {
  uploadCount: 4,
  recognizedAnswers: 20,
  confidence: 94,
  markingMode: 'OCR + answer rubric',
  handwrittenPages: ['Page 1 detected', 'Page 2 detected', 'Page 3 detected', 'Page 4 detected'],
};

export const PAST_PAPERS = [
  {
    id: 'p1',
    title: 'Week 33 Mastery Paper',
    date: '18 Aug 2026',
    marks: 42,
    totalMarks: 50,
    score: 84,
    status: 'Completed',
    focus: 'Fractions, comprehension',
    wrongAnswers: [
      { no: 4, skill: 'Fractions', marks: '0/2', question: 'Circle the largest fraction: 1/2, 3/5, 4/10, 2/3.', childAnswer: '3/5', correctAnswer: '2/3', feedback: 'Compare by converting to common denominators.' },
      { no: 9, skill: 'Pattern reasoning', marks: '1/2', question: 'Draw the next shape in the repeated sequence.', childAnswer: 'Square', correctAnswer: 'Circle', feedback: 'The pattern repeats after three shapes.' },
      { no: 16, skill: 'Language comprehension', marks: '1/2', question: 'Find the meaning of bent in the short sentence.', childAnswer: 'Broken', correctAnswer: 'Curved or leaned', feedback: 'Use the sentence context before choosing meaning.' },
    ],
  },
  {
    id: 'p2',
    title: 'Week 32 Mastery Paper',
    date: '11 Aug 2026',
    marks: 37,
    totalMarks: 50,
    score: 74,
    status: 'Completed',
    focus: 'Patterns, word problems',
    wrongAnswers: [
      { no: 3, skill: 'Word problems', marks: '1/3', question: 'A shop sold 18 pencils in the morning and twice as many in the evening.', childAnswer: '36', correctAnswer: '54', feedback: 'Add morning and evening sales together after finding twice as many.' },
      { no: 8, skill: 'Pattern reasoning', marks: '0/2', question: 'Complete the pattern: 5, 10, 20, __, 80.', childAnswer: '30', correctAnswer: '40', feedback: 'Each number doubles.' },
      { no: 12, skill: 'Fractions', marks: '1/2', question: 'Write two equivalent fractions for 4/6.', childAnswer: '4/8, 6/8', correctAnswer: '2/3, 8/12', feedback: 'Multiply or divide numerator and denominator by the same number.' },
      { no: 19, skill: 'Measurement', marks: '0/2', question: 'Convert 2 m 35 cm into centimetres.', childAnswer: '2350 cm', correctAnswer: '235 cm', feedback: '1 metre is 100 centimetres.' },
    ],
  },
  {
    id: 'p3',
    title: 'Week 31 Mastery Paper',
    date: '04 Aug 2026',
    marks: 34,
    totalMarks: 50,
    score: 68,
    status: 'Completed',
    focus: 'Fractions, measurement',
    wrongAnswers: [
      { no: 1, skill: 'Fractions', marks: '1/2', question: 'Find: 3/4 + 1/8.', childAnswer: '4/12', correctAnswer: '7/8', feedback: 'Use a common denominator before adding.' },
      { no: 5, skill: 'Fractions', marks: '0/2', question: 'Subtract 1/5 from 3/5.', childAnswer: '2/0', correctAnswer: '2/5', feedback: 'Keep the same denominator when denominators match.' },
      { no: 11, skill: 'Measurement', marks: '0/2', question: 'How many centimetres are in 4 metres?', childAnswer: '40 cm', correctAnswer: '400 cm', feedback: 'Multiply metres by 100.' },
      { no: 14, skill: 'Word problems', marks: '1/3', question: 'Find occupied seats when 3/4 of 36 seats are full.', childAnswer: '24', correctAnswer: '27', feedback: 'Divide 36 by 4, then multiply by 3.' },
      { no: 18, skill: 'Pattern reasoning', marks: '0/2', question: 'Which number does not belong: 8, 16, 24, 31, 40?', childAnswer: '24', correctAnswer: '31', feedback: 'All others are multiples of 8.' },
    ],
  },
];

export const PAPER_RESULT = {
  score: 78,
  correct: 15,
  retry: 5,
  minutes: 47,
  marks: 39,
  totalMarks: 50,
  scannedPages: 4,
  breakdown: [
    { name: 'Fractions', pct: 62, before: 54, color: 'var(--color-coral)' },
    { name: 'Pattern reasoning', pct: 72, before: 58, color: 'var(--color-orange)' },
    { name: 'Word problems', pct: 67, before: 61, color: 'var(--color-sky)' },
    { name: 'Language comprehension', pct: 88, before: 86, color: 'var(--color-teal)' },
    { name: 'General Knowledge', pct: 91, before: 84, color: 'var(--color-success)' },
  ],
  focusNext: ['Fractions', 'Pattern reasoning'],
  markedAnswers: [
    { no: 1, skill: 'Fractions', mark: '1/2', note: 'Addition method correct, simplify final answer.' },
    { no: 3, skill: 'Fractions', mark: '2/3', note: 'Good working shown.' },
    { no: 8, skill: 'Pattern reasoning', mark: '2/2', note: 'Correct doubling pattern.' },
    { no: 11, skill: 'Pattern reasoning', mark: '1/3', note: 'Letter shift rule needs more practice.' },
    { no: 18, skill: 'General knowledge', mark: '2/2', note: 'Correct.' },
  ],
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
