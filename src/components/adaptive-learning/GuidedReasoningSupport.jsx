import { Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircleQuestionMark, RotateCcw, RotateCw } from 'lucide-react';

import ArrowGlyph from './glyphs/ArrowGlyph';
import QuarterTurnDiagram, {
  DirectionTile,
  QuarterChip,
  QuarterCountIcon,
} from './QuarterTurnDiagram';
import { GUIDED_REASONING_STEPS } from '../../data/adaptive-learning/learningSupports';

/** The sequence the questions are about: Up → Right → Down → ? */
const GUIDED_SEQUENCE = [0, 90, 180];

/**
 * Guided Reasoning — a three-question ladder that leads to the clockwise-90
 * rule. A quarter-turn diagram sits above the questions so "quarter" is taught,
 * not assumed. Options are visual, not one-word buttons.
 */

export default function GuidedReasoningSupport({ onComplete, replay = false }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [status, setStatus] = useState('idle');

  const step = GUIDED_REASONING_STEPS[stepIndex];
  const isLast = stepIndex >= GUIDED_REASONING_STEPS.length - 1;

  const choose = (option) => {
    if (status !== 'idle') return;
    setPicked(option.id);
    if (!option.correct) {
      setStatus('wrong');
      return;
    }
    setStatus('correct');
  };

  const advance = () => {
    if (isLast) {
      onComplete?.();
      return;
    }
    setStepIndex((index) => index + 1);
    setPicked(null);
    setStatus('idle');
  };

  const retry = () => {
    setPicked(null);
    setStatus('idle');
  };

  return (
    <div>
      <div className="text-center mb-3">
        <div className="flex items-center justify-center gap-1.5">
          <MessageCircleQuestionMark size={15} className="text-primary" aria-hidden="true" />
          <p className="text-[10.5px] font-bold uppercase tracking-wide text-primary">
            Guided Reasoning
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-ink-faint mt-1">
          Question {stepIndex + 1} of {GUIDED_REASONING_STEPS.length}
        </p>
      </div>

      <div className="flex items-center gap-3 bg-primary-light rounded-2xl px-3 py-2.5 mb-4">
        <QuarterTurnDiagram from={0} size={92} compact />
        <p className="text-[12px] font-semibold text-ink leading-snug text-left">
          <span className="font-display font-extrabold text-primary">A quarter turn</span> is one
          slice of the circle. Clockwise goes Up → Right → Down → Left, like a clock.
        </p>
      </div>

      <div className="flex items-center justify-center gap-1 mb-3">
        {GUIDED_SEQUENCE.map((rotation, index) => (
          <Fragment key={rotation}>
            <DirectionTile
              rotation={rotation}
              size={46}
              emphasize={step.highlight?.includes(index)}
              dim={Boolean(step.highlight) && !step.highlight.includes(index)}
            />
            <QuarterChip />
          </Fragment>
        ))}
        <MysteryTile emphasize={step.highlight?.includes(3)} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <p className="font-display font-bold text-[15px] text-ink text-center leading-snug mb-3">
            {step.prompt}
          </p>

          <div
            className={`grid gap-2 ${
              step.layout === 'two' ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {step.options.map((option) => {
              const isPicked = picked === option.id;
              let style = 'bg-white text-ink card-shadow';
              if (status !== 'idle' && isPicked) {
                style = option.correct ? 'bg-success text-white' : 'bg-coral text-white';
              } else if (status === 'wrong' && option.correct) {
                style = 'bg-success-light text-success border-2 border-success';
              }
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileTap={status === 'idle' ? { scale: 0.96 } : {}}
                  onClick={() => choose(option)}
                  disabled={status !== 'idle'}
                  className={`min-h-16 rounded-2xl px-2 py-2 font-display font-bold text-[12.5px] leading-tight transition-colors disabled:cursor-default ${style}`}
                >
                  <OptionFace option={option} inverted={status !== 'idle' && isPicked} />
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {status === 'correct' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="font-display font-bold text-[13.5px] text-success leading-snug px-1">
                  {step.feedback}
                </p>
                <button
                  type="button"
                  onClick={advance}
                  className="mt-3 min-h-12 px-8 rounded-full bg-primary text-white font-display font-bold text-[13.5px] active:scale-95 transition-transform"
                >
                  {isLast ? (replay ? 'Back to the puzzle' : "I'm ready to try") : 'Next'}
                </button>
              </motion.div>
            )}
            {status === 'wrong' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-4"
              >
                <p className="font-display font-bold text-[13.5px] text-ink">
                  Not quite — look at the quarter-turn slice above.
                </p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-3 min-h-12 px-8 rounded-full bg-primary text-white font-display font-bold text-[13.5px] active:scale-95 transition-transform"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function MysteryTile({ emphasize = false }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`rounded-xl border-2 border-dashed flex items-center justify-center font-display font-extrabold text-[18px] ${
          emphasize
            ? 'border-primary bg-primary-light text-primary ring-2 ring-primary'
            : 'border-primary/40 bg-primary-light/40 text-primary'
        }`}
        style={{ width: 46, height: 46 }}
      >
        ?
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">Next</span>
    </div>
  );
}

function OptionFace({ option, inverted }) {
  const muted = inverted ? 'text-white/80' : 'text-ink-soft';
  const ink = inverted ? 'text-white' : 'text-ink';

  if (typeof option.wedges === 'number') {
    return (
      <span className="flex flex-col items-center gap-1">
        <QuarterCountIcon quarters={option.wedges} size={32} />
        <span className={ink}>{option.label}</span>
        <span className={`text-[10px] font-semibold ${muted}`}>{option.sub}</span>
      </span>
    );
  }

  if (typeof option.rotation === 'number') {
    return (
      <span className="flex flex-col items-center gap-1">
        <ArrowGlyph rotation={option.rotation} size={28} animate={false} color={inverted ? '#FFFFFF' : '#2E2A45'} />
        <span className={ink}>{option.label}</span>
      </span>
    );
  }

  const Icon = option.turn < 0 ? RotateCcw : RotateCw;
  return (
    <span className="flex flex-col items-center gap-1">
      <Icon size={18} className={inverted ? 'text-white' : 'text-primary'} aria-hidden="true" />
      <span className={ink}>{option.label}</span>
      <span className={`text-[10px] font-semibold ${muted}`}>{option.sub}</span>
    </span>
  );
}
