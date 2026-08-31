import { History, LifeBuoy, Send, TrendingUp, UserCheck } from 'lucide-react';

import ResearchCard, { ResearchRow } from '../../ResearchCard';
import { useLearnerState } from '../../../context/LearnerStateContext';
import {
  CLASSIFICATION_LABELS,
  SUPPORT_NEED_LABELS,
  SUPPORT_TYPE_LABELS,
} from '../../../data/learner-state/supportCopy';
import { ATYPICAL_SIGMA } from '../../../services/learner-state/learnerBaselineService';
import {
  PERSISTENCE_TREND,
  PERSISTENCE_TREND_LABELS,
} from '../../../services/learner-state/persistenceAnalyzer';
import { DECISION_CAVEAT } from '../../../services/learner-state/adaptiveDecision';
import { pct, prob, sigma } from './format';

/**
 * Deviation from the learner's OWN baseline, which is the stage that makes the
 * same reading mean different things for different children.
 */
export function BaselineDeviationCard() {
  const { derived } = useLearnerState();
  const deviation = derived.latestWindow?.baselineDeviation;
  const baseline = derived.baseline;

  return (
    <ResearchCard
      label="Learner Baseline Deviation"
      icon={UserCheck}
      available={Boolean(deviation)}
      footnote={`Baseline from ${baseline.sessionsObserved} of this learner's own sessions. Atypical at ${ATYPICAL_SIGMA}σ.`}
    >
      <ResearchRow label="Learner" value={baseline.learnerName} valueClass="text-coin" />
      <ResearchRow label="Summary" value={deviation?.summary ?? '—'} />

      <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5">
        {(deviation?.fields ?? []).map((field) => (
          <div key={field.key} className="flex items-baseline justify-between gap-3">
            <span
              className={`text-[10.5px] font-semibold ${field.observed ? 'text-white/60' : 'text-white/25'}`}
            >
              {field.label}
            </span>
            <span className="flex items-baseline gap-2 flex-shrink-0">
              <span className="text-[10px] font-semibold text-white/35">
                {field.observed ? `${field.current} vs ${field.typical}` : 'not observed'}
              </span>
              <span
                className={`text-[10.5px] font-display font-bold w-14 text-right ${
                  !field.observed
                    ? 'text-white/25'
                    : field.atypical
                      ? 'text-orange'
                      : 'text-white/70'
                }`}
              >
                {field.observed ? sigma(field.z) : '—'}
              </span>
            </span>
          </div>
        ))}
      </div>
    </ResearchCard>
  );
}

