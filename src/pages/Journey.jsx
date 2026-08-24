import { motion } from 'framer-motion';
import { Gamepad2, ClipboardCheck, Target, FileText, TrendingUp, Sparkles, Eye, RefreshCcw, ArrowDown } from 'lucide-react';
import AppHeader from '../components/AppHeader';

const STEPS = [
  { icon: Gamepad2, text: 'Child plays educational games', color: '#6C5CE7', bg: '#EFECFD' },
  { icon: ClipboardCheck, text: 'Performance is recorded', color: '#3FA9F5', bg: '#E8F5FE' },
  { icon: Target, text: 'Skills needing practice are identified', color: '#FF9F5A', bg: '#FFF1E4' },
  { icon: FileText, text: 'A personalized practice paper is recommended', color: '#16BFA6', bg: '#E4FAF5' },
  { icon: TrendingUp, text: 'Paper results update the learner profile', color: '#6C5CE7', bg: '#EFECFD' },
  { icon: Sparkles, text: 'Mindy provides explanations and revision support', color: '#FF9F5A', bg: '#FFF1E4' },
  { icon: Eye, text: 'Visual + learning-behaviour signals estimate the learner state', color: '#3FA9F5', bg: '#E8F5FE' },
  { icon: RefreshCcw, text: 'Adaptive support is provided', color: '#16BFA6', bg: '#E4FAF5' },
  { icon: Sparkles, text: 'Future activities adapt to the learner', color: '#6C5CE7', bg: '#EFECFD' },
];

export default function Journey() {
  return (
    <div className="pb-8">
      <AppHeader title="My Learning Journey" />

      <div className="px-5 mt-2 mb-4">
        <p className="text-[13px] font-semibold text-ink-soft text-center">One connected ecosystem, working for you</p>
      </div>

      <div className="px-5 flex flex-col items-center">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="w-full"
          >
            <div className="w-full bg-white rounded-2xl p-4 card-shadow flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: step.bg }}>
                <step.icon size={20} color={step.color} strokeWidth={1.8} />
              </div>
              <p className="text-[13px] font-semibold text-ink leading-snug">{step.text}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown size={16} className="text-ink-faint" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
