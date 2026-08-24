import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { WORLD_ICONS } from './worldIcons';

export default function GameWorldCard({ world, onClick }) {
  const Icon = WORLD_ICONS[world.id] || WORLD_ICONS.default;

  return (
    <motion.button
      whileTap={world.unlocked ? { scale: 0.96 } : {}}
      onClick={world.unlocked ? onClick : undefined}
      className={`w-full text-left bg-white rounded-2xl p-4 card-shadow flex items-center gap-4 ${!world.unlocked ? 'opacity-60' : ''}`}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: world.light }}
      >
        {world.unlocked ? <Icon size={30} color={world.color} strokeWidth={1.8} /> : <Lock size={24} className="text-ink-faint" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[15px] text-ink truncate">{world.name}</p>
        <p className="text-[11.5px] font-semibold text-ink-soft mb-2">{world.subject}</p>
        {world.unlocked ? (
          <ProgressBar pct={world.progress} color={world.color} height={7} />
        ) : (
          <p className="text-[11px] font-semibold text-ink-faint">Locked</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <Star size={16} className="text-coin fill-coin" />
        <span className="text-[11px] font-bold text-ink-soft">{world.stars}/{world.maxStars}</span>
      </div>
    </motion.button>
  );
}
