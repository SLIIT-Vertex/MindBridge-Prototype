import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck } from 'lucide-react';

import QuarterTurnDiagram, { DirectionTile, QuarterChip } from './QuarterTurnDiagram';
import { WORKED_EXAMPLE } from '../../data/adaptive-learning/learningSupports';

/**
 * Worked Example — a solved sequence, one teaching beat at a time.
 *
 * Static on purpose (no spinning, no quiz). Beat 1 introduces a quarter turn
 * with the same four-slice diagram the other supports use.
 */

export default function WorkedExampleSupport({ onComplete, replay = false }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = WORKED_EXAMPLE.steps[stepIndex];
  const isLast = stepIndex >= WORKED_EXAMPLE.steps.length - 1;

  const advance = () => {
    if (isLast) {
      onComplete?.();
      return;
    }
    setStepIndex((index) => index + 1);
  };

  return (
    <div>
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-1.5">
          <BookOpenCheck size={15} className="text-primary" aria-hidden="true" />
          <p className="text-[10.5px] font-bold uppercase tracking-wide text-primary">
            Worked Example
          </p>
        </div>
        <p className="text-[11.5px] font-semibold text-ink-soft mt-1 leading-snug px-2">
          A solved path. Read each step — there is no quiz.
        </p>
      </div>

      <div className="flex items-center justify-center gap-1 mb-4">
        {WORKED_EXAMPLE.sequence.map((entry, index) => (
          <Fragment key={`${entry.rotation}-${index}`}>
            <DirectionTile
              rotation={entry.rotation}
              size={48}
              emphasize={
                step.highlightIndex === index || step.highlightIndex === index - 1
              }
              dim={
                typeof step.highlightIndex === 'number' &&
                step.highlightIndex !== index &&
                step.highlightIndex !== index - 1
              }
            />
            {index < WORKED_EXAMPLE.sequence.length - 1 ? <QuarterChip /> : null}
          </Fragment>
        ))}
      </div>

      <motion.div
        key={step.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl px-3.5 py-3.5 card-shadow"
      >
        <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">
          Step {stepIndex + 1} of {WORKED_EXAMPLE.steps.length}
        </p>
        <p className="font-display font-extrabold text-[15px] text-ink leading-snug">
          {step.title}
        </p>
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-1.5">
          {step.body}
        </p>
        {typeof step.diagramFrom === 'number' ? (
          <div className="mt-3">
            <QuarterTurnDiagram from={step.diagramFrom} size={148} />
          </div>
        ) : null}
      </motion.div>

      <button
        type="button"
        onClick={advance}
        className="mt-5 w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
      >
        {isLast ? (replay ? 'Back to the puzzle' : "I'm ready to try") : 'Next step'}
      </button>
    </div>
  );
}
