import { useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, FileText, Search } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import ProgressBar from '../components/ProgressBar';
import { PAST_PAPERS } from '../data/mockData';

export default function PastPapers() {
  const [selectedId, setSelectedId] = useState(PAST_PAPERS[0]?.id);
  const selectedPaper = PAST_PAPERS.find((paper) => paper.id === selectedId) || PAST_PAPERS[0];

  return (
    <div className="pb-8 bg-cream min-h-dvh">
      <AppHeader title="Past Papers" />

      <div className="px-5 mt-2">
        <div className="bg-white rounded-2xl p-4 card-shadow-lg mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[14px] text-ink">Completed Paper History</p>
              <p className="text-[11px] font-semibold text-ink-soft">View marks and wrong answers from scanned papers</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {PAST_PAPERS.map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => setSelectedId(paper.id)}
                className={`rounded-xl p-3 text-left flex items-center gap-3 transition-colors ${
                  selectedId === paper.id ? 'bg-primary-light border border-primary/30' : 'bg-cream-deep border border-transparent'
                }`}
              >
                <CalendarDays size={16} className={selectedId === paper.id ? 'text-primary' : 'text-ink-soft'} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-[12.5px] text-ink">{paper.title}</p>
                  <p className="text-[10.5px] font-semibold text-ink-soft">{paper.date} · {paper.focus}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-extrabold text-[13px] text-primary">{paper.marks}/{paper.totalMarks}</p>
                  <p className="text-[10px] font-bold text-ink-soft">{paper.score}%</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="font-display font-bold text-[14px] text-ink">{selectedPaper.title}</p>
              <p className="text-[11px] font-semibold text-ink-soft">{selectedPaper.date} · {selectedPaper.status}</p>
            </div>
            <span className="bg-success-light text-success rounded-full px-3 py-1 text-[11px] font-display font-bold">
              {selectedPaper.score}%
            </span>
          </div>
          <ProgressBar pct={selectedPaper.score} color="var(--color-success)" height={8} />
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <PaperStat value={`${selectedPaper.marks}/${selectedPaper.totalMarks}`} label="Marks" />
            <PaperStat value={selectedPaper.wrongAnswers.length} label="Wrong" />
            <PaperStat value={selectedPaper.focus.split(',').length} label="Focus areas" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 card-shadow">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={17} className="text-coral" />
            <p className="font-display font-bold text-[13.5px] text-ink">Wrong Answers</p>
          </div>
          <div className="flex flex-col gap-3">
            {selectedPaper.wrongAnswers.map((answer) => (
              <div key={`${selectedPaper.id}-${answer.no}`} className="border border-cream-deep rounded-xl p-3">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-[12.5px] text-ink">Q{answer.no} · {answer.skill}</p>
                    <p className="text-[11px] font-semibold text-ink-soft leading-relaxed mt-0.5">{answer.question}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-coral-light text-coral rounded-full px-2.5 py-1 flex-shrink-0">
                    <Search size={13} />
                    <span className="font-display font-extrabold text-[11px]">{answer.marks}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <AnswerBox label="Child answer" value={answer.childAnswer} tone="bg-coral-light text-coral" />
                  <AnswerBox label="Correct answer" value={answer.correctAnswer} tone="bg-success-light text-success" />
                </div>
                <div className="bg-cream-deep rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle2 size={15} className="text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] font-semibold text-ink-soft leading-relaxed">{answer.feedback}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaperStat({ value, label }) {
  return (
    <div className="bg-cream-deep rounded-xl p-3 text-center">
      <p className="font-display font-extrabold text-[14px] text-ink">{value}</p>
      <p className="text-[9.5px] font-semibold text-ink-soft leading-tight">{label}</p>
    </div>
  );
}

function AnswerBox({ label, value, tone }) {
  return (
    <div className="bg-cream-deep rounded-xl p-2.5 min-w-0">
      <p className="text-[9.5px] font-bold text-ink-soft mb-1">{label}</p>
      <p className={`rounded-lg px-2 py-1.5 text-[11px] font-display font-bold ${tone}`}>{value}</p>
    </div>
  );
}
