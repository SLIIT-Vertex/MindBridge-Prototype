import { Activity, Database, Info, TriangleAlert } from 'lucide-react';

import { useAdaptive } from '../../../context/AdaptiveLearningContext';
import ResearchCard, { ResearchRow } from '../ResearchCard';
import EvidenceTimeline from '../EvidenceTimeline';
import { formatPercent, formatSeconds } from './researchFormat';

import { phaseLabel } from '../../../services/adaptive-learning/phaseMachine';
import { averageResponseTime } from '../../../services/adaptive-learning/eventLogger';
import { DIFFICULTY_CAVEAT } from '../../../services/adaptive-learning/difficultyDetector';
import { BASELINE_QUESTIONS } from '../../../data/adaptive-learning/patternQuestions';
import { ERROR_CODE_LABELS } from '../../../data/adaptive-learning/misconceptions';
import { getSkill, PROTOTYPE_COVERAGE } from '../../../data/adaptive-learning/curriculum';

export function PrototypeCoverageCard() {
  return (
    <ResearchCard label="Prototype Coverage" icon={Database}>
      <ResearchRow label="Domain implemented" value={PROTOTYPE_COVERAGE.domainImplemented} />
      <ResearchRow label="Skill implemented" value={PROTOTYPE_COVERAGE.skillImplemented} />
      <ResearchRow
        label="Research loop"
        value={PROTOTYPE_COVERAGE.researchLoop}
        valueClass="text-teal"
      />
    </ResearchCard>
  );
}

export function CurrentContextCard() {
  const { learner, domain, skill, phase } = useAdaptive();
  const skillMeta = getSkill(skill.id);

  return (
    <ResearchCard label="Current Context" icon={Info}>
      <ResearchRow label="Grade" value={`Grade ${learner.grade}`} />
      <ResearchRow label="Curriculum Area" value={domain.name} />
      <ResearchRow label="Skill" value={skill.name} />
      <ResearchRow label="Skill ID" value={skill.id} />
      <ResearchRow
        label="Assessment Type"
        value={skillMeta?.assessmentType ?? 'Visual / Pattern Reasoning'}
      />
      <ResearchRow label="Phase" value={phaseLabel(phase)} valueClass="text-coin" />
      {skillMeta?.prototypeLearningGoal ? (
        <p className="text-[11.5px] font-semibold text-white/55 leading-relaxed mt-2.5 pt-2.5 border-t border-white/10">
          Prototype Learning Goal:{' '}
          <span className="font-display font-bold text-white">
            {skillMeta.prototypeLearningGoal}
          </span>
        </p>
      ) : null}
    </ResearchCard>
  );
}

export function LiveEvidenceCard() {
  const { events, gameplay, baseline, derived } = useAdaptive();

  const totalAttempts = events.length;
  const correctCount = events.filter((e) => e.isCorrect).length;
  const overallAccuracy = totalAttempts > 0 ? correctCount / totalAttempts : null;
  const baselineComplete = baseline.questionsAnswered >= BASELINE_QUESTIONS.length;

  return (
    <ResearchCard
      label="Live Evidence"
      icon={Activity}
      available={totalAttempts > 0}
      footnote="Captured automatically from gameplay: answer, attempt count, response time and error pattern."
    >
      <ResearchRow label="Accuracy" value={formatPercent(overallAccuracy) ?? '—'} />
      <ResearchRow label="Attempts" value={totalAttempts} />
      <ResearchRow
        label="Avg Response Time"
        value={formatSeconds(averageResponseTime(events)) ?? '—'}
      />
      <ResearchRow label="Related Errors" value={gameplay.relatedErrors} />
      <ResearchRow
        label="Baseline Items"
        value={`${baseline.questionsAnswered} / ${BASELINE_QUESTIONS.length}`}
      />
      <ResearchRow
        label="Unsupported Before"
        value={baselineComplete ? (formatPercent(baseline.score) ?? '—') : 'Calculating…'}
        valueClass={baselineComplete ? 'text-white' : 'text-white/50'}
      />

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
          Recent responses
        </p>
        <EvidenceTimeline events={derived.recentEvents} />
      </div>
    </ResearchCard>
  );
}

export function DifficultyCard() {
  const { difficulty, gameplay } = useAdaptive();

  return (
    <ResearchCard
      label="Difficulty"
      icon={TriangleAlert}
      available={difficulty.detected}
      footnote={DIFFICULTY_CAVEAT}
    >
      <p className="font-display font-bold text-[12px] text-orange mb-2.5">
        MEANINGFUL DIFFICULTY DETECTED
      </p>

      <ResearchRow label="Repeated related errors" value={gameplay.relatedErrors} />
      <ResearchRow
        label="Average Response Time"
        value={formatSeconds(gameplay.avgResponseTimeOnErrorsMs) ?? '—'}
      />
      <ResearchRow
        label="Dominant Error Pattern"
        value={
          ERROR_CODE_LABELS[gameplay.dominantErrorCode] ??
          ERROR_CODE_LABELS[difficulty.dominantErrorCode] ??
          '—'
        }
      />
      <ResearchRow label="Adaptive Support" value="Triggered" valueClass="text-orange" />
      <ResearchRow
        label="Confidence"
        value={difficulty.confidence.toFixed(2)}
        valueClass="text-orange"
      />

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
          Signals met ({difficulty.signalsMet} of {difficulty.signals.length})
        </p>
        <ul className="flex flex-col gap-1.5">
          {difficulty.signals.map((signal) => (
            <li key={signal.id} className="flex items-start gap-2">
              <span
                className={`text-[10px] font-display font-bold mt-[1px] flex-shrink-0 ${
                  signal.met ? 'text-success' : 'text-white/30'
                }`}
              >
                {signal.met ? '✓' : '—'}
              </span>
              <span
                className={`text-[10.5px] font-semibold leading-snug ${
                  signal.met ? 'text-white/80' : 'text-white/35'
                }`}
              >
                {signal.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ResearchCard>
  );
}
