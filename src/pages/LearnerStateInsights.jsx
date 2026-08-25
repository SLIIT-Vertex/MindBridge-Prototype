import { useNavigate } from 'react-router-dom';
import { ChevronRight, Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import SessionInsightCard from '../components/SessionInsightCard';
import { LEARNER_SESSION_HISTORY, STATE_TREND } from '../data/learnerStateMockData';
import { findRecurringPattern } from '../services/learnerStateService';

export default function LearnerStateInsights() {
  const navigate = useNavigate();
  const recurringPattern = findRecurringPattern(LEARNER_SESSION_HISTORY);

  return (
    <div className="pb-8 bg-cream-deep min-h-dvh">
      <AppHeader title="Learning Pattern Insights" />

      <div className="px-5 mt-2">
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mb-5">
          A simple view of recent learning sessions and support moments. Insights appear only when a pattern repeats.
        </p>

        <SectionTitle title="Recent Sessions" />
        <div className="flex flex-col gap-3">
          {LEARNER_SESSION_HISTORY.slice(-4).reverse().map((session) => (
            <SessionInsightCard key={session.id} session={session} />
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mt-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={17} className="text-primary" />
            <p className="font-display font-bold text-[14px] text-ink">State Trend</p>
          </div>
          <p className="text-[11px] font-semibold text-ink-soft mb-4">Relative indicators across the four recent sessions</p>
          <div className="flex flex-col gap-3.5">
            {STATE_TREND.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between gap-3 mb-1.5">
                  <span className="text-[11.5px] font-semibold text-ink-soft">{item.label}</span>
                  <span className="text-[11px] font-display font-bold text-ink">{item.value}</span>
                </div>
                <div className="h-2.5 bg-cream-deep rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {recurringPattern && (
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
                <p className="text-[10.5px] font-bold text-primary uppercase tracking-wide">Recurring pattern observed</p>
                <p className="font-display font-bold text-[14px] text-ink mt-1 leading-snug">{recurringPattern.insight}</p>
                <p className="text-[12px] font-semibold text-ink-soft mt-2 leading-relaxed">{recurringPattern.recommendation}</p>
              </div>
              <ChevronRight size={18} className="text-primary flex-shrink-0 mt-1" />
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full bg-white rounded-2xl p-4 card-shadow mt-5 flex items-center gap-3 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-light flex items-center justify-center">
            <ShieldCheck size={17} className="text-teal" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-[13px] text-ink">Privacy & Camera Controls</p>
            <p className="text-[10.5px] font-semibold text-ink-soft">Review optional monitoring settings</p>
          </div>
          <ChevronRight size={17} className="text-ink-faint" />
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return <h2 className="font-display font-bold text-[15px] text-ink mb-3">{title}</h2>;
}
