import { motion, useReducedMotion } from 'framer-motion';

/**
 * Flat-vector temple backdrop for the Pattern Temple activity.
 *
 * Deliberately low-contrast and desaturated: this sits behind the pattern puzzle,
 * and the puzzle must stay the dominant thing on screen. Nothing here carries
 * meaning, so all of its motion is decorative and disabled under
 * prefers-reduced-motion.
 *
 * Renders `children` in an overlay layer above the backdrop, which is how Phase 5
 * places the three gates and the learner avatar on the path without this
 * component needing to know about them.
 */
export default function TempleScene({ children, height = 220, className = '' }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ height }}>
      <svg
        viewBox="0 0 430 220"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="temple-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1E4" />
            <stop offset="100%" stopColor="#FBF8F2" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="430" height="220" fill="url(#temple-sky)" />

        {/* Sun disc, kept very faint so it reads as atmosphere, not a focal point. */}
        <circle cx="330" cy="52" r="26" fill="#FFC542" opacity="0.16" />

        {/* Two stepped stone pyramids. Back one is lighter for aerial depth. */}
        <polygon points="86,168 148,60 210,168" fill="#F2EDE1" opacity="0.7" />
        <polygon points="196,168 272,44 348,168" fill="#F2EDE1" />

        {/* Stepped courses on the front pyramid. */}
        <g stroke="#E6DFCE" strokeWidth="2" opacity="0.85">
          <line x1="234" y1="112" x2="310" y2="112" />
          <line x1="222" y1="132" x2="322" y2="132" />
          <line x1="210" y1="152" x2="334" y2="152" />
        </g>

        {/* Temple platform. */}
        <rect x="0" y="168" width="430" height="14" fill="#E6DFCE" />
        <rect x="0" y="182" width="430" height="38" fill="#F2EDE1" />

        {/* Paving joints on the platform. */}
        <g stroke="#E6DFCE" strokeWidth="2" opacity="0.9">
          <line x1="70" y1="182" x2="70" y2="220" />
          <line x1="170" y1="182" x2="170" y2="220" />
          <line x1="270" y1="182" x2="270" y2="220" />
          <line x1="370" y1="182" x2="370" y2="220" />
        </g>

        {/* Torches. */}
        {[52, 378].map((x) => (
          <g key={x}>
            <rect x={x - 4} y="126" width="8" height="42" rx="3" fill="#D8CFBA" />
            <motion.ellipse
              cx={x}
              cy="118"
              rx="7"
              ry="11"
              fill="#FF9F5A"
              animate={reduceMotion ? {} : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }}
              transition={
                reduceMotion ? {} : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              }
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
            <ellipse cx={x} cy="120" rx="3.4" ry="5.5" fill="#FFC542" />
          </g>
        ))}
      </svg>

      {children ? <div className="relative w-full h-full">{children}</div> : null}
    </div>
  );
}
