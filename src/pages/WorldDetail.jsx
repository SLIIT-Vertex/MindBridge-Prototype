import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Lock, Check, Play, Crown } from 'lucide-react';
import { WORLDS } from '../data/mockData';
import { WORLD_ICONS } from '../components/worldIcons';
import AppHeader from '../components/AppHeader';

export default function WorldDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const world = WORLDS.find((w) => w.id === id) || WORLDS[0];
  const Icon = WORLD_ICONS[world.id] || WORLD_ICONS.default;

  return (
    <div className="pb-4">
      <AppHeader title={world.name} />

      <div className="px-5 mt-2 mb-6">
        <div className="rounded-2xl p-5 card-shadow-lg flex items-center gap-4" style={{ background: world.light }}>
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <Icon size={32} color={world.color} strokeWidth={1.6} />
          </div>
          <div>
            <p className="font-display font-bold text-[13px]" style={{ color: world.color }}>{world.subject}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star size={14} className="text-coin fill-coin" />
              <span className="text-[12.5px] font-bold text-ink">{world.stars} / {world.maxStars} stars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5">
        <h3 className="font-display font-bold text-[15px] text-ink mb-4">Learning Path</h3>
        <div className="relative pl-8">
          <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-cream-deep" />
          <div className="flex flex-col gap-5">
            {(world.missions.length ? world.missions : []).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative"
              >
                <span
                  className="absolute -left-8 top-1 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: m.status === 'locked' ? '#EDEBF5' : world.light }}
                >
                  {m.status === 'done' && <Check size={15} color={world.color} strokeWidth={3} />}
                  {m.status === 'current' && <Play size={13} color={world.color} fill={world.color} />}
                  {m.status === 'locked' && <Lock size={13} className="text-ink-faint" />}
                </span>

                <button
                  onClick={() => m.status !== 'locked' && navigate('/minigame')}
                  disabled={m.status === 'locked'}
                  className={`w-full text-left bg-white rounded-2xl p-4 card-shadow flex items-center justify-between ${
                    m.status === 'locked' ? 'opacity-55' : 'active:scale-95 transition-transform'
                  }`}
                >
                  <div>
                    <p className="font-display font-bold text-[13.5px] text-ink flex items-center gap-1.5">
                      {m.name.includes('Boss') && <Crown size={14} className="text-coin" />}
                      {m.name}
                    </p>
                    <div className="flex gap-0.5 mt-1.5">
                      {[0, 1, 2].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s < m.stars ? 'text-coin fill-coin' : 'text-cream-deep fill-cream-deep'}
                        />
                      ))}
                    </div>
                  </div>
                  {m.status === 'current' && (
                    <span className="text-[10.5px] font-display font-bold text-white rounded-full px-3 py-1.5" style={{ background: world.color }}>
                      Start
                    </span>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
