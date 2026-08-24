import { Clock, Target, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PARENT_SUMMARY } from '../data/mockData';
import AppHeader from '../components/AppHeader';

export default function Parent() {
  const { child } = useApp();

  return (
    <div className="pb-8 bg-cream-deep min-h-dvh">
      <AppHeader title="Parent Area" />

      <div className="px-5 mt-2">
        <h2 className="font-display font-extrabold text-xl text-ink mb-5">{child.name}'s Learning Summary</h2>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <StatCard icon={Clock} value={PARENT_SUMMARY.learningTime} label="Learning time this week" />
          <StatCard icon={Target} value={PARENT_SUMMARY.accuracy} label="Practice accuracy" />
        </div>

        <SectionCard icon={TrendingUp} iconColor="#35C46A" title="Recently Improved Skills">
          <div className="flex gap-2 flex-wrap">
            {PARENT_SUMMARY.improved.map((s) => (
              <span key={s} className="bg-success-light text-[#1E8A47] text-[12px] font-display font-bold rounded-full px-3 py-1.5">{s}</span>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={TrendingDown} iconColor="#FF9F5A" title="Skills Needing Support">
          <div className="flex gap-2 flex-wrap">
            {PARENT_SUMMARY.needsSupport.map((s) => (
              <span key={s} className="bg-orange-light text-[#C1650F] text-[12px] font-display font-bold rounded-full px-3 py-1.5">{s}</span>
            ))}
          </div>
        </SectionCard>

        <SectionCard icon={Lightbulb} iconColor="#6C5CE7" title="Recommended Revision">
          <p className="text-[13px] font-semibold text-ink-soft leading-relaxed">{PARENT_SUMMARY.recommended}</p>
        </SectionCard>

        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="font-display font-bold text-[13.5px] text-ink mb-3">Learning Pattern Observations</p>
          <div className="flex flex-col gap-2.5">
            {PARENT_SUMMARY.observations.map((o) => (
              <p key={o} className="text-[12.5px] font-medium text-ink-soft bg-cream-deep rounded-xl p-3 leading-relaxed">{o}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <Icon size={18} className="text-primary mb-2" strokeWidth={1.8} />
      <p className="font-display font-extrabold text-lg text-ink">{value}</p>
      <p className="text-[10.5px] font-semibold text-ink-soft">{label}</p>
    </div>
  );
}

function SectionCard({ icon: Icon, iconColor, title, children }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow mb-3">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} color={iconColor} />
        <p className="font-display font-bold text-[13px] text-ink">{title}</p>
      </div>
      {children}
    </div>
  );
}
