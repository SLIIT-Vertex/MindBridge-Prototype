import { motion } from 'framer-motion';

import SymbolRenderer from './glyphs/SymbolRenderer';

/**
 * Three answer buttons for a pattern item.
 *
 * Feedback colour states are the same ones MiniGame.jsx uses, so the two
 * activities feel like one app: chosen-correct goes solid `success`,
 * chosen-wrong goes solid `coral`, and after a wrong answer the correct option is
 * revealed as `success-light` with a `success` border.
 *
 * Every button carries its A / B / C letter as well as its glyph, so the answer
 * and the feedback never depend on colour alone (brief section 42). Buttons are
 * at least 64px tall for a child-sized tap target.
 */

const IDLE = 'bg-white text-ink card-shadow';

function optionClass({ status, isSelected, isCorrectAnswer }) {
  if (status !== 'idle' && isSelected) {
    return status === 'correct' ? 'bg-success text-white' : 'bg-coral text-white';
  }
  if (status === 'wrong' && isCorrectAnswer) {
    return 'bg-success-light text-success border-2 border-success';
  }
  return IDLE;
}

export default function PatternOptions({
  question,
  status = 'idle',
  selectedId = null,
  onSelect,
}) {
  if (!question) return null;

  const locked = status !== 'idle';

  return (
    <div className="grid grid-cols-3 gap-3">
      {question.options.map((option) => {
        const isSelected = selectedId === option.id;
        const isCorrectAnswer = option.id === question.correctOption;
        const revealed = status === 'wrong' && isCorrectAnswer;

        return (
          <motion.button
            key={option.id}
            type="button"
            whileTap={locked ? {} : { scale: 0.94 }}
            onClick={() => onSelect?.(option.id)}
            disabled={locked}
            aria-label={`Option ${option.id}`}
            className={`rounded-2xl min-h-16 py-3 px-1 flex flex-col items-center justify-center gap-1 transition-colors disabled:cursor-default ${optionClass(
              { status, isSelected, isCorrectAnswer }
            )}`}
          >
            <SymbolRenderer
              {...option}
              size={40}
              color={isSelected && locked ? '#FFFFFF' : undefined}
              animate={false}
            />
            <span className="font-display font-bold text-[11px]">
              {option.id}
              {revealed ? ' ✓' : ''}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
