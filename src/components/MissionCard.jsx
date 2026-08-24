import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function MissionCard({ title, subtitle, activityCount, xp, progress, total, onContinue }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 card-shadow-lg text-white relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #6C5CE7, #8377EE)' }}
    >
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white/10" />
      <div className="relative">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles size={14} />
          <span className="text-[11.5px] font-bold uppercase tracking-wide opacity-90">{subtitle || "Today's Mission"}</span>
        </div>
        <h3 className="font-display font-extrabold text-xl mb-1">{title}</h3>
        <p className="text-[13px] font-medium opacity-90 mb-4">{activityCount} activities · +{xp} XP</p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 bg-white/25 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${(progress / total) * 100}%` }} />
          </div>
          <span className="text-[11px] font-bold">{progress}/{total}</span>
        </div>

        <button
          onClick={onContinue}
          className="bg-white text-primary-dark font-display font-bold text-[13.5px] rounded-full px-5 py-2.5 flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          Continue Mission
          <ArrowRight size={15} strokeWidth={2.6} />
        </button>
      </div>
    </motion.div>
  );
}
