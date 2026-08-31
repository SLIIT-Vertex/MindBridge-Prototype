import { motion, useReducedMotion } from 'framer-motion';

import SymbolRenderer from './glyphs/SymbolRenderer';

/**
 * The question stem: a prompt above a horizontal strip of symbol tiles ending in
 * a "?" tile.
 *
 * Sizing is driven by the 430px phone frame. Four tiles at 64px with `gap-2` fit
 * comfortably; a five-tile sequence drops to 56px rather than wrapping, because a
 * wrapped sequence stops reading as a left-to-right progression and the whole
 * item depends on that reading.
 *
 * Purely presentational — it never touches session state, so the baseline, the
 * temple and the independent check can all reuse it unchanged.
 */
export default function PatternQuestion({ question }) {
  const reduceMotion = useReducedMotion();

  if (!question) return null;

  const tileCount = question.sequence.length + 1;
  const tile = tileCount >= 5 ? 56 : 64;
  const glyph = Math.round(tile * 0.78);

  return (
    <div>
      <p className="text-[12.5px] font-semibold text-ink-soft text-center leading-relaxed mb-4">
        {question.prompt}
      </p>

      <div className="flex items-center justify-center gap-2">
        {question.sequence.map((entry, index) => (
          <motion.div
            key={`${question.id}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="bg-white rounded-2xl card-shadow flex items-center justify-center flex-shrink-0"
            style={{ width: tile, height: tile }}
          >
            <SymbolRenderer {...entry} size={glyph} />
          </motion.div>
        ))}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: question.sequence.length * 0.06 }}
          className="bg-cream-deep rounded-2xl border-2 border-dashed border-ink-faint flex items-center justify-center flex-shrink-0"
          style={{ width: tile, height: tile }}
          aria-label="Missing symbol"
        >
          <span className="font-display font-extrabold text-2xl text-ink-faint">?</span>
        </motion.div>
      </div>
    </div>
  );
}
