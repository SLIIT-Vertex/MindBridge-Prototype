import { useState } from 'react';
import { Camera, Download, Languages, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { useApp } from '../context/AppContext';
import { PAPER_LANGUAGE_COPY, PRACTICE_PAPER, WEEKLY_PAPER_QUESTIONS } from '../data/mockData';

export default function PrintablePaper() {
  const navigate = useNavigate();
  const { child, language } = useApp();
  const [paperLanguage, setPaperLanguage] = useState(language || 'en');
  const copy = PAPER_LANGUAGE_COPY[paperLanguage] || PAPER_LANGUAGE_COPY.en;
  const weakQuestions = WEEKLY_PAPER_QUESTIONS.filter((q) => q.section === 'weak');
  const normalQuestions = WEEKLY_PAPER_QUESTIONS.filter((q) => q.section === 'normal');

  function printPaper() {
    window.print();
  }

  return (
    <div className="pb-6">
      <AppHeader
        title="Paper Preview"
        right={<PrinterButton onClick={printPaper} />}
      />

      <div className="px-5 mt-2 print:hidden">
        <div className="bg-white rounded-2xl p-4 card-shadow mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Languages size={17} className="text-primary" />
            <p className="font-display font-bold text-[13.5px] text-ink">Preview language</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(PAPER_LANGUAGE_COPY).map(([code, item]) => (
              <button
                key={code}
                type="button"
                onClick={() => setPaperLanguage(code)}
                className={`rounded-full py-2.5 text-[11.5px] font-display font-bold transition-colors ${
                  paperLanguage === code ? 'bg-primary text-white' : 'bg-cream-deep text-ink-soft'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 print:px-0">
        <article className="paper-sheet bg-white text-black mx-auto border border-neutral-300 shadow-lg print:shadow-none print:border-0">
          <header className="text-center border-b-2 border-black pb-3">
            <p className="text-[12px] font-bold uppercase tracking-wide">{copy.school}</p>
            <h1 className="font-serif text-[21px] font-bold mt-1">{copy.paperTitle}</h1>
            <p className="text-[13px] font-semibold mt-1">{copy.exam}</p>
          </header>

          <section className="grid grid-cols-2 gap-x-5 gap-y-2 text-[12px] mt-4">
            <PaperLine label={copy.student} value={child.name} />
            <PaperLine label={copy.grade} value={child.grade} />
            <PaperLine label={copy.date} value={PRACTICE_PAPER.generatedOn} />
            <PaperLine label={copy.time} value={`${PRACTICE_PAPER.minutes} minutes`} />
            <PaperLine label={copy.marks} value={`${PRACTICE_PAPER.marks}`} />
            <PaperLine label="Paper ID" value={`${PRACTICE_PAPER.week}-MB-05`} />
          </section>

          <section className="border border-black p-3 mt-4">
            <p className="text-[12px] font-bold mb-1">Instructions</p>
            <ol className="list-decimal pl-5 text-[11.5px] leading-relaxed">
              {copy.instructions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <QuestionSection title={copy.sectionA} subtitle={`${PRACTICE_PAPER.weakAreaWeight}% personalized weak-area questions`} questions={weakQuestions} />
          <QuestionSection title={copy.sectionB} subtitle={`${PRACTICE_PAPER.normalWeight}% normal grade-level questions`} questions={normalQuestions} />

          <footer className="text-center text-[11px] font-semibold border-t border-black pt-3 mt-5">
            {copy.footer} · Parent upload: open MindBridge, take clear photos of all pages, then submit for marking.
          </footer>
        </article>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-3 print:hidden">
        <button
          type="button"
          onClick={printPaper}
          className="bg-primary text-white font-display font-bold text-[14px] rounded-full py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Download size={16} />
          Download / Print Paper
        </button>
        <button
          type="button"
          onClick={() => navigate('/paper-upload')}
          className="bg-white text-ink font-display font-bold text-[14px] rounded-full py-4 flex items-center justify-center gap-2 card-shadow active:scale-95 transition-transform"
        >
          <Camera size={16} />
          Upload Completed Paper
        </button>
      </div>
    </div>
  );
}

function PrinterButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform"
      aria-label="Print paper"
    >
      <Printer size={18} className="text-primary" />
    </button>
  );
}

function PaperLine({ label, value }) {
  return (
    <div className="flex items-end gap-2 min-w-0">
      <span className="font-bold flex-shrink-0">{label}:</span>
      <span className="border-b border-black flex-1 min-h-5 px-1">{value}</span>
    </div>
  );
}

function QuestionSection({ title, subtitle, questions }) {
  return (
    <section className="mt-5">
      <div className="flex items-end justify-between gap-3 border-b border-black pb-1 mb-3">
        <div>
          <h2 className="font-serif text-[15px] font-bold">{title}</h2>
          <p className="text-[10.5px] font-semibold text-neutral-600">{subtitle}</p>
        </div>
        <span className="text-[11px] font-bold">{questions.reduce((sum, q) => sum + q.marks, 0)} marks</span>
      </div>
      <div className="flex flex-col gap-4">
        {questions.map((q) => (
          <div key={q.id} className="break-inside-avoid">
            <div className="flex items-start gap-2 text-[12px] leading-relaxed">
              <span className="font-bold w-6 flex-shrink-0">{q.id}.</span>
              <div className="flex-1">
                <p><span className="font-semibold">{q.prompt}</span> <span className="text-neutral-600">[{q.marks}]</span></p>
                <p className="text-[10.5px] text-neutral-500 mt-0.5">Skill: {q.skill}</p>
                <div className="h-12 border-b border-dotted border-neutral-500 mt-2" />
                {q.marks >= 3 && <div className="h-10 border-b border-dotted border-neutral-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
