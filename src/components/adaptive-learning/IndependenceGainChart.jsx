import { motion, useReducedMotion } from 'framer-motion';

/**
 * Independence Gain comparison as two plain animated bars rather than Recharts: a
 * two-value comparison does not justify a chart render tree, and hand-rolled bars
 * give the exact stagger the demo narration depends on.
 *
 * Every bar carries its own percentage label, so meaning never rests on colour.
 */

const BEFORE_LABEL = 'BEFORE SUPPORT';
const AFTER_LABEL = 'AFTER SUPPORT REMOVAL';

function Bar({ label, percent, barClass, valueClass, delay, reduceMotion }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft">
          {label}
        </span>
        <span className={`font-display font-extrabold text-[15px] ${valueClass}`}>
          {percent == null ? '—' : `${percent}%`}
        </span>
      </div>
      <div className="h-3 rounded-full bg-cream-deep overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${percent ?? 0}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function IndependenceGainChart({ view }) {
  const reduceMotion = useReducedMotion();

  if (!view?.available) {
    return (
      <div className="rounded-2xl bg-white card-shadow px-4 py-5 text-center">
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed">
          Not yet observed. Independence Gain needs both an unsupported baseline and a completed
          independent check.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white card-shadow px-4 py-5">
      <Bar
        label={BEFORE_LABEL}
        percent={view.beforePercent}
        barClass="bg-ink-faint"
        valueClass="text-ink-faint"
        delay={0}
        reduceMotion={reduceMotion}
      />

      <motion.div
        className="text-center my-5"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: 0.9 }}
      >
        <p className="font-display font-extrabold text-[40px] leading-none text-teal">
          {view.gainLabel}
        </p>
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-ink-soft mt-1.5">
          Independence Gain
        </p>
      </motion.div>

      <Bar
        label={AFTER_LABEL}
        percent={view.afterPercent}
        barClass="bg-teal"
        valueClass="text-teal"
        delay={0.9}
        reduceMotion={reduceMotion}
      />
    </div>
  );
}
