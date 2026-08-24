import { Lightbulb } from 'lucide-react';
import { WEEKLY_PATTERN, PATTERN_SUGGESTIONS } from '../data/mockData';
import { WeekStrip } from '../components/LearningChart';
import AppHeader from '../components/AppHeader';

export default function Patterns() {
  return (
    <div className="pb-8">
      <AppHeader title="Learning Patterns" />

      <div className="px-5 mt-2">
        <div className="bg-white rounded-2xl p-5 card-shadow mb-5">
          <p className="text-[10.5px] font-bold text-ink-faint uppercase tracking-wide mb-2">This Week</p>
          <p className="text-[13.5px] font-semibold text-ink leading-relaxed mb-5">
            You usually need more support with fractions during longer sessions.
          </p>
          <WeekStrip pattern={WEEKLY_PATTERN} />
          <div className="flex flex-col gap-1.5 mt-4">
            {WEEKLY_PATTERN.filter((d) => d.state !== 'engaged').map((d) => (
              <div key={d.day} className="flex items-center gap-2 text-[11.5px] font-semibold text-ink-soft">
                <span className="font-display font-bold text-ink w-9">{d.day}</span>
                {d.note}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-light rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={17} className="text-primary" />
            <p className="font-display font-bold text-[14px] text-ink">MindBridge Suggests</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {PATTERN_SUGGESTIONS.map((s) => (
              <div key={s} className="bg-white rounded-xl p-3 text-[12.5px] font-semibold text-ink-soft">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
