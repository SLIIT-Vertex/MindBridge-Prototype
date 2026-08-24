import { Flame, Star, BookOpen, Brain, Target, Trophy, Lock } from 'lucide-react';

const ICONS = { flame: Flame, star: Star, 'book-open': BookOpen, brain: Brain, target: Target, trophy: Trophy };

export default function AchievementBadge({ label, icon, earned, hint }) {
  const Icon = ICONS[icon] || Star;
  return (
    <div className={`bg-white rounded-2xl p-4 card-shadow flex flex-col items-center text-center gap-2 ${!earned ? 'opacity-60' : ''}`}>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: earned ? 'var(--color-coin-light)' : 'var(--color-cream-deep)' }}
      >
        {earned ? <Icon size={26} className="text-[#B8860B]" strokeWidth={1.8} /> : <Lock size={20} className="text-ink-faint" />}
      </div>
      <p className="font-display font-bold text-[11.5px] text-ink leading-tight">{label}</p>
      {!earned && hint && <p className="text-[9.5px] font-semibold text-ink-faint leading-tight">{hint}</p>}
    </div>
  );
}
