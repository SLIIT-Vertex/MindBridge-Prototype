import { Clock, Target, TrendingUp, TrendingDown, Lightbulb, HeartPulse, ChevronRight, FileText, Printer, Camera, Route, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PARENT_SUMMARY, PRACTICE_PAPER, SKILL_MASTERY_DASHBOARD } from '../data/mockData';
import ProgressBar from '../components/ProgressBar';
import AppHeader from '../components/AppHeader';

export default function Parent() {
  const { child } = useApp();
  const navigate = useNavigate();

  return (
    <div className="pb-8 bg-cream-deep min-h-dvh">
      <AppHeader title="Parent Area" />

      <div className="px-5 mt-2">
        <h2 className="font-display font-extrabold text-xl text-ink mb-5">{child.name}'s Learning Summary</h2>

        <button
          type="button"
          onClick={() => navigate('/learner-state-insights')}
          className="w-full bg-teal-light rounded-2xl p-4 mb-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0 card-shadow">
            <HeartPulse size={20} className="text-teal" strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[14px] text-ink">Learning Pattern Insights</p>
            <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Recent sessions, support moments and recurring patterns</p>
          </div>
          <ChevronRight size={18} className="text-teal flex-shrink-0" />
        </button>

        {/* The research surfaces live behind the parent PIN, not on a child tab. */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <AdultCard
            icon={Route}
            label="How it works"
            hint="Full pipeline"
            onClick={() => navigate('/state-fusion')}
          />
          <AdultCard
            icon={FlaskConical}
            label="Demo controls"
            hint="Research prototype"
            onClick={() => navigate('/demo-controls')}
          />
        </div>

        <div className="bg-white rounded-2xl p-4 card-shadow-lg mb-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-sky-light flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-sky" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-[14px] text-ink">{PRACTICE_PAPER.title}</p>
              <p className="text-[11px] font-semibold text-ink-soft mt-0.5">
                {PRACTICE_PAPER.weakAreaWeight}% weak areas · {PRACTICE_PAPER.normalWeight}% grade-level revision · {PRACTICE_PAPER.languageVersions.join(', ')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/printable-paper')}
              className="bg-primary text-white rounded-full py-3 font-display font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Printer size={14} />
              Preview / Print
            </button>
            <button
              type="button"
              onClick={() => navigate('/paper-upload')}
              className="bg-cream-deep text-ink rounded-full py-3 font-display font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
            >
              <Camera size={14} />
              Upload Answers
            </button>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl p-4 card-shadow mb-3">
          <p className="font-display font-bold text-[13.5px] text-ink mb-3">Student Skill Dashboard</p>
          <div className="flex flex-col gap-3">
            {SKILL_MASTERY_DASHBOARD.map((item) => (
              <div key={item.skill} className="border border-cream-deep rounded-xl p-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-[12.5px] text-ink">{item.skill}</p>
                    <p className="text-[10.5px] font-semibold text-ink-soft">{item.status} · {item.trend}</p>
                  </div>
                  <span className="font-display font-extrabold text-[13px]" style={{ color: item.color }}>{item.mastery}%</span>
                </div>
                <ProgressBar pct={item.mastery} color={item.color} height={7} />
                <p className="text-[10.5px] font-semibold text-ink-soft mt-2 leading-relaxed">{item.evidence}</p>
              </div>
            ))}
          </div>
        </div>

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

function AdultCard({ icon: Icon, label, hint, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-white rounded-2xl p-3.5 card-shadow flex items-center gap-2.5 text-left active:scale-[0.97] transition-transform"
    >
      <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
        <Icon size={17} className="text-primary" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-display font-bold text-[12px] text-ink leading-snug">{label}</p>
        <p className="text-[10px] font-semibold text-ink-soft truncate">{hint}</p>
      </div>
    </button>
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
