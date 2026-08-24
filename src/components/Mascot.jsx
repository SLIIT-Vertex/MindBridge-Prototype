import { motion } from 'framer-motion';

const EXPRESSIONS = {
  happy: { eye: 'M0 0 a2.4 2.4 0 1 0 4.8 0 a2.4 2.4 0 1 0 -4.8 0', mouth: 'M -8 6 Q 0 14 8 6' },
  excited: { eye: 'M0 0 a2.8 2.8 0 1 0 5.6 0 a2.8 2.8 0 1 0 -5.6 0', mouth: 'M -9 5 Q 0 16 9 5' },
  thinking: { eye: 'M -3 0 L 3 0', mouth: 'M -6 8 Q 0 6 6 8' },
  calm: { eye: 'M -3 0 Q 0 3 3 0', mouth: 'M -6 7 Q 0 10 6 7' },
  sleepy: { eye: 'M -3 0 Q 0 2 3 0', mouth: 'M -5 8 Q 0 6 5 8' },
};

export default function Mascot({ size = 96, mood = 'happy', animate = true, className = '' }) {
  const expr = EXPRESSIONS[mood] || EXPRESSIONS.happy;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      animate={animate ? { y: [0, -6, 0] } : {}}
      transition={animate ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : {}}
    >
      {/* body */}
      <ellipse cx="60" cy="68" rx="40" ry="36" fill="#6C5CE7" />
      <ellipse cx="60" cy="70" rx="32" ry="28" fill="#8377EE" />
      {/* ears */}
      <circle cx="30" cy="34" r="14" fill="#6C5CE7" />
      <circle cx="90" cy="34" r="14" fill="#6C5CE7" />
      <circle cx="30" cy="34" r="7" fill="#FFC542" />
      <circle cx="90" cy="34" r="7" fill="#FFC542" />
      {/* face plate */}
      <ellipse cx="60" cy="62" rx="26" ry="22" fill="#FBF8F2" />
      {/* eyes */}
      <g transform="translate(48,58)" stroke="#2E2A45" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d={expr.eye} fill={mood === 'sleepy' ? 'none' : '#2E2A45'} />
      </g>
      <g transform="translate(72,58)" stroke="#2E2A45" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d={expr.eye} fill={mood === 'sleepy' ? 'none' : '#2E2A45'} />
      </g>
      {/* mouth */}
      <path d={expr.mouth} transform="translate(60,64)" stroke="#2E2A45" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="44" cy="70" r="4" fill="#FF9F5A" opacity="0.45" />
      <circle cx="76" cy="70" r="4" fill="#FF9F5A" opacity="0.45" />
      {/* antenna */}
      <line x1="60" y1="18" x2="60" y2="6" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="5" r="5" fill="#FFC542" />
    </motion.svg>
  );
}
