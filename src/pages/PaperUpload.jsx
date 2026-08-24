import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image, Check, Loader2 } from 'lucide-react';
import AppHeader from '../components/AppHeader';

const STAGES = [
  { id: 'detect', label: 'Image detected' },
  { id: 'recognize', label: 'Answers recognized' },
  { id: 'check', label: 'Checking answers' },
  { id: 'update', label: 'Updating learning profile' },
];

export default function PaperUpload() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('idle'); // idle | processing
  const [doneCount, setDoneCount] = useState(0);

  function startUpload() {
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
                <Camera size={34} className="text-primary" strokeWidth={1.6} />
              </div>
              <p className="font-display font-bold text-[14.5px] text-ink mb-1">Add your answer sheet</p>
              <p className="text-[12px] font-semibold text-ink-soft">A parent or guardian can help with this step</p>
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
              <p className="font-display font-bold text-[14.5px] text-ink">Reading your answers...</p>
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
          </div>
        )}
      </div>
    </div>
  );
}
