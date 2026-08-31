import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lightbulb, Scale, ShieldCheck, TrendingUp, UserCheck } from 'lucide-react';

import AppHeader from '../components/AppHeader';
import SessionInsightCard from '../components/SessionInsightCard';
import ProgressBar from '../components/ProgressBar';
import { SESSION_HISTORY } from '../data/learner-state/sessionHistory';
import { BASELINE_CONTRAST } from '../data/learner-state/learnerBaselines';
import { CAMERA_MODE_COPY, SUPPORT_TYPE_LABELS } from '../data/learner-state/supportCopy';
import {
  findRecurringPattern,
  interventionAcceptance,
  summariseStateTrend,
} from '../services/learner-state/patternInsights';
import { contrastAcrossLearners } from '../services/learner-state/learnerBaselineService';

/**
 * Research / admin view over stored sessions.
 *
 * Deliberately shows reliability and weighting NEXT TO every state figure. A
 * confusion peak of 0.77 means something different when visual reliability was
 * 0.33 and behaviour carried 81% of the weight, and a reviewer should not have to
 * go looking for that.
 */
export default function LearnerStateInsights() {
  const navigate = useNavigate();
  const pattern = findRecurringPattern(SESSION_HISTORY);
  const trend = summariseStateTrend(SESSION_HISTORY);
  const acceptance = interventionAcceptance(SESSION_HISTORY);
  const contrast = contrastAcrossLearners(
    BASELINE_CONTRAST.field,
    BASELINE_CONTRAST.value,
    BASELINE_CONTRAST.learnerIds
  );

  return (
    <div className="pb-8 bg-cream-deep min-h-dvh">
      <AppHeader title="Learner State Insights" />

      <div className="px-5 mt-2">
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mb-5">
          Recent sessions with the signal reliability and modality weighting behind each estimate.
          Patterns are reported only when they repeat.
        </p>

        <SectionTitle title="Recent Sessions" />
        <div className="flex flex-col gap-3">
          {SESSION_HISTORY.slice(0, 4).map((session) => (
            <SessionInsightCard key={session.id} session={session} />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mt-5">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={17} className="text-primary" />
            <p className="font-display font-bold text-[14px] text-ink">Why baselines are personal</p>
          </div>
          <p className="text-[11.5px] font-semibold text-ink-soft mb-4 leading-relaxed">
            The same reading, judged against two learners{"’"} own histories.
          </p>

          <div className="rounded-xl bg-primary-light px-3.5 py-2.5 mb-3">
            <p className="font-display font-bold text-[13px] text-ink">
              {BASELINE_CONTRAST.observation}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {contrast.map((row) => (
              <div key={row.learnerId}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="font-display font-bold text-[12.5px] text-ink">
                    {row.learnerName}
                  </span>
                  <span
                    className="font-display font-extrabold text-[12.5px]"
                    style={{ color: row.atypical ? '#C1650F' : '#1E8A47' }}
                  >
                    {row.z > 0 ? '+' : ''}
                    {row.z.toFixed(2)}
                    {'σ'}
                  </span>
                </div>
                <ProgressBar
                  pct={Math.min(100, (Math.abs(row.z) / 4) * 100)}
                  color={row.atypical ? '#FF9F5A' : '#35C46A'}
                  height={7}
                />
                <p className="text-[10.5px] font-semibold text-ink-soft mt-1.5">
                  Usually {row.typical}s (sd {row.sd}s) {'·'}{' '}
                  {row.atypical ? 'unusual for this learner' : 'normal for this learner'}
                </p>
              </div>
            ))}
          </div>

          <p className="text-[10.5px] font-semibold text-ink-faint mt-4 leading-relaxed">
            A single universal threshold would have treated both identically.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mt-5">
          <div className="flex items-center gap-2 mb-1">
            <Scale size={17} className="text-sky" />
            <p className="font-display font-bold text-[14px] text-ink">
              Modality weighting per session
            </p>
          </div>
          <p className="text-[11.5px] font-semibold text-ink-soft mb-4 leading-relaxed">
            The visual / behaviour split is recomputed from reliability, so it moves between sessions
            rather than sitting fixed.
          </p>

          <div className="flex flex-col gap-3.5">
            {SESSION_HISTORY.map((session) => (
              <div key={session.id}>
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <span className="text-[11.5px] font-semibold text-ink-soft">
                    {session.date} {'·'} {CAMERA_MODE_COPY[session.cameraMode]?.label}
                  </span>
                  <span className="text-[11px] font-display font-bold text-ink">
                    {Math.round(session.avgVisualWeight * 100)}% /{' '}
                    {Math.round((1 - session.avgVisualWeight) * 100)}%
                  </span>
                </div>
                <div className="flex h-2.5 rounded-full overflow-hidden bg-cream-deep" aria-hidden="true">
                  <div
                    style={{ width: `${session.avgVisualWeight * 100}%`, background: '#3FA9F5' }}
                  />
                  <div
                    style={{
                      width: `${(1 - session.avgVisualWeight) * 100}%`,
                      background: '#16BFA6',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Legend color="#3FA9F5" label="Visual" />
            <Legend color="#16BFA6" label="Behaviour" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mt-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={17} className="text-primary" />
            <p className="font-display font-bold text-[14px] text-ink">Dominant state per session</p>
          </div>
          <div className="flex flex-col gap-3.5">
            {trend.map((item) => (
              <div key={item.key}>
                <div className="flex justify-between gap-3 mb-1.5">
                  <span className="text-[11.5px] font-semibold text-ink-soft">{item.label}</span>
                  <span className="text-[11px] font-display font-bold text-ink">
                    {item.sessions} of {SESSION_HISTORY.length}
                  </span>
                </div>
                <ProgressBar pct={item.value} color={item.color} height={9} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mt-5">
          <p className="font-display font-bold text-[14px] text-ink mb-1">Intervention history</p>
          <p className="text-[11.5px] font-semibold text-ink-soft mb-4">
            {acceptance.accepted} of {acceptance.total} offers accepted
            {acceptance.rate != null ? ` (${Math.round(acceptance.rate * 100)}%)` : ''}
          </p>

          <div className="flex flex-col gap-2.5">
            {SESSION_HISTORY.flatMap((session) =>
              session.interventions.map((intervention, index) => (
                <div
                  key={`${session.id}-${index}`}
                  className="border border-cream-deep rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display font-bold text-[12.5px] text-ink">
                        {SUPPORT_TYPE_LABELS[intervention.type]}
                      </p>
                      <p className="text-[10.5px] font-semibold text-ink-soft mt-0.5">
                        {session.date} {'·'} minute {intervention.atMinute} {'·'} persistence{' '}
                        {intervention.persistenceTrend}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-display font-bold flex-shrink-0"
                      style={
                        intervention.accepted
                          ? { color: '#1E8A47', background: '#E6F9EC' }
                          : { color: '#C1650F', background: '#FFF1E4' }
                      }
                    >
                      {intervention.accepted ? 'Accepted' : 'Declined'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {pattern && (
          <button
            type="button"
            onClick={() => navigate('/pattern-details')}
            className="w-full text-left bg-primary-light rounded-2xl p-5 mt-5 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Lightbulb size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10.5px] font-bold text-primary uppercase tracking-wide">
                  Recurring pattern observed
                </p>
                <p className="font-display font-bold text-[14px] text-ink mt-1 leading-snug">
                  {pattern.insight}
                </p>
                <p className="text-[12px] font-semibold text-ink-soft mt-2 leading-relaxed">
                  {pattern.recommendation}
                </p>
              </div>
              <ChevronRight size={18} className="text-primary flex-shrink-0 mt-1" />
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full bg-white rounded-2xl p-4 card-shadow mt-5 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={17} className="text-teal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[13px] text-ink">Privacy & Camera Controls</p>
            <p className="text-[10.5px] font-semibold text-ink-soft">
              Raw video is not stored. Derived features only.
            </p>
          </div>
          <ChevronRight size={17} className="text-ink-faint flex-shrink-0" />
        </button>

        <p className="text-[10.5px] font-semibold text-ink-faint leading-relaxed mt-5 px-1">
          Prototype estimates. Probabilities and confidence values are not statistically validated and
          are not a psychological or medical assessment.
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return <h2 className="font-display font-bold text-[15px] text-ink mb-3">{title}</h2>;
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] font-semibold text-ink-soft">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
}
