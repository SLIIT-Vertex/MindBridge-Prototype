import { FlaskConical, GitBranch, Target } from 'lucide-react';

import { useAdaptive } from '../../../context/AdaptiveLearningContext';
import ResearchCard, { ResearchChip, ResearchRow } from '../ResearchCard';
import MisconceptionBeliefBars from '../MisconceptionBeliefBars';
import SupportComparison from '../SupportComparison';

import { MODEL_LABEL } from '../../../data/adaptive-learning/misconceptions';
import {
  SELECTOR_LABEL,
  SELECTOR_TECHNICAL_LABEL,
  SELECTOR_HEADING,
  SUPPORTED_RESULT_CAVEAT,
} from '../../../data/adaptive-learning/learningSupports';

export function MisunderstandingCard() {
  const { difficulty, gameplay, derived } = useAdaptive();

  return (
    <ResearchCard
      label="Likely Misunderstanding"
      icon={Target}
      available={difficulty.detected || gameplay.relatedErrors > 0}
      footnote={`${MODEL_LABEL} · Prototype simulation — probabilities are illustrative and not empirically calibrated.`}
    >
      <MisconceptionBeliefBars rows={derived.beliefRows} />
    </ResearchCard>
  );
}

export function SupportDecisionCard() {
  const { learner, selectedSupport, derived } = useAdaptive();
  const beliefLabel = derived.topBelief.label
    .replace('-Confusion', '')
    .replace('-Weakness', '');

  return (
    <ResearchCard
      label="Support Decision"
      icon={GitBranch}
      available={Boolean(selectedSupport)}
      footnote={`${SELECTOR_LABEL} ${SELECTOR_TECHNICAL_LABEL} · Prototype simulation — predicted values are not empirically trained.`}
    >
      <p className="text-[10.5px] font-bold uppercase tracking-wide text-white/70 leading-snug mb-3">
        {SELECTOR_HEADING}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3.5">
        <ResearchChip label="Learner" value={learner.name} />
        <ResearchChip label="Skill" value="Pattern Sequence" />
        <ResearchChip
          label="Likely Difficulty"
          value={`${beliefLabel} ${Math.round(derived.topBelief.probability * 100)}%`}
        />
      </div>

      <SupportComparison supports={derived.rankedSupports} selectedId={selectedSupport?.id} />
    </ResearchCard>
  );
}

export function SupportStatusCard() {
  const { selectedSupport, supportStatus, supportedPractice } = useAdaptive();
  const practised = supportedPractice.questionsAnswered > 0;

  return (
    <ResearchCard label="Support Status" icon={FlaskConical} available={supportStatus !== 'none'}>
      {practised ? (
        <>
          <p className="font-display font-bold text-[12px] text-coin mb-2.5">
            SUPPORTED PERFORMANCE
          </p>
          <ResearchRow
            label="Result"
            value={supportedPractice.correct > 0 ? 'Correct' : 'Incorrect'}
            valueClass={supportedPractice.correct > 0 ? 'text-teal' : 'text-white'}
          />
          <ResearchRow label="Support" value={selectedSupport?.label ?? '—'} />
        </>
      ) : (
        <ResearchRow label="Support" value={selectedSupport?.label ?? '—'} />
      )}

      <div className="flex items-center gap-2 mt-3">
        <span
          className={`text-[10.5px] font-display font-bold px-2.5 py-1 rounded-full ${
            supportStatus === 'active' ? 'bg-primary text-white' : 'bg-white/10 text-white/45'
          }`}
        >
          ACTIVE
        </span>
        <span className="text-white/35 text-[12px]" aria-hidden="true">
          ↓
        </span>
        <span
          className={`text-[10.5px] font-display font-bold px-2.5 py-1 rounded-full ${
            supportStatus === 'removed' ? 'bg-teal text-white' : 'bg-white/10 text-white/45'
          }`}
        >
          REMOVED
        </span>
      </div>

      {supportStatus === 'removed' ? (
        <ResearchRow label="Next Phase" value="Independent Check" valueClass="text-sky" />
      ) : null}

      {practised && supportStatus === 'active' ? (
        <p className="mt-3.5 rounded-xl bg-orange/15 border border-orange/35 px-3 py-2.5 text-[11.5px] font-semibold text-orange leading-relaxed">
          {SUPPORTED_RESULT_CAVEAT}
        </p>
      ) : null}
    </ResearchCard>
  );
}
