import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CurriculumCard from '../../components/adaptive-learning/CurriculumCard';
import HeroHeader from '../../components/adaptive-learning/HeroHeader';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';
import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { CURRICULUM_AREAS } from '../../data/adaptive-learning/curriculum';

/**
 * Learn tab home — Screen 1 of the Adaptive Gamified Learning component.
 *
 * Curriculum-aligned rather than a generic list of games.
 */
export default function AdaptiveLearningHome() {
  const navigate = useNavigate();
  const { goToPhase } = useAdaptive();
  const [toast, setToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    goToPhase('HOME');
  }, [goToPhase]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const handleSelect = useCallback(
    (area) => {
      if (area.status === 'playable') {
        navigate('/learn/general-intelligence');
        return;
      }
      setToast(true);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(false), 2200);
    },
    [navigate],
  );

  return (
    <div className="min-h-full w-[min(100vw,430px)] pt-7 px-5 pb-28">
      <HeroHeader />

      <div className="flex flex-col gap-4 mt-3">
        {CURRICULUM_AREAS.map((area, index) => (
          <CurriculumCard key={area.id} area={area} index={index} onSelect={handleSelect} />
        ))}
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            key="full-system-toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            role="status"
            className="fixed bottom-40 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 px-6 flex justify-center pointer-events-none"
          >
            <span className="bg-ink text-white font-display font-bold text-[12.5px] rounded-full px-4 py-2.5 card-shadow-lg">
              Available in the full system.
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ResearchViewToggle placement="nav" />
      <ResearchPanel />
    </div>
  );
}
