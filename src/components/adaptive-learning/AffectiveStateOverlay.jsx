import { PauseCircle } from 'lucide-react';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { useApp } from '../../context/AppContext';
import { LEARNER_STATES } from '../../data/learnerStateMockData';
import StateSupportCard from '../StateSupportCard';
import BreakSupportContent from '../BreakSupportContent';

/**
 * Presenter overlay for Possible Frustration / Low-Alertness. Mounted from
 * ResearchPanel so it appears on every Learn screen after a Research View tap.
 */

export default function AffectiveStateOverlay() {
  const { setLearnerState } = useApp();
  const {
    affectiveDemo,
    dismissAffectiveSupport,
    openAffectiveBreak,
    closeAffectiveBreak,
  } = useAdaptive();

  const content = affectiveDemo?.state ? LEARNER_STATES[affectiveDemo.state] : null;

  const finish = () => {
    setLearnerState('engaged');
    closeAffectiveBreak();
  };

  const handleAction = (id) => {
    if (id === 'pause' || id === 'break' || id === 'water') {
      openAffectiveBreak();
      return;
    }
    setLearnerState('engaged');
    dismissAffectiveSupport();
  };

  if (affectiveDemo?.showBreak) {
    return (
      <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[60] bg-cream overflow-y-auto">
        <div className="px-5 pt-6 flex items-center gap-2 text-ink-soft">
          <PauseCircle size={17} className="text-primary" aria-hidden="true" />
          <p className="font-display font-bold text-[13px]">Quick Learning Break</p>
        </div>
        <BreakSupportContent onContinue={finish} />
      </div>
    );
  }

  if (!affectiveDemo?.showCard || !content) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[45] px-4 pointer-events-none bottom-28">
      <div className="pointer-events-auto">
        <StateSupportCard content={content} onAction={handleAction} />
      </div>
    </div>
  );
}
