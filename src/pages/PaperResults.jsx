import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PartyPopper, Clock, Check, RotateCcw, ArrowRight, FileCheck2, ScanLine } from 'lucide-react';
import { PAPER_RESULT } from '../data/mockData';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/ProgressBar';
import AppHeader from '../components/AppHeader';

export default function PaperResults() {
  const navigate = useNavigate();
  const { child } = useApp();

  return (
    <div className="pb-6">
      <AppHeader title="Practice Results" />

      <div className="px-5 mt-2 flex flex-col items-center text-center mb-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="w-32 h-32 rounded-full bg-primary-light flex items-center justify-center mb-3"
        >
          <span className="font-display font-extrabold text-4xl text-primary">{PAPER_RESULT.score}%</span>
        </motion.div>
        <p className="font-display font-bold text-[16px] text-ink flex items-center gap-1.5">
          Nice work, {child.name}! <PartyPopper size={17} className="text-coin" />
        </p>
      </div>

      <div className="px-5 grid grid-cols-3 gap-2.5 mb-6">
        <StatBlock icon={Check} value={`${PAPER_RESULT.marks}/${PAPER_RESULT.totalMarks}`} label="Marks" tone="text-success" />
        <StatBlock icon={RotateCcw} value={PAPER_RESULT.retry} label="Needs another try" tone="text-orange" />
        <StatBlock icon={Clock} value={`${PAPER_RESULT.minutes}m`} label="Time" tone="text-primary" />
      </div>

      <div className="px-5 grid grid-cols-2 gap-2.5 mb-6">
        <StatBlock icon={ScanLine} value={PAPER_RESULT.scannedPages} label="Pages scanned" tone="text-sky" />
        <StatBlock icon={FileCheck2} value={`${PAPER_RESULT.correct}/20`} label="Answers correct" tone="text-teal" />
      </div>

      <div className="px-5 mb-6">
        <div className="bg-white rounded-2xl p-5 card-shadow">
          <p className="font-display font-bold text-[14px] text-ink mb-4">Skill Breakdown</p>
          <div className="flex flex-col gap-3.5">
            {PAPER_RESULT.breakdown.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[12.5px] font-semibold text-ink">{s.name}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: s.color }}>
                    {s.before}% → {s.pct}%
                  </span>
                </div>
                <ProgressBar pct={s.pct} color={s.color} height={8} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5">
        <div className="bg-white rounded-2xl p-5 card-shadow mb-5 text-left">
          <p className="font-display font-bold text-[14px] text-ink mb-3">Sample Marked Answers</p>
          <div className="flex flex-col gap-2.5">
            {PAPER_RESULT.markedAnswers.map((answer) => (
              <div key={answer.no} className="bg-cream-deep rounded-xl p-3">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <p className="font-display font-bold text-[12.5px] text-ink">Q{answer.no} · {answer.skill}</p>
                  <span className="font-display font-extrabold text-[12px] text-primary">{answer.mark}</span>
                </div>
                <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed">{answer.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-primary-light rounded-2xl p-5">
          <p className="font-display font-bold text-[14px] text-ink mb-3">Let's Focus On</p>
          <div className="flex gap-2 mb-4">
            {PAPER_RESULT.focusNext.map((f) => (
              <span key={f} className="bg-white rounded-full px-3.5 py-2 text-[12px] font-display font-bold text-primary-dark card-shadow">
                {f}
              </span>
            ))}
          </div>
          <button
            onClick={() => navigate('/learn')}
            className="w-full bg-primary text-white font-display font-bold text-[13.5px] rounded-full py-3.5 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            Start Recommended Practice
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ icon: Icon, value, label, tone }) {
  return (
    <div className="bg-white rounded-2xl p-3.5 card-shadow text-center">
      <Icon size={17} className={`${tone} mx-auto mb-1.5`} />
      <p className="font-display font-extrabold text-[16px] text-ink">{value}</p>
      <p className="text-[9.5px] font-semibold text-ink-soft leading-tight">{label}</p>
    </div>
  );
}
