import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coins, Flame, X, Sparkles } from 'lucide-react';
import { MINI_GAME_QUESTIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';

export default function MiniGame() {
  const navigate = useNavigate();
  const { addXp, addCoins } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const [wrongStreak, setWrongStreak] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [banner, setBanner] = useState(null); // 'harder' | 'easier' | 'confused'

  const question = MINI_GAME_QUESTIONS[qIndex % MINI_GAME_QUESTIONS.length];

  function choose(option) {
    if (status !== 'idle') return;
    setSelected(option);
    if (option === question.correct) {
      setStatus('correct');
      addXp(20);
      addCoins(10);
      const newStreak = correctStreak + 1;
      setCorrectStreak(newStreak);
      setWrongStreak(0);
      if (newStreak === 3) setBanner('harder');
    } else {
      setStatus('wrong');
      setHearts((h) => Math.max(0, h - 1));
      const newWrong = wrongStreak + 1;
      setWrongStreak(newWrong);
      setCorrectStreak(0);
      if (newWrong === 2) setBanner('confused');
      else if (newWrong === 3) setBanner('easier');
    }
  }

  function next() {
    setSelected(null);
    setStatus('idle');
    setBanner(null);
    setQIndex((i) => i + 1);
  }

  const progressPct = ((qIndex % MINI_GAME_QUESTIONS.length) / MINI_GAME_QUESTIONS.length) * 100;

  return (
    <div className="min-h-dvh flex flex-col pt-6 px-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white card-shadow flex items-center justify-center">
          <X size={17} />
        </button>
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <Heart key={i} size={18} className={i < hearts ? 'text-coral fill-coral' : 'text-cream-deep fill-cream-deep'} />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[12px] font-display font-bold text-ink">
          <Coins size={15} className="text-coin" />
          <span>240</span>
        </div>
      </div>

      <p className="text-[11.5px] font-bold text-ink-soft mb-1.5">Question {(qIndex % MINI_GAME_QUESTIONS.length) + 1} of {MINI_GAME_QUESTIONS.length}</p>
      <div className="w-full h-2.5 bg-cream-deep rounded-full overflow-hidden mb-1">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progressPct}%` }} />
      </div>
      {correctStreak > 1 && (
        <div className="flex items-center gap-1 text-[11px] font-bold text-orange mt-1">
          <Flame size={13} />
          <span>{correctStreak}x streak bonus</span>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className={`rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 ${
                banner === 'harder' ? 'bg-success-light' : banner === 'confused' ? 'bg-orange-light' : 'bg-primary-light'
              }`}
            >
              <Sparkles size={16} className={banner === 'harder' ? 'text-success mt-0.5' : banner === 'confused' ? 'text-orange mt-0.5' : 'text-primary mt-0.5'} />
              <div>
                <p className="font-display font-bold text-[12.5px] text-ink">
                  {banner === 'harder' && "You're doing great!"}
                  {banner === 'confused' && 'Want a little help?'}
                  {banner === 'easier' && "Let's make this easier"}
                </p>
                <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5">
                  {banner === 'harder' && "We've made the next challenge a little harder."}
                  {banner === 'confused' && 'This one looks tricky — Mindy can give you a hint.'}
                  {banner === 'easier' && "We'll practice one simpler example first."}
                </p>
                {banner === 'confused' && (
                  <button
                    onClick={() => navigate('/hint-session')}
                    className="mt-2 bg-orange text-white font-display font-bold text-[11.5px] rounded-full px-3.5 py-1.5"
                  >
                    Get a hint from Mindy
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-2xl p-6 card-shadow-lg text-center mb-6">
          <p className="text-[12.5px] font-bold text-ink-soft mb-2">{question.prompt}</p>
          <p className="font-display font-extrabold text-2xl text-ink">{question.display}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt) => {
            const isSelected = selected === opt;
            const isCorrectAnswer = opt === question.correct;
            let styleClass = 'bg-white text-ink card-shadow';
            if (status !== 'idle' && isSelected) {
              styleClass = status === 'correct' ? 'bg-success text-white' : 'bg-coral text-white';
            } else if (status === 'wrong' && isCorrectAnswer) {
              styleClass = 'bg-success-light text-success border-2 border-success';
            }
            return (
              <motion.button
                key={opt}
                whileTap={{ scale: 0.94 }}
                onClick={() => choose(opt)}
                disabled={status !== 'idle'}
                className={`rounded-2xl py-5 font-display font-extrabold text-xl transition-colors ${styleClass}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {status === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6"
            >
              <p className="font-display font-extrabold text-xl text-success">Amazing! +20 XP</p>
              <button onClick={next} className="mt-4 bg-success text-white font-display font-bold rounded-full px-8 py-3 active:scale-95 transition-transform">
                Next Question
              </button>
            </motion.div>
          )}
          {status === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <p className="font-display font-bold text-[15px] text-ink">Almost! Try looking at {question.hint.toLowerCase()}</p>
              <button
                onClick={() => { setSelected(null); setStatus('idle'); }}
                className="mt-4 bg-primary text-white font-display font-bold rounded-full px-8 py-3 active:scale-95 transition-transform"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
