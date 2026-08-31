import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';

import { useLearnerState } from '../../context/LearnerStateContext';

/**
 * Entry point to the research drawer, on a learning screen.
 *
 * TWO RULES, both about the child:
 *   1. It renders ONLY in presenter mode, which a child cannot reach — it is set
 *      from Demo Controls behind the parent PIN. A child who starts a session
 *      from Home has no research affordance on screen at all.
 *   2. Even in presenter mode it carries no words. The old version printed
 *      "W3 · 00:40–01:00 · Intervention-worthy confusion" along the bottom of the
 *      child's screen, which is exactly the labelling this component argues
 *      against.
 *
 * Positioned with `left-1/2 -translate-x-1/2` against a max-width track rather
 * than `right-4`, because the app is a centred 430px frame on desktop, and lifted
 * clear of the iOS home indicator with a safe-area inset.
 */

const PLACEMENT = { nav: 'pb-24', plain: 'pb-4' };

export default function LearnerStateResearchToggle({ placement = 'plain' }) {
  const { researchViewEnabled, toggleResearchView, presenterMode } = useLearnerState();

  if (!presenterMode || researchViewEnabled) return null;

  return (
    <div
      className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 pointer-events-none flex justify-end px-4 ${PLACEMENT[placement] ?? PLACEMENT.plain}`}
      style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + ${placement === 'nav' ? '6rem' : '1rem'})` }}
    >
      <motion.button
        type="button"
        onClick={() => toggleResearchView(true)}
        whileTap={{ scale: 0.92 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="pointer-events-auto w-11 h-11 rounded-full bg-ink/85 backdrop-blur flex items-center justify-center card-shadow-lg"
        aria-label="Open research view"
        title="Research view"
      >
        <FlaskConical size={17} className="text-coin" aria-hidden="true" />
      </motion.button>
    </div>
  );
}
