import { Database, Target, TrendingUp } from 'lucide-react';

import { useAdaptive } from '../../../context/AdaptiveLearningContext';
import ResearchCard, { ResearchRow } from '../ResearchCard';
import { formatPercent, formatSeconds } from './researchFormat';

import { hasReachedPhase } from '../../../services/adaptive-learning/phaseMachine';
import { describePolicyUpdate } from '../../../services/adaptive-learning/policyUpdater';
import { averageResponseTime } from '../../../services/adaptive-learning/eventLogger';
import { INDEPENDENT_QUESTIONS } from '../../../data/adaptive-learning/patternQuestions';

/**
 * The Independence Gain claim rests on the after-items being new problems rather
 * than the same ones again, so the panel states it outright.
 */
const PARALLEL_FORMS_NOTE =
  'Parallel forms, not repeats: the same clockwise-90° rule presented with symbols and ' +
  'starting orientations the learner has not seen in this combination before. No support ' +
  'component is mounted on this screen.';

export function IndependentCheckCard() {
  const { phase, independentCheck } = useAdaptive();
  const complete = independentCheck.questionsAnswered >= INDEPENDENT_QUESTIONS.length;

  return (
    <ResearchCard
      label="Independent Check"
      icon={Target}
      available={
        hasReachedPhase(phase, 'INDEPENDENT_CHECK') || independentCheck.questionsAnswered > 0
      }
      footnote={PARALLEL_FORMS_NOTE}
    >
      <ResearchRow label="Mode" value="UNSUPPORTED" valueClass="text-sky" />
      <ResearchRow label="Support" value="NONE" valueClass="text-sky" />
      <ResearchRow label="Item Form" value="Parallel forms" />
      <ResearchRow
        label="Items Answered"
        value={`${independentCheck.questionsAnswered} / ${INDEPENDENT_QUESTIONS.length}`}
      />
      <ResearchRow
        label="Unsupported After"
        value={complete ? (formatPercent(independentCheck.score) ?? '—') : 'Calculating…'}
        valueClass={complete ? 'text-teal' : 'text-white/50'}
      />
    </ResearchCard>
  );
}

export function IndependenceCard() {
  const { events, gameplay, independentCheck, independenceGain, derived } = useAdaptive();
  const view = derived.independenceGainView;

  const complete = independentCheck.questionsAnswered >= INDEPENDENT_QUESTIONS.length;
  const independentAvgMs = averageResponseTime(events.filter((e) => e.phase === 'independent'));
  const showTimeNote =
    complete && independentAvgMs > 0 && gameplay.avgResponseTimeOnErrorsMs > 0;

  return (
    <ResearchCard
      label="Independence"
      icon={TrendingUp}
      available={independenceGain != null}
      footnote="Both measurements are unsupported, and the after-items are parallel forms — same rule, new symbols and new starting orientations."
    >
      <ResearchRow
        label="Unsupported Before"
        value={view.beforePercent != null ? `${view.beforePercent}%` : '—'}
      />
      <ResearchRow
        label="Unsupported After"
        value={view.afterPercent != null ? `${view.afterPercent}%` : '—'}
        valueClass="text-teal"
      />
      <ResearchRow label="Independence Gain" value={view.gainLabel} valueClass="text-teal" />

      {showTimeNote && (
        <p className="text-[10.5px] font-semibold text-white/55 mt-3 pt-3 border-t border-white/10 leading-relaxed">
          Secondary observation: response time on unsupported items fell from{' '}
          {formatSeconds(gameplay.avgResponseTimeOnErrorsMs)} on errors during practice to{' '}
          {formatSeconds(independentAvgMs)} on the independent check.
        </p>
      )}
    </ResearchCard>
  );
}

export function PolicyUpdateCard() {
  const { selectedSupport, derived } = useAdaptive();
  const record = derived.latestPolicyRecord;

  return (
    <ResearchCard
      label="Policy Update"
      icon={Database}
      available={Boolean(record)}
      footnote="Local in-memory record only. Nothing is trained across sessions in this prototype."
    >
      <ResearchRow label="Skill" value={record?.skillId ?? '—'} />
      <ResearchRow label="Misunderstanding" value={record?.misconceptionId ?? '—'} />
      <ResearchRow label="Selected Support" value={selectedSupport?.label ?? '—'} />
      <ResearchRow
        label="Predicted IG"
        value={record ? `+${record.predictedIG.toFixed(2)}` : '—'}
      />
      <ResearchRow
        label="Observed IG"
        value={record ? `+${record.observedIG.toFixed(2)}` : '—'}
        valueClass="text-teal"
      />
      <ResearchRow label="Observation Count" value={record?.observationCount ?? '—'} />

      {record ? (
        <>
          <p className="font-display font-bold text-[11px] text-teal mt-3">
            EFFECTIVENESS ESTIMATE UPDATED ✓
          </p>
          <p className="text-[10.5px] font-semibold text-white/55 leading-relaxed mt-2">
            {describePolicyUpdate(record)}
          </p>

          {/* The stored object verbatim — a supervisor is reading for the record
              itself, not a paraphrase of it. */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
              Stored record
            </p>
            <pre className="text-[9.5px] leading-relaxed text-white/70 font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(record, null, 2)}
            </pre>
          </div>
        </>
      ) : null}
    </ResearchCard>
  );
}
