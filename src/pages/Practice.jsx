import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowRight, Printer } from 'lucide-react';
import { PRACTICE_PAPER } from '../data/mockData';
import PaperCard from '../components/PaperCard';
import { DonutChart } from '../components/LearningChart';

export default function Practice() {
  const navigate = useNavigate();

  return (
    <div className="pt-8 px-5 pb-4">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Your Weekly Practice</h1>
      <p className="text-[13px] font-semibold text-ink-soft mb-6">Fresh questions, picked just for you</p>

      <PaperCard paper={PRACTICE_PAPER} />

      <div className="bg-white rounded-2xl p-5 card-shadow mt-4">
        <p className="font-display font-bold text-[14px] text-ink mb-4">Personalized Focus</p>
        <DonutChart data={PRACTICE_PAPER.focus} />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {PRACTICE_PAPER.focus.map((f) => (
            <div key={f.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: f.color }} />
              <span className="text-[11.5px] font-semibold text-ink-soft">{f.name} &middot; {f.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary-light rounded-2xl p-4 mt-4 flex items-start gap-2.5">
        <HelpCircle size={18} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-display font-bold text-[13px] text-ink">Why this paper?</p>
          <p className="text-[12px] font-medium text-ink-soft mt-0.5 leading-relaxed">{PRACTICE_PAPER.reason}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={() => navigate('/minigame')}
          className="bg-primary text-white font-display font-bold text-[14.5px] rounded-full py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Start Digital Practice
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/printable-paper')}
          className="bg-white text-ink font-display font-bold text-[14.5px] rounded-full py-4 flex items-center justify-center gap-2 card-shadow active:scale-95 transition-transform"
        >
          <Printer size={16} />
          View Printable Paper
        </button>
        <button
          onClick={() => navigate('/paper-upload')}
          className="text-primary font-display font-bold text-[12.5px] text-center py-1"
        >
          Or scan a completed answer sheet
        </button>
      </div>
    </div>
  );
}
