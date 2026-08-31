import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../../components/AppHeader';
import ProgressBar from '../../components/ProgressBar';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';
import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { GAME_WORLD, getSkill } from '../../data/adaptive-learning/curriculum';

/**
 * Skill overview — Screen 3. The Pattern Temple mission is the only playable
 * entry into the research loop. Start Mission routes to the Independent
 * Baseline (Phase 4).
 */
export default function PatternSequenceOverview() {
  const navigate = useNavigate();
  const { goToPhase } = useAdaptive();
  const skill = getSkill('GI-PS-01');

  useEffect(() => {
    goToPhase('SKILL_OVERVIEW');
  }, [goToPhase]);

  return (
    <div className="min-h-full w-[min(100vw,430px)] pb-28">
      <AppHeader
        title="Pattern Sequence"
        onBack={() => navigate('/learn/general-intelligence')}
      />

      <div className="px-5 mt-2">
        <h1 className="font-display font-extrabold text-2xl text-ink leading-tight">
          {skill?.name ?? 'Pattern & Sequence Reasoning'}
        </h1>
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint mt-2">
          Learning goal
        </p>
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-1 mb-4">
          {skill?.learningGoal ??
            'Find the hidden rule in a sequence and use it to solve the next pattern.'}
        </p>

        <ProgressBar pct={0} color="#6C5CE7" height={8} />
        <p className="text-[11px] font-semibold text-ink-soft mt-1.5 mb-5">Not started</p>

        <article className="bg-white rounded-2xl card-shadow overflow-hidden">
          <img
            src={GAME_WORLD.illustration}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="w-full h-auto block"
          />
          <div className="p-4">
            <p className="text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
              Mission
            </p>
            <h2 className="font-display font-bold text-[15px] text-ink mt-1">{GAME_WORLD.name}</h2>
            <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-1 mb-4">
              {GAME_WORLD.tagline}
            </p>
            <button
              type="button"
              onClick={() => navigate('/learn/baseline')}
              className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
            >
              Start Mission
            </button>
          </div>
        </article>
      </div>

      <ResearchViewToggle placement="nav" />
      <ResearchPanel />
    </div>
  );
}
