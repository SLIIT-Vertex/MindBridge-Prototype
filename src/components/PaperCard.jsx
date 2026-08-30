import { FileText, Clock, ListChecks, Languages } from 'lucide-react';

export default function PaperCard({ paper }) {
  return (
    <div className="rounded-2xl p-5 card-shadow-lg text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #3FA9F5, #6C5CE7)' }}>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="relative">
        <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-3">
          <FileText size={22} />
        </div>
        <h3 className="font-display font-extrabold text-lg mb-1">{paper.title}</h3>
        <p className="text-[12.5px] font-medium opacity-90 mb-4">
          Generated {paper.generatedOn} · {paper.weakAreaWeight}% weak areas / {paper.normalWeight}% revision
        </p>
        <div className="flex flex-wrap gap-3 text-[12.5px] font-semibold">
          <span className="flex items-center gap-1"><ListChecks size={14} />{paper.questions} Questions</span>
          <span className="flex items-center gap-1"><Clock size={14} />{paper.minutes} Minutes</span>
          <span className="flex items-center gap-1"><Languages size={14} />3 Languages</span>
        </div>
        <span className="inline-block mt-3 bg-white/20 rounded-full px-3 py-1 text-[11px] font-bold">
          {paper.difficulty} · {paper.marks} marks
        </span>
      </div>
    </div>
  );
}
