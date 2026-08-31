import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Database, TrendingUp, X } from 'lucide-react';

import IndependenceGainChart from '../../components/adaptive-learning/IndependenceGainChart';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { describeIndependenceGain } from '../../services/adaptive-learning/independenceGain';
import {
  describePolicyUpdate,
  POLICY_UPDATED_LABEL,
} from '../../services/adaptive-learning/policyUpdater';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Independence Gain + policy update. Compares the two unsupported measurements and
 * feeds the observation back into the support-effectiveness record, closing the
 * research loop.
 *
 * Arriving without a baseline (direct URL or presenter jump) must not crash: every
 * block degrades to a "not yet observed" state.
 */

export default function IndependenceResult() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const {
    phase,
    goToPhase,
    jumpToPhase,
    recordIndependence,
    updatePolicy,
    independenceGain,
    selectedSupport,
    supportEffectivenessHistory,
    derived,
  } = useAdaptive();

  const view = derived.independenceGainView;
  const record = derived.latestPolicyRecord;

  // A ref, not state: StrictMode runs mount effects twice before state settles, so
  // a state-derived guard would let UPDATE_POLICY through twice.
  const policyWritten = useRef(false);

  useEffect(() => {
    if (hasReachedPhase(phase, 'RESULT')) return;
    if (hasReachedPhase(phase, 'INDEPENDENT_CHECK')) goToPhase('RESULT');
    else jumpToPhase('RESULT');
  }, [phase, goToPhase, jumpToPhase]);

  // Both unsupported scores must exist first — the reducer refuses otherwise.
  useEffect(() => {
    if (independenceGain != null) return;
    if (derived.unsupportedBefore == null || derived.unsupportedAfter == null) return;
    recordIndependence();
  }, [independenceGain, derived.unsupportedBefore, derived.unsupportedAfter, recordIndependence]);

  useEffect(() => {
    if (independenceGain == null || policyWritten.current) return;
    if (supportEffectivenessHistory.length > 0) {
      policyWritten.current = true;
      return;
    }
    policyWritten.current = true;
    updatePolicy();
  }, [independenceGain, supportEffectivenessHistory.length, updatePolicy]);

  useEffect(() => {
    if (record && phase === 'RESULT') goToPhase('POLICY_UPDATED');
  }, [record, phase, goToPhase]);

  const entry = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { delay },
  });

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-6 px-5 pb-28">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate('/learn/pattern-sequence')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          aria-label="Leave the Pattern Temple"
        >
          <X size={17} className="text-ink" aria-hidden="true" />
        </button>
        <p className="font-display font-bold text-[13.5px] text-ink">Independence Check</p>
        <div className="w-11 flex-shrink-0" />
      </div>

      <motion.div {...entry(0)} className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-light px-3 py-1.5">
          <TrendingUp size={13} className="text-teal" aria-hidden="true" />
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-teal">
            Unsupported before vs after
          </span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink leading-tight mt-3">
          {view.available && view.improved
            ? 'You solved these on your own!'
            : 'Independent performance'}
        </h1>
      </motion.div>

      <motion.div {...entry(0.08)}>
        <IndependenceGainChart view={view} />
      </motion.div>

      <motion.p
        {...entry(0.16)}
        className="text-[12.5px] font-semibold text-ink-soft leading-relaxed text-center mt-4 px-1"
      >
        {describeIndependenceGain(independenceGain)}
      </motion.p>

      {/*
        Research surface, deliberately on the dark ink palette so it reads as an
        instrumentation panel rather than as feedback addressed to the child.
      */}
      <motion.section
        {...entry(0.24)}
        className="rounded-2xl bg-ink text-white px-4 py-4 mt-6"
        aria-label="Support effectiveness update"
      >
        <div className="flex items-center gap-2 mb-3">
          <Database size={13} className="text-coin" aria-hidden="true" />
          <h2 className="font-display font-bold text-[10.5px] uppercase tracking-wide text-white">
            Support Effectiveness Update
          </h2>
        </div>

        {record ? (
          <>
            <Row label="Learner" value={record.learnerId} />
            <Row label="Skill" value={record.skillId} />
            <Row label="Likely Misunderstanding" value={record.misconceptionId} />
            <Row label="Selected Support" value={selectedSupport?.label ?? record.supportType} />
            <Row label="Predicted IG" value={`+${record.predictedIG.toFixed(2)}`} />
            <Row
              label="Observed IG"
              value={`+${record.observedIG.toFixed(2)}`}
              valueClass="text-teal"
            />
            <Row label="Observation Count" value={record.observationCount} />

            <p className="font-display font-bold text-[11.5px] text-teal mt-3">
              {POLICY_UPDATED_LABEL} ✓
            </p>
            <p className="text-[11px] font-semibold text-white/55 leading-relaxed mt-2.5">
              {describePolicyUpdate(record)}
            </p>
            <p className="text-[10px] font-semibold text-white/40 leading-relaxed mt-3">
              Local in-memory record only. Nothing is trained across sessions in this prototype.
            </p>
          </>
        ) : (
          <p className="text-[11.5px] font-semibold text-white/40">
            Not yet observed. The effectiveness record is written once Independence Gain exists.
          </p>
        )}
      </motion.section>

      <motion.button
        {...entry(0.32)}
        type="button"
        onClick={() => navigate('/learn/reward')}
        className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-6"
      >
        Collect your reward
      </motion.button>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}

function Row({ label, value, valueClass = 'text-white' }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-[3px]">
      <span className="text-[11.5px] font-semibold text-white/55">{label}</span>
      <span className={`text-[11.5px] font-display font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
