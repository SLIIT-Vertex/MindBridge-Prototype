import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { INDEPENDENT_QUESTIONS } from '../../data/adaptive-learning/patternQuestions';

/**
 * The eleven-step research loop as a vertical timeline. Built for legibility over
 * density, since a supervisor may read it from across a room: one idea per node.
 *
 * Every value comes from live session state, so a Natural Interaction Mode run
 * reports its own numbers rather than the scripted ones.
 */

const PLACEHOLDER = 'Not yet observed';

function seconds(ms) {
  return ms ? `${(ms / 1000).toFixed(1)}s` : null;
}

function percent(fraction) {
  return fraction == null ? null : `${Math.round(fraction * 100)}%`;
}

export default function ResearchFlowSummary() {
  const reduceMotion = useReducedMotion();
  const {
    skill,
    gameplay,
    difficulty,
    baseline,
    independentCheck,
    selectedSupport,
    supportStatus,
    derived,
  } = useAdaptive();

  const view = derived.independenceGainView;
  const belief = derived.topBelief;
  const policy = derived.latestPolicyRecord;

  const steps = [
    {
      eyebrow: 'Curriculum skill',
      value: skill.id,
      detail: `${skill.name} · Grade 5 Scholarship`,
    },
    {
      eyebrow: 'Unsupported baseline',
      value: percent(baseline.score) ?? PLACEHOLDER,
      detail: 'Measured with no help available of any kind.',
      tone: 'text-ink-faint',
    },
    {
      eyebrow: 'Gameplay evidence captured',
      value: `${gameplay.attempts || 0} attempts`,
      detail: 'Answers, attempt counts, response times and repeated error patterns.',
    },
    {
      eyebrow: 'Meaningful difficulty detected',
      value: difficulty.detected ? `Confidence ${difficulty.confidence.toFixed(2)}` : PLACEHOLDER,
      detail: difficulty.detected
        ? `${gameplay.relatedErrors} related errors · ${seconds(gameplay.avgResponseTimeOnErrorsMs)} average on errors.`
        : 'Not a single mistake — repeated, related, slow errors.',
      tone: 'text-orange',
    },
    {
      eyebrow: 'Likely misunderstanding estimated',
      value: `${Math.round(belief.probability * 100)}%`,
      detail: `${belief.label} — held as a probability, not a certainty.`,
    },
    {
      eyebrow: 'Support options compared',
      value: derived.rankedSupports.map((s) => `+${s.predictedIG.toFixed(2)}`).join(' · '),
      detail: 'Each support type scored by predicted Independence Gain.',
    },
    {
      eyebrow: 'Support selected and delivered',
      value: selectedSupport?.label ?? PLACEHOLDER,
      detail: 'Only the selected support ever reaches the learner.',
      tone: 'text-primary',
    },
    {
      eyebrow: 'Support removed',
      value: supportStatus === 'removed' ? 'Withdrawn' : PLACEHOLDER,
      detail: 'Success with help is not treated as proof of learning.',
    },
    {
      eyebrow: 'Independent check',
      value: percent(independentCheck.score) ?? PLACEHOLDER,
      detail: `${INDEPENDENT_QUESTIONS.length} parallel-form problems, no support on screen.`,
      tone: 'text-teal',
    },
    {
      eyebrow: 'Independence Gain',
      value: view.available ? view.gainLabel : PLACEHOLDER,
      detail: 'Unsupported after minus unsupported before.',
      tone: 'text-teal',
      emphasis: true,
    },
    {
      eyebrow: 'Support effectiveness updated',
      value: policy
        ? `+${policy.predictedIG.toFixed(2)} → +${policy.observedIG.toFixed(2)}`
        : PLACEHOLDER,
      detail: policy
        ? `${belief.label} · so future support decisions can improve.`
        : 'Predicted against observed, stored for the next decision.',
      tone: 'text-teal',
    },
  ];

  return (
    <ol className="flex flex-col">
      {steps.map((step, index) => (
        <motion.li
          key={step.eyebrow}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: index * 0.05 }}
        >
          <div
            className={`bg-white rounded-2xl card-shadow px-4 py-3.5 ${
              step.emphasis ? 'ring-2 ring-teal' : ''
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              {index + 1}. {step.eyebrow}
            </p>
            <p
              className={`font-display font-extrabold leading-tight mt-1 ${
                step.emphasis ? 'text-[30px]' : 'text-[17px]'
              } ${step.tone ?? 'text-ink'}`}
            >
              {step.value}
            </p>
            <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed mt-1">
              {step.detail}
            </p>
          </div>

          {index < steps.length - 1 && (
            <div className="flex justify-center py-1.5" aria-hidden="true">
              <ChevronDown size={18} className="text-cream-deep" strokeWidth={3} />
            </div>
          )}
        </motion.li>
      ))}
    </ol>
  );
}
