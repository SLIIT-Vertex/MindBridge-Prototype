import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenCheck,
  ChevronDown,
  FlaskConical,
  MessageCircleQuestionMark,
  RefreshCw,
  RotateCw,
  SkipForward,
} from 'lucide-react';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { useApp } from '../../context/AppContext';
import { SUPPORTS, SUPPORT_STATUS } from '../../data/adaptive-learning/learningSupports';
import { LEARNER_STATES } from '../../data/learnerStateMockData';

const SUPPORT_ICONS = {
  RotateCw,
  MessageCircleQuestionMark,
  BookOpenCheck,
};

/**
 * Presenter controls, modelled on DemoStateControls. Lives inside the Research
 * View drawer, never in the child UI: a child must never see a button that admits
 * the struggle was scripted.
 */

const AFFECTIVE_BUTTONS = [
  { id: 'frustration', label: LEARNER_STATES.frustration.label },
  { id: 'low_alertness', label: LEARNER_STATES.low_alertness.label },
];

const JUMPS = [
  { label: 'Baseline', phase: 'BASELINE', route: '/learn/baseline' },
  { label: 'Support Selection', phase: 'SUPPORT_SELECTED', route: '/learn/support' },
  { label: 'Independent Check', phase: 'INDEPENDENT_CHECK', route: '/learn/independent-check' },
  { label: 'Independence Result', phase: 'RESULT', route: '/learn/result' },
  { label: 'Research Summary', phase: 'SUMMARY', route: '/learn/research-summary' },
];

export default function DemoScenarioControls() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setLearnerState } = useApp();
  const {
    demoScenarioEnabled,
    toggleDemoScenario,
    resetSession,
    seedToPhase,
    forceSupport,
    setSupportStatus,
    affectiveDemo,
    simulateAffectiveState,
  } = useAdaptive();

  // Seeds rather than moving the phase marker, so the target screen has real
  // numbers on it instead of blanks. A seed is also an implicit reset.
  const jumpTo = (phase, route) => {
    seedToPhase(phase);
    navigate(route);
  };

  const previewSupport = (supportId) => {
    // Seed first so the forced support is chosen against the real posterior and
    // carries the prediction the model would have given it.
    seedToPhase('SUPPORT_ACTIVE');
    forceSupport(supportId);
    setSupportStatus(SUPPORT_STATUS.ACTIVE);
    navigate('/learn/support');
  };

  const replay = () => {
    resetSession();
    navigate('/learn');
  };

  const simulateAffective = (id) => {
    setLearnerState(id);
    simulateAffectiveState(id);
  };

  return (
    <div className="rounded-2xl bg-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full min-h-11 px-4 flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <FlaskConical size={14} className="text-coin" aria-hidden="true" />
          <span className="font-display font-bold text-[10.5px] uppercase tracking-wide text-white">
            Prototype demo only
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`text-white/60 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-[10.5px] font-semibold text-white/55 mb-3 leading-relaxed">
            Presenter controls for a reproducible demonstration. Not part of the child experience.
          </p>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-1">
            Learner-state indicators
          </p>
          <p className="text-[10.5px] font-semibold text-white/55 mb-2 leading-relaxed">
            Overlay Possible Frustration or Low-Alertness on the child screen, as in the original demo.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {AFFECTIVE_BUTTONS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => simulateAffective(item.id)}
                className={`min-h-12 rounded-xl px-2 text-[11px] font-display font-bold leading-snug transition-colors ${
                  affectiveDemo?.state === item.id ? 'bg-white text-ink' : 'bg-white/10 text-white'
                }`}
                aria-pressed={affectiveDemo?.state === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Interaction mode
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => toggleDemoScenario(true)}
              className={`min-h-11 rounded-xl px-2 text-[11px] font-display font-bold transition-colors ${
                demoScenarioEnabled ? 'bg-white text-ink' : 'bg-white/10 text-white'
              }`}
              aria-pressed={demoScenarioEnabled}
            >
              Trigger Intended Struggle
            </button>
            <button
              type="button"
              onClick={() => toggleDemoScenario(false)}
              className={`min-h-11 rounded-xl px-2 text-[11px] font-display font-bold transition-colors ${
                demoScenarioEnabled ? 'bg-white/10 text-white' : 'bg-white text-ink'
              }`}
              aria-pressed={!demoScenarioEnabled}
            >
              Use Natural Interaction Mode
            </button>
          </div>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Jump to phase
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {JUMPS.map((jump) => (
              <button
                type="button"
                key={jump.phase}
                onClick={() => jumpTo(jump.phase, jump.route)}
                className="min-h-11 rounded-xl bg-white/10 text-white px-3 flex items-center gap-2 text-left active:scale-[0.98] transition-transform"
              >
                <SkipForward size={13} className="text-coin" aria-hidden="true" />
                <span className="text-[11px] font-display font-bold">{jump.label}</span>
              </button>
            ))}
          </div>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-1">
            Preview a support type
          </p>
          <p className="text-[10.5px] font-semibold text-white/55 mb-2 leading-relaxed">
            Each is a different way of helping. Tap one to open it on the child screen.
          </p>
          <div className="flex flex-col gap-2 mb-4">
            {SUPPORTS.map((support) => {
              const Icon = SUPPORT_ICONS[support.icon] ?? RotateCw;
              return (
                <button
                  type="button"
                  key={support.id}
                  onClick={() => previewSupport(support.id)}
                  className="rounded-xl bg-white/10 text-white px-3 py-2.5 text-left active:scale-[0.98] transition-transform"
                >
                  <span className="flex items-start gap-2.5">
                    <Icon size={15} className="text-coin mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-[11.5px] font-display font-bold leading-snug">
                        {support.label}
                      </span>
                      <span className="block text-[10.5px] font-semibold text-white/60 leading-snug mt-0.5">
                        {support.howItWorks}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={resetSession}
              className="min-h-11 rounded-xl bg-white/10 text-white px-2 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span className="text-[11px] font-display font-bold">Reset Session</span>
            </button>
            <button
              type="button"
              onClick={replay}
              className="min-h-11 rounded-xl bg-coin text-ink px-2 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <span className="text-[11px] font-display font-bold">Replay Full Demo</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
