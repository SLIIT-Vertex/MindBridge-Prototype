import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Gamepad2, LifeBuoy } from 'lucide-react';
import { ONBOARDING_SLIDES } from '../data/mockData';

const ICONS = { learn: BookOpen, play: Gamepad2, support: LifeBuoy };

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = ONBOARDING_SLIDES[index];
  const Icon = ICONS[slide.illustration];
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  function next() {
    if (isLast) navigate('/language');
    else setIndex((i) => i + 1);
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-16 pb-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div
              className="w-44 h-44 rounded-[32px] flex items-center justify-center mb-8"
              style={{ background: `${slide.color}1A` }}
            >
              <Icon size={72} color={slide.color} strokeWidth={1.5} />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-ink mb-3 max-w-[280px]">{slide.title}</h2>
            <p className="text-[14px] font-medium text-ink-soft max-w-[300px] leading-relaxed">{slide.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {ONBOARDING_SLIDES.map((s, i) => (
          <span
            key={s.id}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-7 bg-primary' : 'w-2 bg-cream-deep'}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={`font-display font-bold text-[14px] text-ink-soft px-4 py-3 ${index === 0 ? 'opacity-0 pointer-events-none' : ''}`}
        >
          Back
        </button>
        <button
          onClick={next}
          className="flex-1 bg-primary text-white font-display font-bold text-[15px] rounded-full py-4 active:scale-95 transition-transform"
        >
          {isLast ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}
