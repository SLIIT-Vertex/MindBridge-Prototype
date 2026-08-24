import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Mascot from '../components/Mascot';
import { useApp } from '../context/AppContext';

export default function Splash() {
  const navigate = useNavigate();
  const { onboardingDone } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(onboardingDone ? '/home' : '/onboarding', { replace: true });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate, onboardingDone]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-primary relative overflow-hidden">
      <div className="absolute w-72 h-72 rounded-full bg-white/10 -top-20 -left-16" />
      <div className="absolute w-56 h-56 rounded-full bg-white/10 -bottom-16 -right-10" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14 }}
      >
        <Mascot size={140} mood="excited" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="font-display font-extrabold text-3xl text-white mt-6 tracking-wide"
      >
        MindBridge
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/85 font-display font-semibold text-[14px] mt-2 tracking-[0.2em] uppercase"
      >
        Learn &bull; Play &bull; Grow
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-14 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-white/70"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
