import { useNavigate } from 'react-router-dom';
import { Printer, Camera, CalendarDays, ShieldCheck, FileCheck2, ChevronRight } from 'lucide-react';
import { PAST_PAPERS, PRACTICE_PAPER, SKILL_MASTERY_DASHBOARD } from '../data/mockData';
import PaperCard from '../components/PaperCard';
import ProgressBar from '../components/ProgressBar';

export default function Practice() {
  const navigate = useNavigate();

  return (
    <div className="pt-8 px-5 pb-4">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Your Weekly Practice</h1>
      <p className="text-[13px] font-semibold text-ink-soft mb-6">Fresh questions, picked just for you</p>

      <PaperCard paper={PRACTICE_PAPER} />

      <div className="grid grid-cols-3 gap-2.5 mt-4">
        <MiniStat icon={CalendarDays} value="Weekly" label={`Due ${PRACTICE_PAPER.dueDate}`} />
        <MiniStat icon={ShieldCheck} value={`${PRACTICE_PAPER.weakAreaWeight}%`} label="Weak areas" />
        <MiniStat icon={Camera} value="Scan" label="Auto mark" />
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow mt-4">
        <p className="font-display font-bold text-[14px] text-ink mb-3">Paper Actions</p>
        <ActionButton
          icon={Printer}
          title="View Current Paper"
          subtitle="Preview before printing or downloading"
          onClick={() => navigate('/printable-paper')}
        />
        <ActionButton
          icon={FileCheck2}
          title="View Past Papers"
          subtitle={`${PAST_PAPERS.length} completed papers with marks and corrections`}
          onClick={() => navigate('/past-papers')}
        />
        <ActionButton
          icon={Camera}
          title="Upload Paper"
          subtitle="Enter paper number, add photos, then scan and mark"
          onClick={() => navigate('/paper-upload')}
        />
      </div>

      <div className="bg-white rounded-2xl p-4 card-shadow mt-4">
        <p className="font-display font-bold text-[13.5px] text-ink mb-3">Current Mastery Levels</p>
        <div className="flex flex-col gap-3">
          {SKILL_MASTERY_DASHBOARD.slice(0, 4).map((item) => (
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

      <div className="bg-white rounded-2xl p-4 card-shadow mt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center flex-shrink-0">
            <FileCheck2 size={18} className="text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-[13.5px] text-ink">Past Completed Papers</p>
            <p className="text-[11px] font-semibold text-ink-soft">
              {PAST_PAPERS.length} papers · latest {PAST_PAPERS[0].marks}/{PAST_PAPERS[0].totalMarks}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/past-papers')}
            className="bg-primary text-white rounded-full px-3.5 py-2.5 font-display font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-transform"
          >
            View
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-cream-deep rounded-xl p-3 mb-2.5 flex items-center gap-3 text-left active:scale-[0.98] transition-transform last:mb-0"
    >
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[12.5px] text-ink">{title}</p>
        <p className="text-[10.5px] font-semibold text-ink-soft leading-tight">{subtitle}</p>
      </div>
      <ChevronRight size={17} className="text-ink-faint flex-shrink-0" />
    </button>
  );
}

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div className="bg-white rounded-2xl p-3 card-shadow text-center">
      <Icon size={16} className="text-primary mx-auto mb-1.5" />
      <p className="font-display font-extrabold text-[13px] text-ink">{value}</p>
      <p className="text-[9.5px] font-semibold text-ink-soft leading-tight">{label}</p>
    </div>
  );
}
