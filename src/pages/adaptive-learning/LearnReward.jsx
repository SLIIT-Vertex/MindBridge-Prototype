import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Coins, Sparkles } from 'lucide-react';

import AchievementBadge from '../../components/AchievementBadge';
import RewardChip from '../../components/RewardChip';
import RewardModal from '../../components/adaptive-learning/RewardModal';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useApp } from '../../context/AppContext';
import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Reward screen. XP and coins go through AppContext, so the totals visibly change
 * on the Home tab rather than being a local animation.
 *
 * Claims IMPROVEMENT, never mastery: one session of three items is not evidence a
 * skill has been mastered.
 */

const XP_REWARD = 100;
const COIN_REWARD = 30;

export default function LearnReward() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { addXp, addCoins } = useApp();
  const { phase, goToPhase, jumpToPhase, derived } = useAdaptive();

  // Refs, not state: StrictMode double-invokes mount effects before any state
  // update lands, so a state guard would pay the reward twice.
  const paid = useRef(false);

  useEffect(() => {
    if (paid.current) return;
    paid.current = true;
    addXp(XP_REWARD);
    addCoins(COIN_REWARD);
  }, [addXp, addCoins]);

  useEffect(() => {
    if (hasReachedPhase(phase, 'REWARD')) return;
    if (hasReachedPhase(phase, 'POLICY_UPDATED')) goToPhase('REWARD');
    else jumpToPhase('REWARD');
  }, [phase, goToPhase, jumpToPhase]);

  const view = derived.independenceGainView;
  const beforeLabel = view.beforePercent != null ? `${view.beforePercent}%` : '—';
  const afterLabel = view.afterPercent != null ? `${view.afterPercent}%` : '—';

  const entry = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { delay },
  });

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-8 px-5 pb-28">
      <RewardModal
        title="Pattern Temple Gate Unlocked!"
        subtitle="You found the rule, practised it, and then solved new puzzles on your own."
      />

      <motion.div {...entry(0.1)} className="flex items-center justify-center gap-2 mt-5">
        <RewardChip icon={Sparkles} value={`+${XP_REWARD} XP`} tone="primary" />
        <RewardChip icon={Coins} value={`+${COIN_REWARD} Coins`} tone="coin" />
      </motion.div>

      <motion.div {...entry(0.18)} className="grid grid-cols-2 gap-3 mt-5">
        <AchievementBadge label="Rotation Explorer" icon="brain" earned />
        <AchievementBadge
          label="Pattern Explorer"
          icon="star"
          earned={false}
          hint="Keep solving pattern missions"
        />
      </motion.div>

      <motion.section
        {...entry(0.26)}
        className="bg-white rounded-2xl card-shadow px-4 py-4 mt-5"
        aria-label="Progress on Pattern and Sequence Reasoning"
      >
        <p className="font-display font-bold text-[13.5px] text-ink">
          Pattern &amp; Sequence Reasoning
        </p>

        <div className="flex items-baseline justify-between gap-3 mt-3">
          <span className="text-[12px] font-semibold text-ink-soft">Independent Baseline</span>
          <span className="font-display font-bold text-[13px] text-ink-faint">{beforeLabel}</span>
        </div>
        <div className="flex items-baseline justify-between gap-3 mt-1.5">
          <span className="text-[12px] font-semibold text-ink-soft">Current Independence</span>
          <span className="font-display font-bold text-[13px] text-teal">{afterLabel}</span>
        </div>

        <div className="mt-3.5 pt-3.5 border-t border-cream-deep">
          <p className="font-display font-bold text-[13px] text-teal">
            Independent Performance Improved
          </p>
          <p className="text-[11px] font-semibold text-ink-soft leading-relaxed mt-1">
            Measured from one short session, so this shows progress rather than mastery.
          </p>
        </div>
      </motion.section>

      <motion.button
        {...entry(0.34)}
        type="button"
        onClick={() => {
          goToPhase('SUMMARY');
          navigate('/learn/research-summary');
        }}
        className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-6"
      >
        See the research summary
      </motion.button>

      <motion.button
        {...entry(0.4)}
        type="button"
        onClick={() => navigate('/learn')}
        className="w-full min-h-12 bg-white text-ink font-display font-bold text-[14px] rounded-full card-shadow active:scale-95 transition-transform mt-3"
      >
        Back to Learn
      </motion.button>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}
