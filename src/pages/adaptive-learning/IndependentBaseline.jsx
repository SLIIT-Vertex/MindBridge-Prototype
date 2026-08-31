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
import { BASELINE_QUESTIONS } from '../../data/adaptive-learning/patternQuestions';
import { wrongFeedback } from '../../data/adaptive-learning/feedbackCopy';
import {
  DEMO_AUTO_ANSWER_DELAY_MS,
  getScriptedAttempt,
} from '../../data/adaptive-learning/demoScenario';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Independent Baseline — child-facing name "Temple Entry Challenge".
 *
 * The UNSUPPORTED MEASUREMENT CONDITION: no hint, no support affordance and no
 * retry, since any of those would contaminate Unsupported Before. Nothing from
 * components/adaptive-learning/*Support* is imported here, and nothing should be.
 * The score is a research figure and is never shown to the child.
 */

const TOTAL = BASELINE_QUESTIONS.length;

export default function IndependentBaseline() {
  const navigate = useNavigate();
  const { phase, goToPhase, jumpToPhase, answerQuestion, demoScenarioEnabled } = useAdaptive();

  const [step, setStep] = useState('intro');
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);

  // Seeded when the first item is shown, so nothing reads the clock during render.
  const questionStartedAt = useRef(0);

  const question = BASELINE_QUESTIONS[index];

  // A direct URL or a presenter jump can land here from beyond the one step the
  // phase guard allows, so that case is forced.
  useEffect(() => {
    if (hasReachedPhase(phase, 'BASELINE')) return;
    if (hasReachedPhase(phase, 'SKILL_OVERVIEW')) goToPhase('BASELINE');
    else jumpToPhase('BASELINE');
  }, [phase, goToPhase, jumpToPhase]);

  const submit = useCallback(
    (optionId) => {
      if (status !== 'idle') return;

      // Under the demo scenario the response time is injected rather than
      // measured, so it does not include however long the presenter talks.
      const scripted = demoScenarioEnabled ? getScriptedAttempt(question.id, 1) : null;
      const startedAt = questionStartedAt.current || Date.now();
      const responseTimeMs = scripted ? scripted.responseTimeMs : Date.now() - startedAt;

      answerQuestion({ question, optionId, responseTimeMs });

      setSelectedId(optionId);
      setStatus(optionId === question.correctOption ? 'correct' : 'wrong');
    },
    [answerQuestion, demoScenarioEnabled, question, status]
  );

  // Auto-answers only if nobody taps first, keeping an untouched run reproducible.
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

  const enterTemple = () => {
    goToPhase('GAMEPLAY');
    navigate('/learn/temple');
  };

  const answered = status === 'idle' ? index : index + 1;

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-6 px-5 pb-24">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate('/learn/pattern-sequence')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          aria-label="Leave the challenge"
        >
          <X size={17} className="text-ink" aria-hidden="true" />
        </button>
        <p className="font-display font-bold text-[13.5px] text-ink">Temple Entry Challenge</p>
        <div className="w-11 flex-shrink-0" />
      </div>

      {step !== 'intro' && (
        <>
          <div className="flex items-end justify-between gap-3 mb-1.5">
            <p className="text-[11.5px] font-bold text-ink-soft">
              {step === 'done' ? 'All gates attempted' : `Gate ${index + 1} of ${TOTAL}`}
            </p>
            {step === 'playing' && (
              <p className="text-[11px] font-semibold text-ink-faint">No hints</p>
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
              <h1 className="font-display font-extrabold text-2xl text-ink leading-tight">
                Temple Entry Challenge
              </h1>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2.5 px-2">
                Solve these three gates by yourself. No hints yet — just give them your best try.
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
                        ? 'Nice work — that one is solved.'
                        : wrongFeedback(question)}
                    </p>
                    <button
                      type="button"
                      onClick={advance}
                      className="mt-4 bg-primary text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                    >
                      {index + 1 >= TOTAL ? 'Finish' : 'Next gate'}
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
                You tried every gate on your own
              </h2>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2.5 px-2">
                That is exactly what we needed. The Pattern Temple is open — let's go inside.
              </p>
              <button
                type="button"
                onClick={enterTemple}
                className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-7"
              >
                Enter the Pattern Temple
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
