import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Coins, Sparkles, Star, X } from 'lucide-react';

import Mascot from '../../components/Mascot';
import AvatarIcon from '../../components/AvatarIcon';
import ProgressBar from '../../components/ProgressBar';
import PatternQuestion from '../../components/adaptive-learning/PatternQuestion';
import PatternOptions from '../../components/adaptive-learning/PatternOptions';
import TempleScene from '../../components/adaptive-learning/scene/TempleScene';
import TempleGate from '../../components/adaptive-learning/scene/TempleGate';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useApp } from '../../context/AppContext';
import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { AVATARS } from '../../data/mockData';
import { GAME_WORLD } from '../../data/adaptive-learning/curriculum';
import { GAMEPLAY_QUESTIONS } from '../../data/adaptive-learning/patternQuestions';
import { wrongFeedback } from '../../data/adaptive-learning/feedbackCopy';
import {
  DEMO_AUTO_ANSWER_DELAY_MS,
  getScriptedAttempt,
} from '../../data/adaptive-learning/demoScenario';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Pattern Temple — the gamified practice activity. Gates 1 and 2 are playable
 * here; Gate 3 is the Independent Check and stays locked, so no support component
 * is imported. Retry is allowed, unlike the baseline, so the repeat-attempt
 * signal can fire. Child-facing copy never names a probability or an algorithm.
 */

const XP_PER_CORRECT = 20;
const GATE_COUNT = GAME_WORLD.gates.length;

function starsForAttempts(attemptNumber) {
  if (attemptNumber <= 1) return 3;
  if (attemptNumber === 2) return 2;
  return 1;
}

function gateVisualState(gateIndex, { currentGate, openedGates }) {
  if (openedGates.includes(gateIndex)) return 'open';
  if (gateIndex === currentGate) return 'active';
  return 'locked';
}

