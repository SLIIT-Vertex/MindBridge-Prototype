import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import PrototypeStepLabel from './PrototypeStepLabel';

/**
 * Floating pill that opens the Research View drawer.
 *
 * `placement` accounts for the two layouts:
 *   'nav'   — pages inside MainLayout, which has an 80px bottom nav to clear
 *   'plain' — immersive PlainLayout pages, where the pill can sit lower
 *
 * Positioned with `left-1/2 -translate-x-1/2` against a max-width track rather
 * than `right-4`, because the app is a centred 430px frame on desktop; anchoring
 * to the viewport right edge would park the pill far away from the phone.
 */

const PLACEMENT = {
  nav: 'bottom-24',
  plain: 'bottom-6',
};

export default function ResearchViewToggle({ placement = 'nav' }) {
  const { researchViewEnabled, toggleResearchView } = useAdaptive();

  if (researchViewEnabled) return null;

  return (
    <div
      className={`fixed ${PLACEMENT[placement] ?? PLACEMENT.nav} left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none flex items-end justify-between gap-2 px-4`}
    >
      <PrototypeStepLabel />
      <motion.button
        type="button"
        onClick={() => toggleResearchView(true)}
        whileTap={{ scale: 0.94 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="pointer-events-auto min-h-11 pl-3.5 pr-4 rounded-full bg-ink text-white flex items-center gap-2 card-shadow-lg flex-shrink-0"
        aria-label="Open research view"
      >
        <FlaskConical size={15} className="text-coin" aria-hidden="true" />
        <span className="font-display font-bold text-[12px]">Research View</span>
      </motion.button>
    </div>
  );
}
