import { motion, AnimatePresence } from 'framer-motion';
import { Check, Coins, X } from 'lucide-react';
import { DAILY_REWARDS } from '../data/mockData';

export default function DailyRewardModal({ open, onClose, onClaim }) {
  if (!open) return null;
  const today = DAILY_REWARDS.find((d) => d.today);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[350px] bg-white rounded-3xl p-6 relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center">
            <X size={15} />
          </button>
          <h3 className="font-display font-extrabold text-lg text-ink text-center mb-1">Daily Rewards</h3>
          <p className="text-[12px] font-semibold text-ink-soft text-center mb-5">Come back every day for bonus coins!</p>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {DAILY_REWARDS.map((d) => (
              <div
                key={d.day}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                  d.today ? 'bg-primary' : d.done ? 'bg-success-light' : 'bg-cream-deep'
                }`}
              >
                {d.done ? (
                  <Check size={16} className="text-success" strokeWidth={3} />
                ) : (
                  <Coins size={16} className={d.today ? 'text-white' : 'text-ink-faint'} />
                )}
                <span className={`text-[9px] font-display font-bold ${d.today ? 'text-white' : d.done ? 'text-success' : 'text-ink-faint'}`}>
                  Day {d.day}
                </span>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex flex-col items-center mb-5"
          >
            <div className="w-16 h-16 rounded-full bg-coin-light flex items-center justify-center mb-2">
              <Coins size={30} className="text-coin" />
            </div>
            <p className="font-display font-extrabold text-lg text-ink">+{today?.reward ?? 100} coins</p>
          </motion.div>

          <button
            onClick={onClaim}
            className="w-full bg-primary text-white font-display font-bold text-[14px] rounded-full py-3.5 active:scale-95 transition-transform"
          >
            Claim Reward
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
