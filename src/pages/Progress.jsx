import { useNavigate } from 'react-router-dom';
import { TrendingUp, Clock, CheckCircle2, ChevronRight, Sparkles, HeartHandshake } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SKILLS, FOCUS_SKILLS, SKILL_MASTERY_DASHBOARD } from '../data/mockData';
import SkillCard from '../components/SkillCard';
import ProgressBar from '../components/ProgressBar';

export default function Progress() {
  const navigate = useNavigate();
  const { level, xp, streak } = useApp();

  return (
    <div className="pt-8 px-5 pb-4">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">My Journey</h1>
      <p className="text-[13px] font-semibold text-ink-soft mb-5">Level {level} &middot; {xp.toLocaleString()} total XP &middot; {streak}-day streak</p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <MetricCard icon={CheckCircle2} value="82%" label="Practice accuracy" color="text-success" bg="bg-success-light" />
        <MetricCard icon={Sparkles} value="6" label="Missions completed" color="text-primary" bg="bg-primary-light" />
        <MetricCard icon={Clock} value="124m" label="Minutes learned" color="text-sky" bg="bg-sky-light" />
        <MetricCard icon={TrendingUp} value="+8%" label="Improvement" color="text-orange" bg="bg-orange-light" />
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow mb-5 mt-2">
        <p className="font-display font-bold text-[14px] text-ink mb-4">Skills</p>
        <div className="grid grid-cols-2 gap-3">
          {SKILLS.map((s) => (
            <SkillCard key={s.id} {...s} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="font-display font-bold text-[14px] text-ink mb-3">Skills I'm Building</p>
        <div className="flex flex-col gap-3">
          {FOCUS_SKILLS.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl p-4 card-shadow flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="font-display font-bold text-[13.5px] text-ink">{f.name}</span>
                  <span className="font-display font-bold text-[13px]" style={{ color: f.color }}>{f.pct}%</span>
                </div>
                <ProgressBar pct={f.pct} color={f.color} height={8} />
                <p className="text-[11px] font-semibold text-ink-soft mt-1.5">{f.note}</p>
              </div>
              <button
                onClick={() => navigate('/learn')}
                className="flex-shrink-0 min-h-11 bg-primary text-white font-display font-bold text-[11px] rounded-full px-4"
              >
                Practice
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow mb-5">
        <p className="font-display font-bold text-[14px] text-ink mb-1">Mastery Map</p>
        <p className="text-[11.5px] font-semibold text-ink-soft mb-4">Updated after games and scanned weekly papers</p>
        <div className="flex flex-col gap-3">
          {SKILL_MASTERY_DASHBOARD.map((item) => (
            <div key={item.skill}>
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <div className="min-w-0">
                  <p className="font-display font-bold text-[12.5px] text-ink">{item.skill}</p>
                  <p className="text-[10.5px] font-semibold text-ink-soft">{item.status}</p>
                </div>
                <span className="font-display font-extrabold text-[12.5px]" style={{ color: item.color }}>{item.mastery}%</span>
              </div>
              <ProgressBar pct={item.mastery} color={item.color} height={7} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* The technical pipeline view moved to the Parent Area: this tab is
            a child surface, and a nine-year-old should not be one tap from
            service names and reliability figures. */}
        <NavCard
          icon={HeartHandshake}
          title="How Mindy Helps"
          subtitle="Why help shows up when it does"
          onClick={() => navigate('/companion')}
        />
        <NavCard
          icon={TrendingUp}
          title="Learning Patterns"
          subtitle="Your weekly learning pattern & suggestions"
          onClick={() => navigate('/patterns')}
        />
        <NavCard
          icon={Sparkles}
          title="My Learning Journey"
          subtitle="See how everything connects"
          onClick={() => navigate('/journey')}
        />
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2.5`}>
        <Icon size={17} className={color} />
      </div>
      <p className="font-display font-extrabold text-lg text-ink">{value}</p>
      <p className="text-[10.5px] font-semibold text-ink-soft">{label}</p>
    </div>
  );
}

function NavCard({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-4 card-shadow flex items-center gap-3.5 text-left active:scale-95 transition-transform">
      <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-primary" strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[13.5px] text-ink">{title}</p>
        <p className="text-[11px] font-semibold text-ink-soft">{subtitle}</p>
      </div>
      <ChevronRight size={18} className="text-ink-faint flex-shrink-0" />
    </button>
  );
}
