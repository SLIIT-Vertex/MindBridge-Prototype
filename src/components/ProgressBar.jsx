import { motion } from 'framer-motion';

export default function ProgressBar({ pct, color = 'var(--color-primary)', track = 'bg-cream-deep', height = 10 }) {
  return (
    <div className={`w-full ${track} rounded-full overflow-hidden`} style={{ height }}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
}
