import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';

/**
 * One temple gate, in one of three states:
 *
 *   'locked' — doors shut, greyed, padlock. Not yet reachable.
 *   'active' — doors shut, glowing outline, gentle pulse. The current gate.
 *   'open'   — doors slide apart, lock fades, coin-coloured glow behind.
 *
 * The icon and label carry the state as well as colour does, so it survives
 * greyscale.
 */

const DOOR_SLIDE = 36;

/**
 * Not the #F2EDE1 of TempleScene's pyramids and platform: against that backdrop
 * the doors disappear and the gate reads as a bare arch.
 */
const STATE_STYLES = {
  locked: { stone: '#DDD4C0', seam: '#C9BFA6', edge: '#C9BFA6', labelClass: 'text-ink-faint' },
  active: { stone: '#EFECFD', seam: '#B9AEF2', edge: '#6C5CE7', labelClass: 'text-primary' },
  open: { stone: '#FBF8F2', seam: '#E6DFCE', edge: '#FFC542', labelClass: 'text-ink' },
};

export default function TempleGate({ state = 'locked', label, index, className = '' }) {
  const reduceMotion = useReducedMotion();
  const styles = STATE_STYLES[state] ?? STATE_STYLES.locked;
  const isOpen = state === 'open';

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <motion.div
        className="relative"
        style={{ width: 76, height: 92 }}
        animate={
          reduceMotion || state !== 'active' ? {} : { scale: [1, 1.035, 1] }
        }
        transition={
          reduceMotion || state !== 'active'
            ? {}
            : { duration: 1.9, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <svg
          viewBox="0 0 76 92"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          focusable="false"
        >
          {/* Warm light through an opened gateway. Kept light so the gate reads as
              an opening rather than a solid yellow door. */}
          {isOpen && (
            <>
              <rect x="10" y="14" width="56" height="78" rx="8" fill="#FFF7E1" />
              <rect x="10" y="14" width="56" height="78" rx="8" fill="#FFC542" opacity="0.3" />
            </>
          )}

          {/* Gate frame: an arch on two posts. */}
          <path
            d="M4 92 L4 34 A34 34 0 0 1 72 34 L72 92"
            fill="none"
            stroke={styles.edge}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* The two doors, each with plank lines so they read as doors. */}
          <motion.g
            initial={false}
            animate={{ x: isOpen ? -DOOR_SLIDE : 0, opacity: isOpen ? 0.25 : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeInOut' }}
          >
            <path
              d="M10 92 L10 36 A28 28 0 0 1 38 8 L38 92 Z"
              fill={styles.stone}
              stroke={styles.seam}
              strokeWidth="1.5"
            />
            <g stroke={styles.seam} strokeWidth="1.5" opacity="0.7">
              <line x1="14" y1="52" x2="34" y2="52" />
              <line x1="14" y1="68" x2="34" y2="68" />
            </g>
          </motion.g>
          <motion.g
            initial={false}
            animate={{ x: isOpen ? DOOR_SLIDE : 0, opacity: isOpen ? 0.25 : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeInOut' }}
          >
            <path
              d="M66 92 L66 36 A28 28 0 0 0 38 8 L38 92 Z"
              fill={styles.stone}
              stroke={styles.seam}
              strokeWidth="1.5"
            />
            <g stroke={styles.seam} strokeWidth="1.5" opacity="0.7">
              <line x1="42" y1="52" x2="62" y2="52" />
              <line x1="42" y1="68" x2="62" y2="68" />
            </g>
          </motion.g>
        </svg>

        {/* Lock medallion. */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 40 }}
          initial={false}
          animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.6 : 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: state === 'active' ? '#EFECFD' : '#FFFFFF',
              boxShadow: '0 1px 3px rgba(46,42,69,0.14)',
            }}
          >
            <Lock size={15} className={state === 'active' ? 'text-primary' : 'text-ink-faint'} />
          </div>
        </motion.div>

        {/* Opened gates get a tick, so "open" is not signalled by colour alone. */}
        {isOpen && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: 40 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.35 }}
          >
            <div className="w-8 h-8 rounded-full bg-coin flex items-center justify-center">
              <Check size={16} className="text-ink" strokeWidth={3} />
            </div>
          </motion.div>
        )}
      </motion.div>

      <p className={`text-[9.5px] font-bold uppercase tracking-wide ${styles.labelClass}`}>
        Gate {index}
      </p>
      {label ? (
        <p className="text-[10px] font-semibold text-ink-soft text-center leading-tight max-w-[84px]">
          {label}
        </p>
      ) : null}
    </div>
  );
}
