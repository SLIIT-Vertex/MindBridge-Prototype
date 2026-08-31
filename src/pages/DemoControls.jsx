import { useNavigate } from 'react-router-dom';
import { Baby, Check, FlaskConical, Play } from 'lucide-react';

import { useLearnerState } from '../context/LearnerStateContext';
import { DEMO_SCENARIOS } from '../data/learner-state/demoScenarios';
import { LEARNER_BASELINES } from '../data/learner-state/learnerBaselines';
import { CAMERA_MODE, CAMERA_MODE_COPY } from '../data/learner-state/supportCopy';
import {
  MIN_USEFUL_RELIABILITY,
  VISUAL_LIMITED_THRESHOLD,
} from '../services/learner-state/reliabilityFusion';
import {
  EXTENDED_CONFUSION_WINDOWS,
  INTERVENTION_COOLDOWN_WINDOWS,
  THRESHOLDS,
} from '../services/learner-state/adaptiveDecision';
import { PERSISTENT_CONFUSION_WINDOWS, WINDOW_SECONDS } from '../services/learner-state/temporalWindow';

/**
 * Presenter setup screen.
 *
 * Picks the scenario, camera state and baseline BEFORE walking into the session,
 * so the demo does not begin with someone fiddling inside the research drawer.
 * The thresholds are listed here too, because a supervisor asking "why did it
 * decide that" should be able to read the constants rather than the source.
 */
