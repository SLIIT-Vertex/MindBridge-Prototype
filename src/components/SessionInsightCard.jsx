import { Clock3, LifeBuoy } from 'lucide-react';

const STATE_PRESENTATION = {
  engaged: { label: 'Mostly Engaged', color: '#1E8A47', bg: '#E6F9EC' },
  confusion: { label: 'Some Confusion Indicators', color: '#C1650F', bg: '#FFF1E4' },
  frustration: { label: 'Some Frustration Indicators', color: '#5442D6', bg: '#EFECFD' },
  low_alertness: { label: 'Some Low-Alertness Indicators', color: '#237BB8', bg: '#E8F5FE' },
};

export default function SessionInsightCard({ session }) {
  const presentation = STATE_PRESENTATION[session.dominantState] || STATE_PRESENTATION.engaged;

  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-bold text-[14px] text-ink">{session.day}</p>
          <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5 flex items-center gap-1.5">
            <Clock3 size={12} />
            {session.startTime} – {session.endTime}
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-display font-bold text-right"
          style={{ color: presentation.color, background: presentation.bg }}
        >
          {presentation.label}
        </span>
      </div>
      <div className="mt-3 pt-3 border-t border-cream-deep flex items-center gap-1.5 text-[11.5px] font-semibold text-ink-soft">
        <LifeBuoy size={13} className="text-primary" />
        {session.supportMoments} support {session.supportMoments === 1 ? 'moment' : 'moments'}
        {session.breakSuggested ? ' · Break suggested' : ''}
      </div>
    </div>
  );
}

