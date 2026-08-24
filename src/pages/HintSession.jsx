import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';
import { HINT_SESSION } from '../data/tutorScripts';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';
import AppHeader from '../components/AppHeader';
import TutorBubble from '../components/TutorBubble';

const ANSWER_OPTIONS = ['1/2', '1', '4/8', '2'];

export default function HintSession() {
  const navigate = useNavigate();
  const { addXp } = useApp();
  const [hintsShown, setHintsShown] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);

  function pick(option) {
    setAnswered(true);
    if (option === '1') {
      setCorrect(true);
      addXp(HINT_SESSION.xp);
    }
  }

  return (
    <div className="pb-6 min-h-dvh flex flex-col">
      <AppHeader title="Guided Practice" />

      <div className="px-5 flex-1 flex flex-col gap-4 mt-2">
        <div className="bg-white rounded-2xl p-5 card-shadow-lg text-center">
          <p className="text-[11.5px] font-bold text-ink-soft mb-2">Solve together</p>
          <p className="font-display font-extrabold text-2xl text-ink">{HINT_SESSION.question}</p>
        </div>

        <TutorBubble text={HINT_SESSION.intro} />

        <AnimatePresence>
          {Array.from({ length: hintsShown }).map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <TutorBubble text={HINT_SESSION.hints[i]} />
            </motion.div>
          ))}
        </AnimatePresence>

        {hintsShown < HINT_SESSION.hints.length && !answered && (
          <button
            onClick={() => setHintsShown((h) => h + 1)}
            className="self-start ml-11 bg-primary-light text-primary-dark font-display font-bold text-[12.5px] rounded-full px-4 py-2"
          >
            Give me another hint
          </button>
        )}

        {hintsShown >= HINT_SESSION.hints.length && !answered && (
          <div className="mt-2">
            <p className="text-[12.5px] font-bold text-ink-soft mb-3 ml-1">Now you try it!</p>
            <div className="grid grid-cols-2 gap-3">
              {ANSWER_OPTIONS.map((opt) => (
                <motion.button
                  key={opt}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => pick(opt)}
                  className="bg-white rounded-2xl py-5 font-display font-extrabold text-xl card-shadow"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {answered && correct && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center mt-4"
          >
            <Mascot size={80} mood="excited" />
            <p className="font-display font-extrabold text-lg text-success mt-2 flex items-center gap-1.5">
              You solved it yourself! <PartyPopper size={18} />
            </p>
            <p className="text-[13px] font-bold text-ink-soft mt-1">+{HINT_SESSION.xp} XP</p>
            <button
              onClick={() => navigate('/home')}
              className="mt-5 bg-primary text-white font-display font-bold text-[13.5px] rounded-full px-8 py-3.5 active:scale-95 transition-transform"
            >
              Back to Home
            </button>
          </motion.div>
        )}

        {answered && !correct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
            <TutorBubble text="Almost! Remember — the denominators are already the same, so just add the numerators." />
            <button
              onClick={() => { setAnswered(false); }}
              className="self-start ml-11 mt-3 bg-primary text-white font-display font-bold text-[12.5px] rounded-full px-4 py-2"
            >
              Try again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