export default function PatternTemple() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { xp, coins, addXp, avatarId } = useApp();
  const {
    phase,
    goToPhase,
    jumpToPhase,
    answerQuestion,
    demoScenarioEnabled,
    difficulty,
    attemptsByQuestion,
  } = useAdaptive();

  const avatar = AVATARS.find((entry) => entry.id === avatarId) || AVATARS[0];

  const [gateIndex, setGateIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);
  const [step, setStep] = useState('playing');
  const [openedGates, setOpenedGates] = useState([]);
  const [gateStars, setGateStars] = useState({ 1: 0, 2: 0, 3: 0 });
  const [awardedXp, setAwardedXp] = useState(0);

  const questionStartedAt = useRef(0);
  const question = GAMEPLAY_QUESTIONS[gateIndex];
  const currentGate = question?.gate ?? 1;
  const nextAttempt = (attemptsByQuestion[question?.id] ?? 0) + 1;

  useEffect(() => {
    if (hasReachedPhase(phase, 'GAMEPLAY')) return;
    if (hasReachedPhase(phase, 'BASELINE')) goToPhase('GAMEPLAY');
    else jumpToPhase('GAMEPLAY');
  }, [phase, goToPhase, jumpToPhase]);

  useEffect(() => {
    if (questionStartedAt.current === 0) {
      questionStartedAt.current = Date.now();
    }
  }, []);

  const submit = useCallback(
    (optionId) => {
      if (status !== 'idle' || !question) return;

      const scripted = demoScenarioEnabled
        ? getScriptedAttempt(question.id, nextAttempt)
        : null;
      const startedAt = questionStartedAt.current || Date.now();
      const responseTimeMs = scripted ? scripted.responseTimeMs : Date.now() - startedAt;
      const isCorrect = optionId === question.correctOption;

      answerQuestion({ question, optionId, responseTimeMs });

      setSelectedId(optionId);
      setStatus(isCorrect ? 'correct' : 'wrong');

      if (isCorrect) {
        addXp(XP_PER_CORRECT);
        setAwardedXp((prev) => prev + XP_PER_CORRECT);
        setOpenedGates((prev) =>
          prev.includes(question.gate) ? prev : [...prev, question.gate]
        );
        setGateStars((prev) => ({ ...prev, [question.gate]: starsForAttempts(nextAttempt) }));
        setStep('celebrating');
      }
    },
    [addXp, answerQuestion, demoScenarioEnabled, nextAttempt, question, status]
  );

  useEffect(() => {
    if (step !== 'playing' || status !== 'idle' || !demoScenarioEnabled || !question) {
      return undefined;
    }

    const scripted = getScriptedAttempt(question.id, nextAttempt);
    if (!scripted) return undefined;

    const timer = setTimeout(() => submit(scripted.optionId), DEMO_AUTO_ANSWER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [demoScenarioEnabled, nextAttempt, question, status, step, submit]);

  // Hold the wrong-answer highlight briefly so the child sees the miss before the
  // "this one is tricky" card replaces it.
  useEffect(() => {
    if (step === 'difficulty') return undefined;
    if (!difficulty.detected || status !== 'wrong') return undefined;

    const timer = setTimeout(() => setStep('difficulty'), reduceMotion ? 0 : 650);
    return () => clearTimeout(timer);
  }, [difficulty.detected, reduceMotion, status, step]);

  const tryAgain = () => {
    setStatus('idle');
    setSelectedId(null);
    questionStartedAt.current = Date.now();
  };

  const goNextGate = () => {
    if (gateIndex + 1 >= GAMEPLAY_QUESTIONS.length) return;
    setGateIndex(gateIndex + 1);
    setStatus('idle');
    setSelectedId(null);
    setStep('playing');
    questionStartedAt.current = Date.now();
  };

  const showMe = () => {
    goToPhase('MISCONCEPTION_UPDATED');
    navigate('/learn/support');
  };

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-6 px-5 pb-24">
      <div className="flex items-center justify-between gap-3 mb-3">
        <button
          type="button"
          onClick={() => navigate('/learn/pattern-sequence')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          aria-label="Leave the Pattern Temple"
        >
          <X size={17} className="text-ink" aria-hidden="true" />
        </button>

        <p className="font-display font-bold text-[13.5px] text-ink">Pattern Temple</p>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="inline-flex items-center gap-1 text-[12px] font-display font-bold text-ink"
            aria-label={`${xp} experience points`}
          >
            <Sparkles size={14} className="text-primary" aria-hidden="true" />
            {xp}
          </span>
          <span
            className="inline-flex items-center gap-1 text-[12px] font-display font-bold text-ink"
            aria-label={`${coins} coins`}
          >
            <Coins size={14} className="text-coin" aria-hidden="true" />
            {coins}
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 mb-1.5">
        <p className="text-[11.5px] font-bold text-ink-soft">
          Gate {currentGate} of {GATE_COUNT}
        </p>
        {awardedXp > 0 ? (
          <p className="text-[11px] font-semibold text-primary">+{awardedXp} XP this visit</p>
        ) : (
          <p className="text-[11px] font-semibold text-ink-faint">{question?.gateLabel}</p>
        )}
      </div>
      <ProgressBar pct={(currentGate / GATE_COUNT) * 100} height={10} />

      <div className="mt-3 mb-4 rounded-2xl overflow-hidden card-shadow">
        <TempleScene height={188}>
          <div className="absolute inset-0 flex items-end justify-around px-2 pb-1.5">
            {GAME_WORLD.gates.map((gate) => {
              const state = gateVisualState(gate.index, { currentGate, openedGates });
              const showAvatar = gate.index === currentGate && step !== 'celebrating';
              const stars = gateStars[gate.index] ?? 0;

              return (
                <div key={gate.index} className="flex flex-col items-center">
                  <TempleGate state={state} label={gate.label} index={gate.index} />
                  <div className="h-8 flex flex-col items-center justify-end gap-0.5 mt-0.5">
                    {stars > 0 ? (
                      <div className="flex gap-0.5" aria-label={`${stars} of 3 stars`}>
                        {[0, 1, 2].map((slot) => (
                          <Star
                            key={slot}
                            size={10}
                            className={
                              slot < stars
                                ? 'text-coin fill-coin'
                                : 'text-cream-deep fill-cream-deep'
                            }
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    ) : null}
                    <AnimatePresence>
                      {showAvatar ? (
                        <motion.div
                          layoutId="temple-avatar"
                          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0 }}
                        >
                          <AvatarIcon variant={avatar.emoji} size={28} />
                        </motion.div>
                      ) : (
                        <span className="h-7" aria-hidden="true" />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </TempleScene>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {step === 'difficulty' ? (
            <motion.div
              key="difficulty"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              className="bg-orange-light rounded-2xl px-4 py-5 text-center"
            >
              <div className="flex justify-center mb-1">
                <Mascot size={96} mood="thinking" />
              </div>
              <h2 className="font-display font-extrabold text-xl text-ink leading-tight">
                This one is tricky.
              </h2>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2 px-1">
                Let's look at the pattern in another way.
              </p>
              <button
                type="button"
                onClick={showMe}
                className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-5"
              >
                Show me
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={question.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
            >
              <PatternQuestion question={question} />

              <div className="mt-6">
                <PatternOptions
                  question={question}
                  status={status}
                  selectedId={selectedId}
                  onSelect={submit}
                />
              </div>

              <AnimatePresence>
                {status === 'correct' && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center mt-5"
                  >
                    <p className="font-display font-extrabold text-xl text-success">
                      The gate opened! +{XP_PER_CORRECT} XP
                    </p>
                    {gateIndex + 1 < GAMEPLAY_QUESTIONS.length ? (
                      <button
                        type="button"
                        onClick={goNextGate}
                        className="mt-4 bg-success text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                      >
                        Next gate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/learn/pattern-sequence')}
                        className="mt-4 bg-success text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                      >
                        Back to the mission
                      </button>
                    )}
                  </motion.div>
                )}

                {status === 'wrong' && !difficulty.detected && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-5"
                  >
                    <p className="font-display font-bold text-[14px] text-ink">
                      {wrongFeedback(question)}
                    </p>
                    <button
                      type="button"
                      onClick={tryAgain}
                      className="mt-4 bg-primary text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}
