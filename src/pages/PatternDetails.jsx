import { Activity, Camera, Clock3, Info, Lightbulb, Scale } from 'lucide-react';

import AppHeader from '../components/AppHeader';
import { SESSION_HISTORY } from '../data/learner-state/sessionHistory';
import { findRecurringPattern, PATTERN_MIN_SESSIONS } from '../services/learner-state/patternInsights';

export default function PatternDetails() {
  const pattern = findRecurringPattern(SESSION_HISTORY);

  if (!pattern) {
    return (
      <div className="pb-8">
        <AppHeader title="Pattern Details" />
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl p-5 card-shadow text-[13px] font-semibold text-ink-soft leading-relaxed">
            No pattern has repeated across at least {PATTERN_MIN_SESSIONS} sessions yet, so nothing is
            reported here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8 bg-cream-deep min-h-dvh">
      <AppHeader title="Pattern Details" />

      <div className="px-5 mt-2 flex flex-col gap-4">
        <div className="bg-primary-light rounded-2xl p-5">
          <p className="text-[10.5px] font-bold text-primary uppercase tracking-wide">
            Repeated pattern observed
          </p>
          <h1 className="font-display font-extrabold text-xl text-ink mt-1 leading-tight">
            {pattern.title}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={Activity} label="Observed" value={pattern.observed} color="#6C5CE7" bg="#EFECFD" />
          <MetricCard icon={Clock3} label="Time window" value={pattern.timeWindow} color="#3FA9F5" bg="#E8F5FE" />
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Scale size={17} className="text-sky" aria-hidden="true" />
            <p className="font-display font-bold text-[14px] text-ink">
              Signal reliability across those sessions
            </p>
          </div>
          <ReliabilityRow label="Visual" value={pattern.avgVisualReliability} color="#3FA9F5" />
          <ReliabilityRow label="Behaviour" value={pattern.avgBehaviorReliability} color="#16BFA6" />
          <p className="text-[11px] font-semibold text-ink-soft mt-3 leading-relaxed">
            Both modalities were usable, so this pattern does not rest on a degraded signal.
          </p>
        </div>

        <EvidenceCard icon={Activity} title="Learning-behaviour evidence" items={pattern.behaviourEvidence} />
        <EvidenceCard icon={Camera} title="Visual evidence when the camera was on" items={pattern.visualEvidence} />

        <div className="bg-sky-light rounded-2xl p-4 flex items-start gap-2.5">
          <Info size={16} className="text-sky flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed">
            {pattern.corroboration}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={17} className="text-orange" aria-hidden="true" />
            <p className="font-display font-bold text-[14px] text-ink">Learning support suggestion</p>
          </div>
          <p className="text-[13px] font-semibold text-ink-soft leading-relaxed">
            {pattern.recommendation}
          </p>
        </div>

        <div className="bg-orange-light rounded-2xl p-4 flex items-start gap-2.5">
          <Info size={16} className="text-orange flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed">
            This is a learning-support observation and not a medical or psychological assessment.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ background: bg }}>
        <Icon size={17} color={color} aria-hidden="true" />
      </div>
      <p className="text-[10px] font-bold text-ink-faint uppercase tracking-wide">{label}</p>
      <p className="font-display font-bold text-[12.5px] text-ink mt-1 leading-snug">{value}</p>
    </div>
  );
}

function ReliabilityRow({ label, value, color }) {
  return (
    <div className="py-1.5">
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-[11.5px] font-semibold text-ink-soft">{label}</span>
        <span className="text-[11.5px] font-display font-bold text-ink">{value?.toFixed(2)}</span>
      </div>
      <div className="h-2 rounded-full bg-cream-deep overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(value ?? 0) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function EvidenceCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={17} className="text-teal" aria-hidden="true" />
        <p className="font-display font-bold text-[14px] text-ink">{title}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2.5 text-[12.5px] font-semibold text-ink-soft">
            <span className="w-2 h-2 rounded-full bg-teal flex-shrink-0 mt-1.5" aria-hidden="true" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
