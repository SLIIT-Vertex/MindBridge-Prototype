import { motion, useReducedMotion } from 'framer-motion';

import { MODEL_SUBTITLE } from '../../data/adaptive-learning/misconceptions';

/**
 * Probability bars for the Prototype Probabilistic Learner Model, modelled on the
 * State Trend bars in LearnerStateInsights and inverted for the dark drawer.
 *
 * The percentage always sits next to the label, so meaning never depends on
 * colour alone; the `primary` tint on the top belief is reinforcement only.
 */
export default function MisconceptionBeliefBars({ rows, showSubtitle = true }) {
  const reduceMotion = useReducedMotion();

  if (!rows || rows.length === 0) return null;

  const total = rows.reduce((sum, row) => sum + row.percentage, 0);

  return (
    <div>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => {
          const isTop = index === 0;
          return (
            <div key={row.id}>
              <div className="flex justify-between gap-3 mb-1.5">
                <span
                  className={`text-[11.5px] font-semibold ${isTop ? 'text-white' : 'text-white/55'}`}
                >
                  {row.label}
                </span>
                <span
                  className={`text-[11px] font-display font-bold tabular-nums ${
                    isTop ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {row.percentage}%
                </span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: isTop ? '#6C5CE7' : 'rgba(255,255,255,0.25)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${row.percentage}%` }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 0.7, delay: index * 0.06, ease: 'easeOut' }
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      {showSubtitle ? (
        <p className="text-[10.5px] font-semibold text-white/55 mt-3.5 leading-relaxed">
          {MODEL_SUBTITLE}
        </p>
      ) : null}

      <p className="text-[10px] font-semibold text-white/30 mt-1.5 tabular-nums">
        Total {total}%
      </p>
    </div>
  );
}
