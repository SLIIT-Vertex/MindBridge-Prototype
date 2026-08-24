import { motion } from 'framer-motion';
import { Eye, Activity, Brain, LifeBuoy, ArrowDown } from 'lucide-react';
import AppHeader from '../components/AppHeader';

const LAYERS = [
  {
    title: 'Visual Signals',
    icon: Eye,
    color: '#3FA9F5',
    bg: '#E8F5FE',
    items: ['Eye openness', 'Facial behaviour', 'Head pose', 'Gaze'],
  },
  {
    title: 'Learning Behaviour',
    icon: Activity,
    color: '#16BFA6',
    bg: '#E4FAF5',
    items: ['Response time', 'Incorrect attempts', 'Repeated attempts', 'Inactivity', 'Recent performance'],
  },
  {
    title: 'Learner-State Estimation',
    icon: Brain,
    color: '#6C5CE7',
    bg: '#EFECFD',
    items: ['Engagement', 'Confusion', 'Frustration', 'Low Alertness'],
  },
  {
    title: 'Adaptive Support',
    icon: LifeBuoy,
    color: '#FF9F5A',
    bg: '#FFF1E4',
    items: ['Hints', 'Difficulty adjustment', 'Break suggestion', 'Tutor assistance', 'Revision recommendation'],
  },
];

export default function StateFusion() {
  return (
    <div className="pb-8">
      <AppHeader title="How MindBridge Works" />

      <div className="px-5 mt-2 mb-2">
        <p className="text-[13px] font-semibold text-ink-soft text-center leading-relaxed">
          Multiple signals are considered together before support is provided.
        </p>
      </div>

      <div className="px-5 flex flex-col items-center gap-1 mt-5">
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="w-full"
          >
            <div className="w-full rounded-2xl p-4 card-shadow" style={{ background: layer.bg }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
                  <layer.icon size={18} color={layer.color} strokeWidth={1.8} />
                </div>
                <p className="font-display font-bold text-[13.5px] text-ink">{layer.title}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {layer.items.map((item) => (
                  <span
                    key={item}
                    className="text-[10.5px] font-semibold rounded-full px-2.5 py-1 bg-white"
                    style={{ color: layer.color }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex justify-center py-1.5">
                <ArrowDown size={18} className="text-ink-faint" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
