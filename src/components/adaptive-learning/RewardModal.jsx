import { motion, useReducedMotion } from 'framer-motion';

import Mascot from '../Mascot';

/**
 * Gate-unlock celebration for the Learn reward screen.
 *
 * The confetti is hand-rolled — 14 small rounded spans on framer-motion — rather
 * than a library, per the no-new-dependencies rule. It is purely decorative, so
 * it is skipped entirely under `prefers-reduced-motion` rather than merely
 * shortened; nothing in it carries meaning.
 */

const CONFETTI_COLORS = [
  'var(--color-primary)',
  'var(--color-coin)',
  'var(--color-teal)',
  'var(--color-orange)',
  'var(--color-coral)',
];

const CONFETTI = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + ((i * 3) % 5),
  drift: ((i % 2 === 0 ? 1 : -1) * (18 + ((i * 13) % 90))),
  spin: 90 + ((i * 47) % 270),
  delay: (i % 7) * 0.09,
  left: 8 + ((i * 6.4) % 84),
}));

export default function RewardModal({ title, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      {!reduceMotion && (
        <div className="absolute inset-x-0 top-0 h-1 pointer-events-none" aria-hidden="true">
          {CONFETTI.map((piece) => (
            <motion.span
              key={piece.id}
              className="absolute block rounded-[2px]"
              style={{
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.size,
                background: piece.color,
              }}
              initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
              animate={{ y: 320, x: piece.drift, rotate: piece.spin, opacity: 0 }}
              transition={{ duration: 1.9, delay: piece.delay, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}

      <div className="text-center pt-2">
        <div className="flex justify-center mb-1">
          <Mascot size={110} mood="excited" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink leading-tight px-2">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2 px-3">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