export default function DemoControls() {
  const navigate = useNavigate();
  const {
    scenarioId,
    setScenario,
    requestedCameraMode,
    setCameraMode,
    learnerId,
    setLearner,
    resetSession,
    presenterMode,
    setPresenterMode,
  } = useLearnerState();

  /**
   * Launching from here turns presenter mode ON, which is the only way the
   * research affordance appears on a learning screen. A child starting a session
   * from Home never passes through this page, so their session stays clean.
   */
  function runScenario(id) {
    setScenario(id);
    resetSession();
    setPresenterMode(true);
    // A scenario supplies its own visual readings, so a run left on the initial
    // camera-off default would show a behaviour-only fusion and hide the very
    // thing the demo is about. Only nudged when the presenter has not chosen.
    if (id && requestedCameraMode === CAMERA_MODE.OFF) setCameraMode(CAMERA_MODE.ACTIVE);
    navigate('/minigame');
  }

  function runAsChild() {
    setScenario(null);
    resetSession();
    setPresenterMode(false);
    navigate('/minigame');
  }

  return (
    <div className="pb-10 bg-ink min-h-dvh text-white">
      <div className="px-5 pt-6 pb-3 flex items-center gap-2">
        <FlaskConical size={18} className="text-coin" aria-hidden="true" />
        <h2 className="font-display font-bold text-[15px]">Learner State Demo Controls</h2>
      </div>
      <p className="px-5 text-[11.5px] font-semibold text-white/50 mb-6 leading-relaxed">
        Presenter panel. Scenarios supply raw signal readings only. Reliability, baseline comparison,
        fusion, persistence and the decision are always computed by the pipeline.
      </p>

      <div className="px-5 flex flex-col gap-6">
        <Section title="Signal scenario">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setScenario(null)}
              className={`min-h-11 rounded-xl px-3 text-left text-[12px] font-display font-bold transition-colors ${
                scenarioId === null ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
              }`}
              aria-pressed={scenarioId === null}
            >
              Live session signals
            </button>
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                type="button"
                key={scenario.id}
                onClick={() => setScenario(scenario.id)}
                className={`rounded-xl px-3 py-2.5 text-left transition-colors ${
                  scenarioId === scenario.id ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
                aria-pressed={scenarioId === scenario.id}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[12px] font-display font-bold">{scenario.label}</span>
                  {scenarioId === scenario.id && <Check size={14} strokeWidth={3} aria-hidden="true" />}
                </span>
                <span className="block text-[10.5px] font-semibold text-white/55 mt-0.5 leading-snug">
                  {scenario.hint}
                </span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Camera state">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(CAMERA_MODE).map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setCameraMode(mode)}
                className={`min-h-11 rounded-xl px-2 text-[11px] font-display font-bold transition-colors ${
                  requestedCameraMode === mode ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
                aria-pressed={requestedCameraMode === mode}
              >
                {CAMERA_MODE_COPY[mode].label}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Learner baseline">
          <div className="grid grid-cols-2 gap-2">
            {Object.values(LEARNER_BASELINES).map((baseline) => (
              <button
                type="button"
                key={baseline.learnerId}
                onClick={() => setLearner(baseline.learnerId)}
                className={`min-h-14 rounded-xl px-3 py-2 text-left transition-colors ${
                  learnerId === baseline.learnerId ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
                aria-pressed={learnerId === baseline.learnerId}
              >
                <span className="block text-[12px] font-display font-bold">
                  {baseline.learnerName}
                </span>
                <span className="block text-[10px] font-semibold text-white/55 mt-0.5 leading-snug">
                  {baseline.typical.responseTimeSec}s typical response
                </span>
              </button>
            ))}
          </div>
          <p className="text-[10.5px] font-semibold text-white/50 mt-2.5 leading-relaxed">
            Run the same scenario against both baselines. The signals are identical; the decisions are
            not.
          </p>
        </Section>

        <Section title="Decision constants">
          <div className="rounded-xl bg-white/[0.06] p-3.5 flex flex-col gap-1.5">
            <ConstantRow label="Temporal window" value={`${WINDOW_SECONDS}s`} />
            <ConstantRow label="Confusion elevated" value={THRESHOLDS.CONFUSION_ELEVATED} />
            <ConstantRow label="Confusion high" value={THRESHOLDS.CONFUSION_HIGH} />
            <ConstantRow label="Disengagement elevated" value={THRESHOLDS.DISENGAGEMENT_ELEVATED} />
            <ConstantRow label="Persistence healthy" value={THRESHOLDS.PERSISTENCE_HEALTHY} />
            <ConstantRow label="Persistent confusion" value={`${PERSISTENT_CONFUSION_WINDOWS} windows`} />
            <ConstantRow label="Extended confusion valve" value={`${EXTENDED_CONFUSION_WINDOWS} windows`} />
            <ConstantRow label="Intervention cooldown" value={`${INTERVENTION_COOLDOWN_WINDOWS} windows`} />
            <ConstantRow label="Response time deviation" value={`${THRESHOLDS.RESPONSE_TIME_SIGMA}σ`} />
            <ConstantRow label="Modality attenuated below" value={MIN_USEFUL_RELIABILITY} />
            <ConstantRow label="Visual reported limited below" value={VISUAL_LIMITED_THRESHOLD} />
          </div>
        </Section>

        <button
          type="button"
          onClick={() => runScenario(scenarioId)}
          className="bg-coin text-ink font-display font-bold text-[14px] rounded-full min-h-12 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Play size={15} strokeWidth={2.6} aria-hidden="true" />
          Start with research view
        </button>

        <button
          type="button"
          onClick={runAsChild}
          className="bg-white/10 text-white font-display font-bold text-[13px] rounded-full min-h-12 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <Baby size={15} aria-hidden="true" />
          Start as the child sees it
        </button>
        <p className="text-[10.5px] font-semibold text-white/45 leading-relaxed -mt-3">
          The child view has no research button, no scenario and no readings on screen. Presenter
          mode is currently {presenterMode ? 'ON' : 'OFF'}.
        </p>

        <button
          type="button"
          onClick={() => navigate('/learner-state-insights')}
          className="bg-white/10 text-white font-display font-bold text-[13px] rounded-full min-h-11 active:scale-95 transition-transform"
        >
          Open research insights
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10.5px] font-display font-bold text-white/50 uppercase tracking-wide mb-2.5">
        {title}
      </p>
      {children}
    </div>
  );
}

function ConstantRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] font-semibold text-white/55">{label}</span>
      <span className="text-[11px] font-display font-bold text-white">{value}</span>
    </div>
  );
}
