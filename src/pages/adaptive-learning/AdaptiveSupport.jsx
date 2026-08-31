import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

import Mascot from '../../components/Mascot';
import PatternQuestion from '../../components/adaptive-learning/PatternQuestion';
import PatternOptions from '../../components/adaptive-learning/PatternOptions';
import VisualRotationSupport from '../../components/adaptive-learning/VisualRotationSupport';
import GuidedReasoningSupport from '../../components/adaptive-learning/GuidedReasoningSupport';
import WorkedExampleSupport from '../../components/adaptive-learning/WorkedExampleSupport';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { SUPPORTED_QUESTIONS } from '../../data/adaptive-learning/patternQuestions';
import { SUPPORT_IDS, SUPPORT_STATUS } from '../../data/adaptive-learning/learningSupports';
import {
  DEMO_AUTO_ANSWER_DELAY_MS,
  getScriptedAttempt,
} from '../../data/adaptive-learning/demoScenario';
import { hasReachedPhase } from '../../services/adaptive-learning/phaseMachine';

/**
 * Adaptive Support — four in-page steps so the child never loses the temple
 * narrative: select, deliver, supported practice, withdraw. The page renders
 * whichever support was selected; the comparison table is Research View only.
 */

const QUESTION = SUPPORTED_QUESTIONS[0];
const SELECT_HOLD_MS = 1600;
const WITHDRAW_MS = 600;

const SUPPORT_COMPONENTS = {
  [SUPPORT_IDS.VISUAL_ROTATION]: VisualRotationSupport,
  [SUPPORT_IDS.GUIDED_REASONING]: GuidedReasoningSupport,
  [SUPPORT_IDS.WORKED_EXAMPLE]: WorkedExampleSupport,
};

function initialStage(phase) {
  if (hasReachedPhase(phase, 'SUPPORT_WITHDRAWN')) return 'withdrawing';
  if (hasReachedPhase(phase, 'SUPPORTED_PRACTICE')) return 'practicing';
  if (hasReachedPhase(phase, 'SUPPORT_ACTIVE')) return 'delivering';
  return 'selecting';
}

