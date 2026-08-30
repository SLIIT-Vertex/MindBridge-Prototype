import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, Check, Loader2, FileText, ScanLine, Sparkles } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import { PAPER_SCAN_RESULT } from '../data/mockData';

const STAGES = [
  { id: 'detect', label: 'All answer-sheet photos detected' },
  { id: 'recognize', label: 'Handwritten answers recognized' },
  { id: 'check', label: 'Answers checked with marking rubric' },
  { id: 'update', label: 'Skill dashboard updated' },
];

export default function PaperUpload() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | processing
  const [doneCount, setDoneCount] = useState(0);
  const [paperNumber, setPaperNumber] = useState('');
  const [showPaperError, setShowPaperError] = useState(false);

  function startUpload() {
    if (!paperNumber.trim()) {
      setShowPaperError(true);
      return;
    }
    setPhase('processing');
    setDoneCount(0);
    STAGES.forEach((_, i) => {
      setTimeout(() => setDoneCount(i + 1), 650 * (i + 1));
    });
    setTimeout(() => navigate('/paper-results'), 650 * STAGES.length + 500);
  }

  return (
    <div className="pb-6">
      <AppHeader title="Scan Your Answer Sheet" />

      <div className="px-5 mt-4">
        {phase === 'idle' && (
          <>
            <div className="bg-white rounded-2xl card-shadow-lg p-8 flex flex-col items-center text-center border-2 border-dashed border-cream-deep">
              <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                <ScanLine size={34} className="text-primary" strokeWidth={1.6} />
              </div>
              <p className="font-display font-bold text-[14.5px] text-ink mb-1">Upload the completed paper</p>
              <p className="text-[12px] font-semibold text-ink-soft leading-relaxed">
                Enter the paper number, then add clear photos of each handwritten page.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 card-shadow mt-4">
              <label htmlFor="paper-number" className="font-display font-bold text-[13.5px] text-ink mb-2 block">
                Paper Number
              </label>
              <input
                id="paper-number"
                value={paperNumber}
                onChange={(event) => {
                  setPaperNumber(event.target.value);
                  setShowPaperError(false);
                }}
                placeholder="Example: Week 34-MB-05"
                className="w-full bg-cream-deep rounded-xl px-4 py-3 text-[13px] font-semibold text-ink outline-none border border-transparent focus:border-primary"
              />
              {showPaperError && (
                <p className="text-[11px] font-bold text-coral mt-2">Please enter the paper number before uploading.</p>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 card-shadow mt-4">
              <p className="font-display font-bold text-[13.5px] text-ink mb-3">Expected Upload</p>
              <div className="grid grid-cols-2 gap-2.5">
                {PAPER_SCAN_RESULT.handwrittenPages.map((page) => (
                  <div key={page} className="bg-cream-deep rounded-xl p-3 flex items-center gap-2">
                    <FileText size={16} className="text-primary flex-shrink-0" />
                    <span className="text-[11.5px] font-bold text-ink-soft">{page}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={startUpload}
                className="flex-1 bg-primary text-white font-display font-bold text-[13.5px] rounded-2xl py-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <Camera size={20} />
                Take Photo
              </button>
              <button
                onClick={startUpload}
                className="flex-1 bg-white text-ink font-display font-bold text-[13.5px] rounded-2xl py-4 flex flex-col items-center gap-2 card-shadow active:scale-95 transition-transform"
              >
                <Image size={20} />
                Upload Image
              </button>
            </div>
          </>
        )}

        {phase === 'processing' && (
          <div className="bg-white rounded-2xl card-shadow-lg p-6 mt-2">
            <div className="flex flex-col items-center mb-6">
              <Loader2 size={36} className="text-primary animate-spin mb-3" />
              <p className="font-display font-bold text-[14.5px] text-ink">Scanning and marking...</p>
              <p className="text-[11.5px] font-semibold text-ink-soft mt-1">
                Paper {paperNumber} · {PAPER_SCAN_RESULT.recognizedAnswers} answers · {PAPER_SCAN_RESULT.confidence}% OCR confidence
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {STAGES.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {i < doneCount ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0"
                      >
                        <Check size={13} color="white" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <span key="empty" className="w-6 h-6 rounded-full bg-cream-deep flex-shrink-0" />
                    )}
                  </AnimatePresence>
                  <span className={`text-[13px] font-semibold ${i < doneCount ? 'text-ink' : 'text-ink-faint'}`}>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-primary-light rounded-xl p-3 mt-5 flex items-start gap-2.5">
              <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed">
                After marking, the weak-area scores feed back into next week's 70/30 paper generation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
