import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Star, Coins, Gamepad2, FileText, Sparkles, LineChart, ChevronRight, Bell, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATARS, WORLDS } from '../data/mockData';
import AvatarIcon from '../components/AvatarIcon';
import MissionCard from '../components/MissionCard';
import RewardChip from '../components/RewardChip';

const FEATURES = [
  { key: 'worlds', to: '/worlds', title: 'Play & Learn', subtitle: 'Explore your learning worlds', icon: Gamepad2, color: '#6C5CE7', bg: '#EFECFD' },
  { key: 'practice', to: '/practice', title: 'Practice Paper', subtitle: 'Your personalized practice is ready', icon: FileText, color: '#3FA9F5', bg: '#E8F5FE' },
  { key: 'mindy', to: '/mindy', title: 'Ask Mindy', subtitle: 'Get hints and explanations', icon: Sparkles, color: '#FF9F5A', bg: '#FFF1E4' },
  { key: 'progress', to: '/progress', title: 'My Progress', subtitle: 'See how much you\'ve improved', icon: LineChart, color: '#16BFA6', bg: '#E4FAF5' },
];

export default function Home() {
  const { child, avatarId, streak, level, coins, missionProgress } = useApp();
  const navigate = useNavigate();
  const avatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];

  return (
    <div className="pt-6">
      <div className="px-5 flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center active:scale-90 transition-transform">
            <AvatarIcon variant={avatar.emoji} size={38} />
          </button>
          <div>
            <p className="font-display font-extrabold text-[17px] text-ink leading-tight">Good morning, {child.name}!</p>
            <p className="text-[12.5px] font-semibold text-ink-soft">Ready for today's learning adventure?</p>
          </div>
        </div>
        <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform">
          <Bell size={18} className="text-ink" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-coral" />
        </button>
      </div>

      <div className="px-5 flex gap-2 mb-6">
        <RewardChip icon={Flame} value={`${streak} day streak`} tone="orange" />
        <RewardChip icon={Star} value={`Level ${level}`} tone="primary" />
        <RewardChip icon={Coins} value={coins.toLocaleString()} tone="coin" />
      </div>

      <div className="px-5 mb-6">
        <MissionCard
          title="Master Fractions"
          activityCount={3}
          xp={120}
          progress={missionProgress}
          total={3}
          onContinue={() => navigate('/worlds/number-kingdom')}
        />
      </div>

      <div className="px-5 mb-6">
        <RecommendationCard navigate={navigate} />
      </div>

      <div className="px-5 mb-6">
        <button
          onClick={() => navigate('/companion')}
          className="w-full text-left bg-teal-light rounded-2xl p-4 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
            <HeartHandshake size={21} className="text-teal" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[13.5px] text-ink">Learning Companion</p>
            <p className="text-[11px] font-semibold text-ink-soft">Support that adapts to how you're feeling</p>
          </div>
          <ChevronRight size={18} className="text-ink-faint flex-shrink-0" />
        </button>
      </div>

      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f, i) => (
            <motion.button
              key={f.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => navigate(f.to)}
              className="bg-white rounded-2xl p-4 card-shadow text-left active:scale-95 transition-transform"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: f.bg }}>
                <f.icon size={22} color={f.color} strokeWidth={1.8} />
              </div>
              <p className="font-display font-bold text-[13.5px] text-ink mb-0.5">{f.title}</p>
              <p className="text-[11px] font-semibold text-ink-soft leading-snug">{f.subtitle}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ navigate }) {
  return (
    <button
      onClick={() => navigate('/worlds/number-kingdom')}
      className="w-full text-left bg-white rounded-2xl p-4 card-shadow flex items-center gap-3 active:scale-95 transition-transform"
    >
      <div className="w-12 h-12 rounded-xl bg-orange-light flex items-center justify-center flex-shrink-0">
        <Sparkles size={22} className="text-orange" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10.5px] font-bold text-orange uppercase tracking-wide">Recommended for you</p>
        <p className="font-display font-bold text-[14px] text-ink">Fractions Adventure</p>
        <p className="text-[11px] font-semibold text-ink-soft">Based on your latest practice paper &middot; 10 min &middot; +80 XP</p>
      </div>
      <ChevronRight size={18} className="text-ink-faint flex-shrink-0" />
    </button>
  );
}
