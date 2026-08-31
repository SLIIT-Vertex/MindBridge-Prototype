import { motion, useReducedMotion } from 'framer-motion';

/**
 * The support-selection comparison table. RESEARCH VIEW ONLY — which support was
 * considered and rejected is a research artefact, not part of the child's
 * experience.
 *
 * Bars are proportional to predicted Independence Gain, meaning later UNSUPPORTED
 * improvement, not how much the support helps with the current question.
 */
export default function SupportComparison({ supports, selectedId }) {
  const reduceMotion = useReducedMotion();

  if (!supports || supports.length === 0) return null;

  const max = Math.max(...supports.map((s) => s.predictedIG), 0.0001);

  return (
    <div className="flex flex-col gap-3">
      {supports.map((support, index) => {
        const isSelected = support.id === selectedId;
        return (
          <div key={support.id}>
            <div className="flex justify-between gap-3 mb-1.5">
              <span
                className={`text-[11.5px] font-semibold ${isSelected ? 'text-white' : 'text-white/55'}`}
              >
                {support.label}
                {isSelected ? (
                  <span className="ml-1.5 text-[9.5px] font-bold uppercase tracking-wide text-coin">
                    ← SELECTED
                  </span>
                ) : null}
              </span>
              <span
                className={`text-[11px] font-display font-bold tabular-nums flex-shrink-0 ${
                  isSelected ? 'text-white' : 'text-white/70'
                }`}
              >
                +{support.predictedIG.toFixed(2)}
              </span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isSelected ? '#FFC542' : 'rgba(255,255,255,0.25)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(support.predictedIG / max) * 100}%` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.7, delay: index * 0.08, ease: 'easeOut' }
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
