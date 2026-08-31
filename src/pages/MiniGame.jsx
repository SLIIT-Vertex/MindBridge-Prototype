import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Coins, Flame, X, Sparkles, PauseCircle } from 'lucide-react';

import { MINI_GAME_QUESTIONS } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { useLearnerState } from '../context/LearnerStateContext';
import { BEHAVIOR_EVENT_TYPES } from '../services/learner-state/behaviorFeatures';
import CameraStateIndicator from '../components/learner-state/CameraStateIndicator';
import SupportPrompt from '../components/learner-state/SupportPrompt';
import LearnerStateResearchPanel from '../components/learner-state/LearnerStateResearchPanel';
import LearnerStateResearchToggle from '../components/learner-state/LearnerStateResearchToggle';
import BreakSupportContent from '../components/BreakSupportContent';

/**
 * The learning session.
 *
 * This screen owns the ACTIVITY. It does not own the learner state: it emits
 * interaction events and renders whatever prompt the pipeline decided on. There
 * is no threshold, no probability and no state name anywhere in this file, which
 * is what keeps the child UI free of the research vocabulary.
 */
export default function MiniGame() {
  const navigate = useNavigate();
  const { addXp, addCoins } = useApp();
  const {
    startSession,
    stopSession,
    recordEvent,
    setActivityContext,
    activePrompt,
    resolvePrompt,
    derived,
  } = useLearnerState();

  const [qIndex, setQIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle');
  const [correctStreak, setCorrectStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptsOnItem, setAttemptsOnItem] = useState(0);
  const [banner, setBanner] = useState(null);
  const [showBreak, setShowBreak] = useState(false);

  const questionStartedAt = useRef(Date.now());
  const sessionStartedAt = useRef(Date.now());

  const question = MINI_GAME_QUESTIONS[qIndex];
  const supportMoments = derived.promptHistory.length;

  // Monitoring runs for exactly as long as this screen is mounted.
  useEffect(() => {
    startSession();
    return () => stopSession();
  }, [startSession, stopSession]);

  // Rolling context the pipeline reads from the Gamified Learning Module.
  useEffect(() => {
    setActivityContext({
      activityId: 'minigame-fractions',
      skillId: question?.id ?? null,
      recentAccuracy: qIndex === 0 ? null : correctAnswers / qIndex,
      taskCompletionRatio: qIndex / MINI_GAME_QUESTIONS.length,
    });
  }, [qIndex, correctAnswers, question, setActivityContext]);

  function choose(option) {
    if (status !== 'idle') return;

    const responseTimeSec = Math.max(1, Math.round((Date.now() - questionStartedAt.current) / 1000));
    const isCorrect = option === question.correct;
    const nextAttempts = attemptsOnItem + 1;

    setSelected(option);
    setAttemptsOnItem(nextAttempts);

    recordEvent({
      type: BEHAVIOR_EVENT_TYPES.ANSWER,
      itemId: question.id,
      isCorrect,
      responseTimeSec,
      attemptNumber: nextAttempts,
    });

    if (isCorrect) {
      setStatus('correct');
      setCorrectAnswers((value) => value + 1);
      addXp(20);
      addCoins(10);
      const nextCorrectStreak = correctStreak + 1;
      setCorrectStreak(nextCorrectStreak);
      if (nextCorrectStreak === 3) setBanner('harder');
    } else {
      setStatus('wrong');
      setHearts((value) => Math.max(0, value - 1));
      setCorrectStreak(0);
    }
  }

  function resetQuestion() {
    setSelected(null);
    setStatus('idle');
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
    setAttemptsOnItem(0);
    setQIndex((value) => value + 1);
    questionStartedAt.current = Date.now();
  }

  function skip() {
    recordEvent({ type: BEHAVIOR_EVENT_TYPES.SKIP, itemId: question.id });
    next();
  }

  function finishSession() {
    const learningMinutes = Math.max(1, Math.round((Date.now() - sessionStartedAt.current) / 60000));
    navigate('/session-summary', {
      state: {
        activitiesCompleted: qIndex + (status === 'correct' ? 1 : 0),
        correctAnswers,
        learningMinutes,
        supportMoments,
        interventions: derived.promptHistory,
        cameraMode: derived.effectiveCameraMode,
      },
    });
  }

  /**
   * Support actions. Hint and scaffold hand off to the AI Tutor component, which
   * owns the explanation; everything else is a request to the activity itself.
   */
  function handleSupportAction(action) {
    if (action === 'hint' || action === 'scaffold') {
      recordEvent({ type: BEHAVIOR_EVENT_TYPES.HINT, itemId: question.id });
      resolvePrompt(true);
      navigate('/hint-session', {
        state: { supportRequest: derived.latestRequest, supportType: action },
      });
      return;
    }

    if (action === 'break') {
      resolvePrompt(true);
      setShowBreak(true);
      return;
    }

    if (action === 'challenge') {
      resolvePrompt(true);
      setBanner('challenge');
      resetQuestion();
      return;
    }

    if (action === 'switch') {
      resolvePrompt(true);
      navigate('/learn');
      return;
    }

    // "Keep going", "Not yet", "I'll keep trying" — the offer was declined, and
    // declining is recorded because a declined offer is research evidence too.
    resolvePrompt(false);
  }

  const progressPct = (qIndex / MINI_GAME_QUESTIONS.length) * 100;
  const promptVisible = derived.hasPrompt;

  return (
    <div className="min-h-dvh flex flex-col pt-6 px-5 pb-24">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform"
          aria-label="Exit activity"
        >
          <X size={17} />
        </button>
        <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
          {[0, 1, 2].map((index) => (
            <Heart
              key={index}
              size={18}
              className={index < hearts ? 'text-coral fill-coral' : 'text-cream-deep fill-cream-deep'}
            />
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
        <button
          type="button"
          onClick={finishSession}
          className="text-[12px] font-display font-bold text-primary min-h-11 px-2 -mr-2 flex items-center"
        >
          Finish Session
        </button>
      </div>
      <div className="w-full h-2.5 bg-cream-deep rounded-full overflow-hidden">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progressPct}%` }} />
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 mb-1">
        <CameraStateIndicator mode={derived.effectiveCameraMode} audience="child" compact />
        {correctStreak > 1 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-orange">
            <Flame size={13} />
            <span>{correctStreak}x streak</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="popLayout">
          {promptVisible && (
            <div className="mb-4">
              <SupportPrompt
                supportType={activePrompt.supportType}
                onAction={handleSupportAction}
              />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {banner && !promptVisible && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-3.5 mb-4 flex items-start gap-2.5 ${
                banner === 'harder' ? 'bg-success-light' : 'bg-primary-light'
              }`}
            >
              <Sparkles
                size={16}
                className={banner === 'harder' ? 'text-success mt-0.5' : 'text-primary mt-0.5'}
              />
              <div>
                <p className="font-display font-bold text-[12.5px] text-ink">
                  {banner === 'harder' ? "You're doing great!" : 'Quick challenge!'}
                </p>
                <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5">
                  {banner === 'harder'
                    ? 'The next challenge is ready.'
                    : 'One quick question to get going again.'}
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
                disabled={status !== 'idle'}
                className={`rounded-2xl min-h-16 py-4 font-display font-extrabold text-xl transition-colors disabled:cursor-default ${styleClass}`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {status === 'correct' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6"
            >
              <p className="font-display font-extrabold text-xl text-success">Amazing! +20 XP</p>
              <button
                type="button"
                onClick={next}
                className="mt-4 bg-success text-white font-display font-bold rounded-full px-8 min-h-11 active:scale-95 transition-transform"
              >
                {qIndex === MINI_GAME_QUESTIONS.length - 1
                  ? 'View Session Summary'
                  : 'Next Question'}
              </button>
            </motion.div>
          )}
          {status === 'wrong' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <p className="font-display font-bold text-[15px] text-ink">Almost! Take another look.</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={resetQuestion}
                  className="bg-primary text-white font-display font-bold rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={skip}
                  className="bg-white text-ink-soft font-display font-bold text-[12.5px] rounded-full px-5 min-h-11 card-shadow active:scale-95 transition-transform"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {showBreak && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-cream overflow-y-auto">
          <div className="px-5 pt-6 flex items-center gap-2 text-ink-soft">
            <PauseCircle size={17} className="text-primary" aria-hidden="true" />
            <p className="font-display font-bold text-[13px]">Quick Learning Break</p>
          </div>
          <BreakSupportContent
            onContinue={() => {
              setShowBreak(false);
              resetQuestion();
            }}
          />
        </div>
      )}

      <LearnerStateResearchToggle placement="plain" />
      <LearnerStateResearchPanel />
    </div>
  );
}
