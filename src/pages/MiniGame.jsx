import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coins, Flame, X, Sparkles, PauseCircle } from 'lucide-react';
import { MINI_GAME_QUESTIONS } from '../data/mockData';
import { LEARNER_STATES } from '../data/learnerStateMockData';
import { estimateLearnerState, simulateLearnerState } from '../services/learnerStateService';
import { useApp } from '../context/AppContext';
import LearnerSupportStatus from '../components/LearnerSupportStatus';
import DemoStateControls from '../components/DemoStateControls';
import StateSupportCard from '../components/StateSupportCard';
import BreakSupportContent from '../components/BreakSupportContent';

export default function MiniGame() {
  const navigate = useNavigate();
  const { addXp, addCoins, learnerState, setLearnerState, visualSupport } = useApp();
  const [qIndex, setQIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');
  const [wrongStreak, setWrongStreak] = useState(0);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [supportMoments, setSupportMoments] = useState(0);
  const [banner, setBanner] = useState(null);
  const [showSupport, setShowSupport] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [detection, setDetection] = useState(() => simulateLearnerState('engaged', visualSupport));
  const questionStartedAt = useRef(Date.now());
  const sessionStartedAt = useRef(Date.now());

  const question = MINI_GAME_QUESTIONS[qIndex];
  const statePresentation = LEARNER_STATES[detection.state] || LEARNER_STATES.engaged;
  const supportContent = {
    dotColor: statePresentation.tone,
    title: statePresentation.title,
    body: statePresentation.body,
    actions: statePresentation.actions,
  };

  useEffect(() => {
    if (status !== 'idle' || showSupport || showBreak) return undefined;

    const inactivityTimer = window.setTimeout(() => {
      const nextDetection = estimateLearnerState({
        responseTime: 24,
        incorrectAttempts: wrongStreak,
        repeatedAttempts: wrongStreak,
        inactivitySeconds: 24,
        recentAccuracy: qIndex === 0 ? 1 : correctAnswers / qIndex,
        visualSignals: visualSupport ? { eyeClosure: true, possibleYawn: true, gazeChange: true } : {},
        cameraEnabled: visualSupport,
      });
      setDetection(nextDetection);
      setLearnerState(nextDetection.state);
      setShowSupport(true);
      setSupportMoments((value) => value + 1);
    }, 22000);

    return () => window.clearTimeout(inactivityTimer);
  }, [correctAnswers, qIndex, setLearnerState, showBreak, showSupport, status, visualSupport, wrongStreak]);

  function updateDetection(nextDetection, revealSupport = true) {
    setDetection(nextDetection);
    setLearnerState(nextDetection.state);
    if (revealSupport && nextDetection.state !== 'engaged') {
      setShowSupport(true);
      setSupportMoments((value) => value + 1);
    }
  }

  function choose(option) {
    if (status !== 'idle' || showSupport) return;

    const responseTime = Math.max(1, Math.round((Date.now() - questionStartedAt.current) / 1000));
    const isCorrect = option === question.correct;
    const nextWrongStreak = isCorrect ? 0 : wrongStreak + 1;
    const answeredCount = qIndex + 1;
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);

    setSelected(option);

    if (isCorrect) {
      setStatus('correct');
      setCorrectAnswers(nextCorrectAnswers);
      addXp(20);
      addCoins(10);
      const nextCorrectStreak = correctStreak + 1;
      setCorrectStreak(nextCorrectStreak);
      setWrongStreak(0);
      if (nextCorrectStreak === 3) setBanner('harder');
    } else {
      setStatus('wrong');
      setHearts((value) => Math.max(0, value - 1));
      setWrongStreak(nextWrongStreak);
      setCorrectStreak(0);
    }

    const nextDetection = estimateLearnerState({
      responseTime,
      incorrectAttempts: nextWrongStreak,
      repeatedAttempts: nextWrongStreak,
      inactivitySeconds: 0,
      recentAccuracy: nextCorrectAnswers / answeredCount,
      rapidAnswers: responseTime <= 4 && nextWrongStreak >= 2,
      visualSignals: visualSupport
        ? { gazeChange: !isCorrect, headPoseChange: nextWrongStreak >= 2, eyeClosure: false, possibleYawn: false }
        : {},
      cameraEnabled: visualSupport,
    });

    updateDetection(nextDetection, !isCorrect && nextWrongStreak >= 2);
  }

  function resetQuestion() {
    setSelected(null);
    setStatus('idle');
    setShowSupport(false);
    questionStartedAt.current = Date.now();
  }

  function next() {
    if (qIndex === MINI_GAME_QUESTIONS.length - 1) {
      finishSession();
      return;
    }
    setSelected(null);
    setStatus('idle');
    setBanner(null);
    setShowSupport(false);
    setQIndex((value) => value + 1);
    questionStartedAt.current = Date.now();
  }

  function finishSession() {
    const learningMinutes = Math.max(1, Math.round((Date.now() - sessionStartedAt.current) / 60000));
    navigate('/session-summary', {
      state: {
        activitiesCompleted: qIndex + (status === 'correct' ? 1 : 0),
        correctAnswers,
        learningMinutes,
        supportMoments,
      },
    });
  }

  function simulate(state) {
    const nextDetection = simulateLearnerState(state, visualSupport);
    updateDetection(nextDetection, state !== 'engaged');
    if (state === 'engaged') setShowSupport(false);
  }

  function handleSupportAction(action) {
    if (action === 'help') {
      navigate('/hint-session');
      return;
    }
    if (action === 'pause' || action === 'break' || action === 'water') {
      setShowSupport(false);
      setShowBreak(true);
      return;
    }
    if (action === 'easier') setBanner('easier');
    setLearnerState('engaged');
    setDetection(simulateLearnerState('engaged', visualSupport));
    resetQuestion();
  }

  const progressPct = (qIndex / MINI_GAME_QUESTIONS.length) * 100;

  return (
    <div className="min-h-dvh flex flex-col pt-6 px-5 pb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="w-10 h-10 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Exit activity"
        >
          <X size={17} />
        </button>
        <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
          {[0, 1, 2].map((index) => (
            <Heart key={index} size={18} className={index < hearts ? 'text-coral fill-coral' : 'text-cream-deep fill-cream-deep'} />
          ))}
        </div>
        <div className="flex items-center gap-1 text-[12px] font-display font-bold text-ink">
          <Coins size={15} className="text-coin" />
          <span>240</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 mb-1.5">
        <p className="text-[11.5px] font-bold text-ink-soft">
          Question {qIndex + 1} of {MINI_GAME_QUESTIONS.length}
        </p>
        <button type="button" onClick={finishSession} className="text-[10.5px] font-display font-bold text-primary py-1">
          Finish Session
        </button>
      </div>
      <div className="w-full h-2.5 bg-cream-deep rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 mb-3">
        <LearnerSupportStatus cameraEnabled={visualSupport} compact />
        {correctStreak > 1 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-orange">
            <Flame size={13} />
            <span>{correctStreak}x streak</span>
          </div>
        )}
      </div>

      <DemoStateControls activeState={learnerState} onSimulate={simulate} />

      <div className="flex-1 flex flex-col justify-center py-5">
        <AnimatePresence mode="popLayout">
          {showSupport && (
            <div className="mb-4">
              <StateSupportCard content={supportContent} onAction={handleSupportAction} />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {banner && !showSupport && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 ${banner === 'harder' ? 'bg-success-light' : 'bg-primary-light'}`}
            >
              <Sparkles size={16} className={banner === 'harder' ? 'text-success mt-0.5' : 'text-primary mt-0.5'} />
              <div>
                <p className="font-display font-bold text-[12.5px] text-ink">
                  {banner === 'harder' ? "You're doing great!" : "Let's try an easier step"}
                </p>
                <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5">
                  {banner === 'harder' ? 'The next challenge is ready.' : 'Take your time with this example.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-2xl p-6 card-shadow-lg text-center mb-6">
          <p className="text-[12.5px] font-bold text-ink-soft mb-2">{question.prompt}</p>
          <p className="font-display font-extrabold text-2xl text-ink">{question.display}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.options.map((option) => {
            const isSelected = selected === option;
            const isCorrectAnswer = option === question.correct;
            let styleClass = 'bg-white text-ink card-shadow';
            if (status !== 'idle' && isSelected) {
              styleClass = status === 'correct' ? 'bg-success text-white' : 'bg-coral text-white';
            } else if (status === 'wrong' && isCorrectAnswer) {
              styleClass = 'bg-success-light text-success border-2 border-success';
            }
            return (
              <motion.button
                key={option}
                whileTap={{ scale: 0.94 }}
                onClick={() => choose(option)}
                disabled={status !== 'idle' || showSupport}
                className={`rounded-2xl min-h-16 py-4 font-display font-extrabold text-xl transition-colors disabled:cursor-default ${styleClass}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {status === 'correct' && !showSupport && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mt-6">
              <p className="font-display font-extrabold text-xl text-success">Amazing! +20 XP</p>
              <button
                type="button"
                onClick={next}
                className="mt-4 bg-success text-white font-display font-bold rounded-full px-8 min-h-11 active:scale-95 transition-transform"
              >
                {qIndex === MINI_GAME_QUESTIONS.length - 1 ? 'View Session Summary' : 'Next Question'}
              </button>
            </motion.div>
          )}
          {status === 'wrong' && !showSupport && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
              <p className="font-display font-bold text-[15px] text-ink">Almost! Take another look.</p>
              <button
                type="button"
                onClick={resetQuestion}
                className="mt-4 bg-primary text-white font-display font-bold rounded-full px-8 min-h-11 active:scale-95 transition-transform"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showBreak && (
        <div className="fixed inset-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-cream overflow-y-auto">
          <div className="px-5 pt-6 flex items-center gap-2 text-ink-soft">
            <PauseCircle size={17} className="text-primary" />
            <p className="font-display font-bold text-[13px]">Quick Learning Break</p>
          </div>
          <BreakSupportContent
            onContinue={() => {
              setShowBreak(false);
              setLearnerState('engaged');
              setDetection(simulateLearnerState('engaged', visualSupport));
              resetQuestion();
            }}
          />
        </div>
      )}
    </div>
  );
}