export default function AdaptiveSupport() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const {
    phase,
    goToPhase,
    jumpToPhase,
    chooseSupport,
    setSupportStatus,
    answerQuestion,
    selectedSupport,
    supportStatus,
    demoScenarioEnabled,
  } = useAdaptive();

  const [stage, setStage] = useState(() => initialStage(phase));
  const [replayOpen, setReplayOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [selectedId, setSelectedId] = useState(null);
  const questionStartedAt = useRef(0);
  const lastSupportId = useRef(selectedSupport?.id);

  // Direct URL or a presenter jump can land here from far away.
  useEffect(() => {
    if (hasReachedPhase(phase, 'MISCONCEPTION_UPDATED')) return;
    if (hasReachedPhase(phase, 'DIFFICULTY_DETECTED')) goToPhase('MISCONCEPTION_UPDATED');
    else jumpToPhase('MISCONCEPTION_UPDATED');
  }, [phase, goToPhase, jumpToPhase]);

  // Pick the highest predicted-IG support once beliefs exist.
  useEffect(() => {
    if (!selectedSupport) chooseSupport();
  }, [selectedSupport, chooseSupport]);

  useEffect(() => {
    if (phase === 'MISCONCEPTION_UPDATED' && selectedSupport) {
      goToPhase('SUPPORT_SELECTED');
    }
  }, [phase, selectedSupport, goToPhase]);

  // Presenter can force a different support from the Research drawer. Swap the
  // delivered component without sending the child back through selection.
  useEffect(() => {
    const nextId = selectedSupport?.id;
    if (!nextId) return;
    if (lastSupportId.current && lastSupportId.current !== nextId && stage !== 'selecting') {
      setStage('delivering');
      setReplayOpen(false);
    }
    lastSupportId.current = nextId;
  }, [selectedSupport, stage]);

  useEffect(() => {
    if (stage !== 'selecting') return undefined;
    if (!hasReachedPhase(phase, 'SUPPORT_SELECTED')) return undefined;
    const timer = setTimeout(
      () => setStage('delivering'),
      reduceMotion ? 300 : SELECT_HOLD_MS
    );
    return () => clearTimeout(timer);
  }, [stage, reduceMotion, phase]);

  useEffect(() => {
    if (stage !== 'delivering') return;
    if (phase === 'SUPPORT_SELECTED') goToPhase('SUPPORT_ACTIVE');
    if (hasReachedPhase(phase, 'SUPPORT_ACTIVE') && supportStatus !== SUPPORT_STATUS.ACTIVE) {
      setSupportStatus(SUPPORT_STATUS.ACTIVE);
    }
  }, [stage, phase, supportStatus, goToPhase, setSupportStatus]);

  useEffect(() => {
    if (stage !== 'practicing') return;
    if (phase === 'SUPPORT_ACTIVE') goToPhase('SUPPORTED_PRACTICE');
    if (questionStartedAt.current === 0) questionStartedAt.current = Date.now();
  }, [stage, phase, goToPhase]);

  useEffect(() => {
    if (stage !== 'withdrawing') return;
    if (phase === 'SUPPORTED_PRACTICE') goToPhase('SUPPORT_WITHDRAWN');
    if (supportStatus !== SUPPORT_STATUS.REMOVED) {
      setSupportStatus(SUPPORT_STATUS.REMOVED);
    }
  }, [stage, phase, supportStatus, goToPhase, setSupportStatus]);

  const SupportComponent = SUPPORT_COMPONENTS[selectedSupport?.id] ?? VisualRotationSupport;

  const finishDelivery = () => {
    setReplayOpen(false);
    setStage('practicing');
    questionStartedAt.current = Date.now();
  };

  const submit = useCallback(
    (optionId) => {
      if (status !== 'idle' || !QUESTION) return;
      const scripted = demoScenarioEnabled ? getScriptedAttempt(QUESTION.id, 1) : null;
      const startedAt = questionStartedAt.current || Date.now();
      const responseTimeMs = scripted ? scripted.responseTimeMs : Date.now() - startedAt;
      answerQuestion({ question: QUESTION, optionId, responseTimeMs });
      setSelectedId(optionId);
      setStatus(optionId === QUESTION.correctOption ? 'correct' : 'wrong');
    },
    [answerQuestion, demoScenarioEnabled, status]
  );

  useEffect(() => {
    if (stage !== 'practicing' || status !== 'idle' || replayOpen || !demoScenarioEnabled) {
      return undefined;
    }
    const scripted = getScriptedAttempt(QUESTION.id, 1);
    if (!scripted) return undefined;
    const timer = setTimeout(() => submit(scripted.optionId), DEMO_AUTO_ANSWER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [stage, status, replayOpen, demoScenarioEnabled, submit]);

  const continueAfterPractice = () => setStage('withdrawing');

  const leaveToCheck = () => {
    navigate('/learn/independent-check');
  };

  return (
    <div className="min-h-full w-[min(100vw,430px)] flex flex-col pt-6 px-5 pb-24">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate('/learn/temple')}
          className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
          aria-label="Back to the Pattern Temple"
        >
          <X size={17} className="text-ink" aria-hidden="true" />
        </button>
        <p className="font-display font-bold text-[13.5px] text-ink">Pattern Temple</p>
        <div className="w-11 flex-shrink-0" />
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {stage === 'selecting' && (
            <motion.div
              key="selecting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-2">
                <Mascot size={104} mood="happy" />
              </div>
              <h1 className="font-display font-extrabold text-2xl text-ink leading-tight">
                Let's try this
              </h1>
              <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2.5 px-2">
                A new way to look at the pattern — just for a moment.
              </p>
            </motion.div>
          )}

          {stage === 'delivering' && (
            <motion.div
              key={`deliver-${selectedSupport?.id ?? 'visual-rotation'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <SupportComponent onComplete={finishDelivery} />
            </motion.div>
          )}

          {(stage === 'practicing' || stage === 'withdrawing') && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {stage === 'practicing' && !replayOpen && (
                <>
                  <PatternQuestion question={QUESTION} />
                  <div className="mt-6">
                    <PatternOptions
                      question={QUESTION}
                      status={status}
                      selectedId={selectedId}
                      onSelect={submit}
                    />
                  </div>
                </>
              )}

              {stage === 'practicing' && replayOpen && (
                <SupportComponent
                  key={`replay-${selectedSupport?.id}`}
                  replay
                  onComplete={() => {
                    setReplayOpen(false);
                    questionStartedAt.current = Date.now();
                  }}
                />
              )}

              <AnimatePresence>
                {stage === 'practicing' && !replayOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.6, transition: { duration: WITHDRAW_MS / 1000 } }
                    }
                    className="text-center mt-5"
                  >
                    <button
                      type="button"
                      onClick={() => setReplayOpen(true)}
                      className="min-h-11 px-6 rounded-full bg-primary-light text-primary font-display font-bold text-[13px] active:scale-95 transition-transform"
                    >
                      Show me again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {stage === 'practicing' && status !== 'idle' && !replayOpen && (
                <div className="text-center mt-5">
                  <p
                    className={`font-display font-bold text-[14px] ${
                      status === 'correct' ? 'text-success' : 'text-ink'
                    }`}
                  >
                    {status === 'correct'
                      ? 'Nice work — that one is solved.'
                      : 'Not quite — look at how the arrow turned.'}
                  </p>
                  {status === 'correct' ? (
                    <button
                      type="button"
                      onClick={continueAfterPractice}
                      className="mt-4 bg-success text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setStatus('idle');
                        setSelectedId(null);
                        questionStartedAt.current = Date.now();
                      }}
                      className="mt-4 bg-primary text-white font-display font-bold text-[13.5px] rounded-full px-8 min-h-11 active:scale-95 transition-transform"
                    >
                      Try again
                    </button>
                  )}
                </div>
              )}

              {stage === 'withdrawing' && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <Mascot size={96} mood="excited" />
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-ink leading-tight">
                    Great work!
                  </h2>
                  <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2 px-2">
                    Now try the next challenge on your own.
                  </p>
                  <button
                    type="button"
                    onClick={leaveToCheck}
                    className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform mt-6"
                  >
                    Continue
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}
