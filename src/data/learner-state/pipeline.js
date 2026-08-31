/**
 * The nine stages of the learner-state pipeline, as data.
 *
 * The StateFusion screen, the research panel and the written report all read
 * this list, so the diagram cannot drift from the implementation. `service`
 * names the module that owns each stage.
 */

export const VISUAL_FEATURE_LIST = [
  'Eye openness',
  'Gaze direction',
  'Head pose',
  'Facial dynamics',
  'Face visibility',
  'Landmark / tracking confidence',
];

export const BEHAVIOR_FEATURE_LIST = [
  'Response time',
  'Incorrect attempts',
  'Repeated attempts',
  'Hint usage',
  'Inactivity',
  'Recent performance',
  'Task completion',
  'Interaction frequency',
];

export const PIPELINE_STAGES = [
  {
    id: 'session',
    title: 'Child Learning Session',
    icon: 'Gamepad2',
    color: '#6C5CE7',
    bg: '#EFECFD',
    service: 'LearnerStateContext',
    items: ['Gamified activity', 'Practice paper follow-up', 'Guided practice'],
  },
  {
    id: 'features',
    title: 'Visual + Learning-Behaviour Pipelines',
    icon: 'ScanFace',
    color: '#3FA9F5',
    bg: '#E8F5FE',
    service: 'visualFeatures.js · behaviorFeatures.js',
    items: ['6 visual features', '8 behaviour features'],
  },
  {
    id: 'reliability',
    title: 'Reliability Estimation',
    icon: 'SignalHigh',
    color: '#16BFA6',
    bg: '#E4FAF5',
    service: 'visualFeatures.js · behaviorFeatures.js',
    items: ['Visual reliability', 'Behaviour reliability'],
  },
  {
    id: 'baseline',
    title: 'Learner Baseline Comparison',
    icon: 'UserCheck',
    color: '#FF9F5A',
    bg: '#FFF1E4',
    service: 'learnerBaselineService.js',
    items: ['Own typical response time', 'Own typical inactivity', 'Deviation in sigma'],
  },
  {
    id: 'window',
    title: '15\u201330 Second Temporal Window',
    icon: 'Timer',
    color: '#6C5CE7',
    bg: '#EFECFD',
    service: 'temporalWindow.js',
    items: ['Aggregated features', 'Not a single frame', 'Not a single answer'],
  },
  {
    id: 'fusion',
    title: 'Reliability-Aware Fusion',
    icon: 'Scale',
    color: '#3FA9F5',
    bg: '#E8F5FE',
    service: 'reliabilityFusion.js',
    items: ['Dynamic visual weight', 'Dynamic behaviour weight'],
  },
  {
    id: 'state',
    title: 'Confusion / Disengagement Estimate',
    icon: 'Brain',
    color: '#16BFA6',
    bg: '#E4FAF5',
    service: 'reliabilityFusion.js',
    items: ['Confusion probability', 'Disengagement probability'],
  },
  {
    id: 'persistence',
    title: 'Persistence Trajectory',
    icon: 'TrendingUp',
    color: '#FF9F5A',
    bg: '#FFF1E4',
    service: 'persistenceAnalyzer.js',
    items: ['Still trying?', 'Rising / steady / falling'],
  },
  {
    id: 'decision',
    title: 'Adaptive Decision',
    icon: 'LifeBuoy',
    color: '#6C5CE7',
    bg: '#EFECFD',
    service: 'adaptiveDecision.js',
    items: ['Productive confusion \u2192 wait', 'Intervention-worthy \u2192 support', 'Disengagement \u2192 re-engage'],
  },
];

/** What this component consumes from, and returns to, the rest of MindBridge. */
export const INTEGRATION_CONTRACT = {
  inputs: [
    {
      source: 'Gamified Learning Module',
      fields: ['Response time', 'Attempts', 'Inactivity', 'Activity performance'],
    },
    {
      source: 'Learner Profile / Assessment',
      fields: ['Recent performance', 'Historical progress', 'Weak-area context'],
    },
  ],
  outputs: [
    {
      target: 'AI Tutor',
      fields: ['Learner state', 'Support need', 'Support type', 'Confidence', 'Persistence trend'],
    },
    {
      target: 'Gamified Learning Module',
      fields: ['Activity adjustment request', 'Break request'],
    },
    {
      target: 'Parent / Research view',
      fields: ['Reliability scores', 'Baseline deviation', 'Intervention history'],
    },
  ],
};

export const COMPONENT_BOUNDARY =
  'This component observes, estimates state and requests support. The AI Tutor component generates the explanation, the hint text and the scaffold.';
