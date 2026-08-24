import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Delete } from 'lucide-react';

const CORRECT_PIN = '1234';

export default function ParentPinModal({ open, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function press(digit) {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          onSuccess();
          setPin('');
        } else {
          setError(true);
          setTimeout(() => setPin(''), 400);
        }
      }, 150);
    }
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-ink/50 z-50 flex items-end justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-10"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg">Parent Area</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-deep flex items-center justify-center">
              <X size={16} />
            </button>
          </div>
          <p className="text-center text-[13px] font-semibold text-ink-soft mb-5">Enter the 4-digit parent PIN</p>
          <div className={`flex justify-center gap-3 mb-8 ${error ? 'animate-pulse' : ''}`}>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`w-4 h-4 rounded-full ${i < pin.length ? (error ? 'bg-coral' : 'bg-primary') : 'bg-cream-deep'}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => press(String(n))}
                className="h-16 rounded-2xl bg-cream-deep font-display font-bold text-xl active:scale-90 transition-transform"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              onClick={() => press('0')}
              className="h-16 rounded-2xl bg-cream-deep font-display font-bold text-xl active:scale-90 transition-transform"
            >
              0
            </button>
            <button
              onClick={() => setPin((p) => p.slice(0, -1))}
              className="h-16 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            >
              <Delete size={20} className="text-ink-soft" />
            </button>
          </div>
          <p className="text-center text-[11px] font-semibold text-ink-faint mt-5">Prototype PIN: 1234</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
