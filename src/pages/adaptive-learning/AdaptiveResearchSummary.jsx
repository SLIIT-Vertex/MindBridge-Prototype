import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

import ResearchFlowSummary from '../../components/adaptive-learning/ResearchFlowSummary';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Research summary — the screen the supervisor reads. The eleven-step chain scrolls
 * inside a 430px frame, so the headline before/after result is pinned at the top
 * and visible before anyone scrolls.
 */

export default function AdaptiveResearchSummary() {
  const navigate = useNavigate();
  const { phase, goToPhase, jumpToPhase, resetSession, derived } = useAdaptive();

  const view = derived.independenceGainView;

  useEffect(() => {
    if (hasReachedPhase(phase, 'SUMMARY')) return;
    if (hasReachedPhase(phase, 'REWARD')) goToPhase('SUMMARY');
    else jumpToPhase('SUMMARY');
  }, [phase, goToPhase, jumpToPhase]);

  const replay = () => {
    resetSession();
    navigate('/learn');
  };

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pb-28">
      {/* Pinned so the headline result survives any amount of scrolling. */}
      <div className="sticky top-0 z-20 bg-cream/95 backdrop-blur px-5 pt-6 pb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
            aria-label="Close the research summary"
          >
            <X size={17} className="text-ink" aria-hidden="true" />
          </button>
          <p className="font-display font-bold text-[13.5px] text-ink">Research Summary</p>
          <div className="w-11 flex-shrink-0" />
        </div>

        <div className="rounded-2xl bg-ink text-white px-4 py-3">
          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/50">
            Unsupported performance
          </p>
          <div className="flex items-center gap-2.5 mt-1">
            <span className="font-display font-extrabold text-2xl text-white/55">
              {view.beforePercent != null ? `${view.beforePercent}%` : '—'}
            </span>
            <ArrowRight size={18} className="text-white/40" aria-hidden="true" />
            <span className="font-display font-extrabold text-2xl text-teal">
              {view.afterPercent != null ? `${view.afterPercent}%` : '—'}
            </span>
            <span className="ml-auto font-display font-extrabold text-xl text-teal">
              {view.available ? view.gainLabel : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 pt-2">
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mb-4">
          One learner, one skill, one full adaptive loop — from an unsupported baseline through to
          the support-effectiveness estimate being revised.
        </p>

        <ResearchFlowSummary />

        <div className="flex flex-col gap-3 mt-7">
          <button
            type="button"
            onClick={replay}
            className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
          >
            Replay Demo
          </button>
          <button
            type="button"
            onClick={() => navigate('/learn')}
            className="w-full min-h-12 bg-white text-ink font-display font-bold text-[14px] rounded-full card-shadow active:scale-95 transition-transform"
          >
            Return to Curriculum
          </button>
        </div>

        <p className="text-[10.5px] font-semibold text-ink-faint leading-relaxed mt-5 text-center">
          Prototype simulation. Every probability, prediction and confidence value on this screen is
          illustrative and has not been empirically validated.
        </p>
      </div>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}
