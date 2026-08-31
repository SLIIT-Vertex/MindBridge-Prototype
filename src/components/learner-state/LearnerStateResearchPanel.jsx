import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FlaskConical, X } from 'lucide-react';

import { useLearnerState } from '../../context/LearnerStateContext';
import { DEMO_BANNER } from '../../data/learner-state/demoScenarios';
import LearnerStateDemoControls from './LearnerStateDemoControls';
import {
  CameraModeCard,
  CurrentStateCard,
  FusionWeightCard,
  SignalReliabilityCard,
  TemporalWindowCard,
} from './research/StateCards';
import {
  BaselineDeviationCard,
  DecisionCard,
  InterventionHistoryCard,
  PersistenceCard,
  TutorHandoffCard,
} from './research/DecisionCards';

/**
 * Research view for the learner-state pipeline.
 *
 * Same bottom-sheet pattern as the Adaptive Learning research drawer, so the two
 * components present their internals identically to a supervisor. Cards are
 * ordered to follow the pipeline top to bottom: state, reliability, weights,
 * window, baseline, persistence, decision, handoff, history.
 *
 * POSITIONING: every fixed layer uses `left-1/2 -translate-x-1/2 w-full
 * max-w-[430px]` with explicit top/bottom rather than `inset-0`, because the app
 * renders inside a centred phone frame and `inset-0` would stretch the drawer
 * across the whole desktop viewport.
 *
 * Cards gate on whether their DATA exists, not on session progress, so a panel
 * opened before the first window closes shows the shape of the mechanism with
 * every stage honestly marked "Not yet observed".
 */
export default function LearnerStateResearchPanel() {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef(null);
  const { researchViewEnabled, toggleResearchView, scenarioId } = useLearnerState();

  useEffect(() => {
    if (!researchViewEnabled) return undefined;

    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') toggleResearchView(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [researchViewEnabled, toggleResearchView]);

  const spring = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 34 };

  return (
    <AnimatePresence>
      {researchViewEnabled && (
        <>
          <motion.div
            className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleResearchView(false)}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Learner state research view"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-ink text-white rounded-t-[28px] max-h-[78dvh] overflow-y-auto outline-none"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={spring}
          >
            <div className="sticky top-0 z-10 bg-ink px-4 pt-3 pb-3 rounded-t-[28px]">
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-3" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FlaskConical size={15} className="text-coin flex-shrink-0" aria-hidden="true" />
                  <h2 className="font-display font-bold text-[13.5px] text-white truncate">
                    Learner State Research View
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleResearchView(false)}
                  className="w-11 h-11 -mr-1 rounded-full flex items-center justify-center bg-white/10 active:scale-95 transition-transform flex-shrink-0"
                  aria-label="Close research view"
                >
                  <X size={16} className="text-white" aria-hidden="true" />
                </button>
              </div>

              {scenarioId && (
                <div className="mt-3 rounded-xl bg-coin/15 border border-coin/30 px-3 py-2 flex items-center gap-2">
                  <FlaskConical size={12} className="text-coin flex-shrink-0" aria-hidden="true" />
                  <p className="text-[10.5px] font-bold uppercase tracking-wide text-coin">
                    {DEMO_BANNER}
                  </p>
                </div>
              )}
            </div>

            <div
              className="px-4 pb-8 flex flex-col gap-3"
              style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}
            >
              <CurrentStateCard />
              <SignalReliabilityCard />
              <FusionWeightCard />
              <TemporalWindowCard />
              <BaselineDeviationCard />
              <PersistenceCard />
              <DecisionCard />
              <TutorHandoffCard />
              <CameraModeCard />
              <InterventionHistoryCard />

              {/* Presenter controls last, so they never sit above the research content. */}
              <LearnerStateDemoControls />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
