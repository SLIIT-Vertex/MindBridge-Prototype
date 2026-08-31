import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import Mascot from '../../components/Mascot';
import ProgressBar from '../../components/ProgressBar';
import PatternQuestion from '../../components/adaptive-learning/PatternQuestion';
import PatternOptions from '../../components/adaptive-learning/PatternOptions';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { INDEPENDENT_QUESTIONS } from '../../data/adaptive-learning/patternQuestions';
import { SUPPORT_STATUS } from '../../data/adaptive-learning/learningSupports';
import { GAME_WORLD } from '../../data/adaptive-learning/curriculum';
import { wrongFeedback } from '../../data/adaptive-learning/feedbackCopy';
import {
  DEMO_AUTO_ANSWER_DELAY_MS,
  getScriptedAttempt,
} from '../../data/adaptive-learning/demoScenario';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Independent Check — the second UNSUPPORTED measurement, framed as the Final
 * Gate so the temple narrative holds over a parallel-forms post-test.
 *
 * The no-support condition is structural: no *Support* component is imported
 * here, there is no hint or retry, and the reducer refuses this phase while
 * support is active, so the page withdraws support before entering.
 * As in the baseline, the score is never shown to the child.
 */

const TOTAL = INDEPENDENT_QUESTIONS.length;
const FINAL_GATE = GAME_WORLD.gates[GAME_WORLD.gates.length - 1];

export default function IndependentCheck() {
  const navigate = useNavigate();
  const {
    phase,
    goToPhase,
    jumpToPhase,
    answerQuestion,
    setSupportStatus,
    supportStatus,
    demoScenarioEnabled,
  } = useAdaptive();

  const [step, setStep] = useState('intro');
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);

  const questionStartedAt = useRef(0);
  const question = INDEPENDENT_QUESTIONS[index];

  // Support must be down before this phase is legal. A presenter jumping
  // straight here from the drawer can arrive with it still active.
  useEffect(() => {
    if (supportStatus === SUPPORT_STATUS.ACTIVE) setSupportStatus(SUPPORT_STATUS.REMOVED);
  }, [supportStatus, setSupportStatus]);

  useEffect(() => {
    if (supportStatus === SUPPORT_STATUS.ACTIVE) return;
    if (hasReachedPhase(phase, 'INDEPENDENT_CHECK')) return;
    if (hasReachedPhase(phase, 'SUPPORT_WITHDRAWN')) goToPhase('INDEPENDENT_CHECK');
    else jumpToPhase('INDEPENDENT_CHECK');
  }, [phase, supportStatus, goToPhase, jumpToPhase]);

  const submit = useCallback(
    (optionId) => {
      if (status !== 'idle') return;

      const scripted = demoScenarioEnabled ? getScriptedAttempt(question.id, 1) : null;
      const startedAt = questionStartedAt.current || Date.now();
      const responseTimeMs = scripted ? scripted.responseTimeMs : Date.now() - startedAt;

      answerQuestion({ question, optionId, responseTimeMs });

      setSelectedId(optionId);
      setStatus(optionId === question.correctOption ? 'correct' : 'wrong');
    },
    [answerQuestion, demoScenarioEnabled, question, status]
  );

  useEffect(() => {
    if (step !== 'playing' || status !== 'idle' || !demoScenarioEnabled) return undefined;

    const scripted = getScriptedAttempt(question.id, 1);
    if (!scripted) return undefined;

    const timer = setTimeout(() => submit(scripted.optionId), DEMO_AUTO_ANSWER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, status, demoScenarioEnabled, question.id, submit]);

  const advance = () => {
    if (index + 1 >= TOTAL) {
      setStep('done');
      return;
    }
    setIndex(index + 1);
    setStatus('idle');
    setSelectedId(null);
    questionStartedAt.current = Date.now();
  };

  const seeResult = () => {
    goToPhase('RESULT');
    navigate('/learn/result');
  };

  const answered = status === 'idle' ? index : index + 1;

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-6 px-5 pb-24">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate('/learn/pattern-sequence')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          aria-label="Leave the Pattern Temple"
        >
          <X size={17} className="text-ink" aria-hidden="true" />
        </button>
        <p className="font-display font-bold text-[13.5px] text-ink">Pattern Temple</p>
        <div className="w-11 flex-shrink-0" />
      </div>

      {step !== 'intro' && (
        <>
          <div className="flex items-end justify-between gap-3 mb-1.5">
            <p className="text-[11.5px] font-bold text-ink-soft">
              {step === 'done'
                ? `Gate ${FINAL_GATE.index} complete`
                : `Gate ${FINAL_GATE.index} · Puzzle ${index + 1} of ${TOTAL}`}
            </p>
            {step === 'playing' && (
              <p className="text-[11px] font-semibold text-ink-faint">On your own</p>
            )}
          </div>
          <ProgressBar pct={(answered / TOTAL) * 100} height={10} />
        </>
      )}

      <div className="flex-1 flex flex-col justify-center py-6">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">
                <Mascot size={104} mood="happy" />
              </div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-primary">
                Gate {FINAL_GATE.index}
              </p>
              <h1 className="font-display font-extrabold text-2xl text-ink leading-tight mt-1">
                {FINAL_GATE.label}
              </h1>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2.5 px-2">
                Three new puzzles, and the help stays off this time. You already know the rule —
                give them your best try.
              </p>
              <button
                type="button"
                onClick={() => {
                  questionStartedAt.current = Date.now();
                  setStep('playing');
                }}
                className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-7"
              >
                I'm ready
              </button>
            </motion.div>
          )}

          {step === 'playing' && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <PatternQuestion question={question} />

              <div className="mt-7">
                <PatternOptions
                  question={question}
                  status={status}
                  selectedId={selectedId}
                  onSelect={submit}
                />
              </div>

              <AnimatePresence>
                {status !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6"
                  >
                    <p
                      className={`font-display font-bold text-[14px] ${
                        status === 'correct' ? 'text-success' : 'text-ink'
                      }`}
                    >
                      {status === 'correct'
                        ? 'You solved that one on your own.'
                        : wrongFeedback(question)}
                    </p>
                    <button
                      type="button"
                      onClick={advance}
                      className="mt-4 bg-primary text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                    >
                      {index + 1 >= TOTAL ? 'Finish' : 'Next puzzle'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">
                <Mascot size={104} mood="excited" />
              </div>
              <h2 className="font-display font-extrabold text-xl text-ink leading-tight">
                The Final Gate is open
              </h2>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2.5 px-2">
                You solved these without any help on screen. Let's see how far you have come.
              </p>
              <button
                type="button"
                onClick={seeResult}
                className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-7"
              >
                See how you did
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}