/** Is the learner still trying, and is that effort holding up? */
export function PersistenceCard() {
  const { derived } = useLearnerState();
  const persistence = derived.persistence;
  const trend = persistence?.trend ?? PERSISTENCE_TREND.UNKNOWN;

  const trendColor =
    trend === PERSISTENCE_TREND.FALLING
      ? 'text-orange'
      : trend === PERSISTENCE_TREND.RISING
        ? 'text-success'
        : 'text-white';

  return (
    <ResearchCard
      label="Persistence"
      icon={TrendingUp}
      available={Boolean(persistence)}
      footnote="Confusion with persistence holding is productive. Confusion with persistence draining is not."
    >
      <ResearchRow label="Trend" value={PERSISTENCE_TREND_LABELS[trend]} valueClass={trendColor} />
      <ResearchRow label="Current" value={prob(persistence?.current)} />
      <ResearchRow label="Recent average" value={prob(persistence?.average)} />
      <ResearchRow
        label="Windows observed"
        value={`${persistence?.windowsObserved ?? 0} / ${persistence?.windowsRequired ?? 3}`}
      />

      {persistence?.series?.length > 1 ? (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Trajectory
          </p>
          <div className="flex items-end gap-1.5 h-10" aria-hidden="true">
            {persistence.series.map((value, index) => (
              <div
                key={index}
                className="flex-1 rounded-sm"
                style={{
                  height: `${Math.max(6, value * 100)}%`,
                  background: index === persistence.series.length - 1 ? '#FFC542' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </ResearchCard>
  );
}

/** What was decided, and the evidence trail that produced it. */
export function DecisionCard() {
  const { decision } = useLearnerState();

  return (
    <ResearchCard
      label="Decision"
      icon={LifeBuoy}
      available={Boolean(decision)}
      footnote={DECISION_CAVEAT}
    >
      <ResearchRow
        label="Classification"
        value={CLASSIFICATION_LABELS[decision?.classification] ?? '—'}
        valueClass="text-coin"
      />
      <ResearchRow label="Support need" value={SUPPORT_NEED_LABELS[decision?.supportNeed] ?? '—'} />
      <ResearchRow
        label="Action"
        value={SUPPORT_TYPE_LABELS[decision?.supportType] ?? '—'}
        valueClass="text-orange"
      />
      <ResearchRow label="Confidence" value={prob(decision?.confidence)} />
      <ResearchRow label="Confusion run" value={`${decision?.confusionRun ?? 0} windows`} />

      {decision?.rationale?.length ? (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Why
          </p>
          <ul className="flex flex-col gap-1.5">
            {decision.rationale.map((line) => (
              <li key={line} className="flex items-start gap-2">
                <span className="text-coin text-[10px] font-display font-bold mt-[1px] flex-shrink-0">
                  •
                </span>
                <span className="text-[10.5px] font-semibold text-white/75 leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </ResearchCard>
  );
}

/**
 * The outbound request. Shown in full so the boundary is visible: this component
 * sends context, the AI Tutor writes the explanation.
 */
export function TutorHandoffCard() {
  const { derived } = useLearnerState();
  const request = derived.latestRequest;

  return (
    <ResearchCard
      label="Support Request Sent"
      icon={Send}
      available={Boolean(request)}
      footnote="This component sends the request only. The AI Tutor generates the explanation, hint text and scaffold."
    >
      <ResearchRow label="Target" value={request?.target ?? 'AI Tutor'} valueClass="text-coin" />
      <ResearchRow label="Learner state" value={request?.learnerState ?? request?.action ?? '—'} />
      <ResearchRow label="Support need" value={request?.supportNeed ?? 'intervene'} />
      <ResearchRow label="Support type" value={request?.supportType ?? request?.action ?? '—'} />
      <ResearchRow label="Confidence" value={prob(request?.confidence)} />
      <ResearchRow label="Persistence trend" value={request?.persistenceTrend ?? '—'} />

      {request?.evidence ? (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Evidence attached
          </p>
          <ResearchRow label="Window" value={request.evidence.windowId ?? '—'} />
          <ResearchRow label="Visual weight" value={pct(request.evidence.visualWeight)} />
          <ResearchRow label="Behaviour weight" value={pct(request.evidence.behaviorWeight)} />
          <ResearchRow label="Baseline" value={request.evidence.baselineSummary ?? '—'} />
        </div>
      ) : null}
    </ResearchCard>
  );
}

/** Everything offered this session, and whether the child took it. */
export function InterventionHistoryCard() {
  const { interventions } = useLearnerState();

  return (
    <ResearchCard
      label="Intervention History"
      icon={History}
      available={interventions.length > 0}
      footnote="A monitor-level decision is not listed here: nothing was offered."
    >
      <div className="flex flex-col gap-2">
        {interventions
          .slice()
          .reverse()
          .map((item) => (
            <div key={`${item.windowId}-${item.at}`} className="rounded-xl bg-white/[0.06] px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] font-display font-bold text-white">
                  {SUPPORT_TYPE_LABELS[item.supportType]}
                </span>
                <span className="text-[9.5px] font-bold uppercase tracking-wide text-white/40">
                  {item.windowId}
                </span>
              </div>
              <p className="text-[10.5px] font-semibold text-white/50 mt-0.5">
                {CLASSIFICATION_LABELS[item.classification]} · confidence {prob(item.confidence)} ·
                persistence {item.persistenceTrend}
              </p>
              <p
                className={`text-[10px] font-display font-bold mt-1 ${
                  item.accepted === true
                    ? 'text-success'
                    : item.accepted === false
                      ? 'text-orange'
                      : 'text-white/35'
                }`}
              >
                {item.accepted === true
                  ? 'Accepted by learner'
                  : item.accepted === false
                    ? 'Declined by learner'
                    : 'Awaiting response'}
              </p>
            </div>
          ))}
      </div>
    </ResearchCard>
  );
}
