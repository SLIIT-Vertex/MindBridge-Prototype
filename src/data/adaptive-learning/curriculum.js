/**
 * Curriculum structure. The prototype shows the full Grade 5 Scholarship shape,
 * but only General Intelligence & Aptitude -> Pattern & Sequence Reasoning is
 * playable; the rest are preview cards labelled "Full System Area".
 *
 * `icon` holds a lucide-react export name resolved by the presentation layer, so
 * this module stays free of React imports.
 */

export const GRADE = 5;

export const CURRICULUM_AREAS = [
  {
    id: 'GI',
    name: 'General Intelligence & Aptitude',
    icon: 'Brain',
    status: 'playable',
    color: '#6C5CE7',
    light: '#EFECFD',
    blurb: 'Patterns, relationships, transformations and logical rules.',
    blurbLines: ['Patterns, relationships,', 'transformations and logical rules.'],
    badgeArt: '/curriculum/general_intelligence_icon.svg',
    theme: {
      surface: '#FBF8FF',
      border: '#956BFF',
      title: '#5630C8',
      badge: '#EDE4FF',
      pill: '#E9DDFF',
      pillText: '#4D27C3',
    },
  },
  {
    id: 'MATH',
    name: 'Mathematics',
    icon: 'Sigma',
    status: 'preview',
    color: '#3FA9F5',
    light: '#E8F5FE',
    blurb: 'Number sense, fractions, measurement and word problems.',
    blurbLines: ['Number sense, fractions,', 'measurement and word problems.'],
    badgeArt: '/curriculum/Math_Badge_icon.svg',
    theme: {
      surface: '#F5FAFF',
      border: '#72BFF8',
      title: '#0964C9',
      badge: '#DFEEFF',
      pill: '#DCEEFF',
      pillText: '#1769BF',
    },
  },
  {
    id: 'L1',
    name: 'First Language - Sinhala / Tamil',
    icon: 'Languages',
    status: 'preview',
    color: '#16BFA6',
    light: '#E4FAF5',
    blurb: 'Grammar, comprehension and written expression.',
    blurbLines: ['Grammar, comprehension', 'and written expression.'],
    badgeArt: '/curriculum/first_language_sinhala_tamil_icon.svg',
    theme: {
      surface: '#F8FCEF',
      border: '#A8D96D',
      title: '#248B29',
      badge: '#E7F6D2',
      pill: '#E2F4CC',
      pillText: '#268829',
    },
  },
  {
    id: 'L2',
    name: 'Second Language - English',
    icon: 'BookOpen',
    status: 'preview',
    color: '#FF9F5A',
    light: '#FFF1E4',
    blurb: 'Vocabulary, structure and reading comprehension.',
    blurbLines: ['Vocabulary, structure and', 'reading comprehension.'],
    badgeArt: '/curriculum/second_language_english_icon.svg',
    theme: {
      surface: '#FFF9ED',
      border: '#F3C355',
      title: '#DC6111',
      badge: '#FFF1CF',
      pill: '#FFF0C7',
      pillText: '#D96816',
    },
  },
  {
    id: 'HER',
    name: 'Sri Lankan Heritage & Culture',
    icon: 'Landmark',
    status: 'preview',
    color: '#FF6B6B',
    light: '#FFEBEB',
    blurb: 'History, geography, civics and cultural knowledge.',
    blurbLines: ['History, geography, civics', 'and cultural knowledge.'],
    badgeArt: '/curriculum/heritage_island_icon.svg',
    theme: {
      surface: '#FFF7F4',
      border: '#F29B82',
      title: '#E34B35',
      badge: '#FFE3DA',
      pill: '#FFDCD3',
      pillText: '#DE4D38',
    },
  },
];

export const GI_SKILLS = [
  {
    id: 'GI-PS-01',
    name: 'Pattern & Sequence Reasoning',
    status: 'playable',
    blurb: 'Identify how shapes, symbols or objects change and predict what comes next.',
    learningGoal: 'Find the hidden rule in a sequence and use it to solve the next pattern.',
    assessmentType: 'Visual / Pattern Reasoning',
    prototypeLearningGoal: 'Recognize and apply transformation rules independently',
  },
  { id: 'GI-SR-01', name: 'Spatial Relationships', status: 'preview' },
  { id: 'GI-CL-01', name: 'Classification', status: 'preview' },
  { id: 'GI-LR-01', name: 'Logical Relationships', status: 'preview' },
];

/** The one fully implemented game world. */
export const GAME_WORLD = {
  id: 'pattern-temple',
  name: 'Pattern Temple',
  tagline: 'Unlock the temple gates by discovering how each symbol changes.',
  illustration: '/curriculum/Pattern_Temple_illustration.svg',
  gates: [
    { index: 1, label: 'Direction Rule', questionId: 'PT-G1-Q1' },
    { index: 2, label: 'Rotation Rule', questionId: 'PT-G2-Q1' },
    { index: 3, label: 'The Final Gate', questionId: null },
  ],
};

/** Shown on the Learn home Research card. */
export const PROTOTYPE_COVERAGE = {
  domainImplemented: 'General Intelligence & Aptitude',
  skillImplemented: 'Pattern & Sequence Reasoning',
  researchLoop: 'Fully demonstrated',
};

export const PREVIEW_LABEL = 'Full System Area';

export function getCurriculumArea(id) {
  return CURRICULUM_AREAS.find((area) => area.id === id) ?? null;
}

export function getSkill(id) {
  return GI_SKILLS.find((skill) => skill.id === id) ?? null;
}
