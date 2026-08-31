import { useState } from 'react';
import { Camera, CameraOff, ChevronDown, FlaskConical, RefreshCw, SkipForward, SunDim } from 'lucide-react';

import { useLearnerState } from '../../context/LearnerStateContext';
import { DEMO_SCENARIOS } from '../../data/learner-state/demoScenarios';
import { LEARNER_BASELINES } from '../../data/learner-state/learnerBaselines';
import { CAMERA_MODE } from '../../data/learner-state/supportCopy';

/**
 * Presenter controls, modelled on the Adaptive Learning DemoScenarioControls.
 * Lives inside the research drawer and never in the child UI.
 *
 * A scenario supplies RAW SIGNALS only. It cannot set a state or a decision, so
 * the classification on screen is still the pipeline's own output.
 */

const CAMERA_BUTTONS = [
  { mode: CAMERA_MODE.ACTIVE, label: 'Camera Active', icon: Camera },
  { mode: CAMERA_MODE.LIMITED, label: 'Signal Limited', icon: SunDim },
  { mode: CAMERA_MODE.OFF, label: 'Camera Off', icon: CameraOff },
  { mode: CAMERA_MODE.DENIED, label: 'Behaviour Only', icon: CameraOff },
];

export default function LearnerStateDemoControls() {
  const [open, setOpen] = useState(false);
  const {
    scenarioId,
    setScenario,
    closeWindow,
    resetSession,
    requestedCameraMode,
    setCameraMode,
    learnerId,
    setLearner,
  } = useLearnerState();

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
            Scenarios supply raw signal readings only. Reliability, baseline comparison, fusion,
            persistence and the decision are still computed by the pipeline.
          </p>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Signal scenario
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <button
              type="button"
              onClick={() => setScenario(null)}
              className={`min-h-11 rounded-xl px-3 text-left text-[11px] font-display font-bold transition-colors ${
                scenarioId === null ? 'bg-white text-ink' : 'bg-white/10 text-white'
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
                  scenarioId === scenario.id ? 'bg-white text-ink' : 'bg-white/10 text-white'
                }`}
                aria-pressed={scenarioId === scenario.id}
              >
                <span className="block text-[11.5px] font-display font-bold leading-snug">
                  {scenario.label}
                </span>
                <span
                  className={`block text-[10.5px] font-semibold leading-snug mt-0.5 ${
                    scenarioId === scenario.id ? 'text-ink-soft' : 'text-white/55'
                  }`}
                >
                  {scenario.hint}
                </span>
              </button>
            ))}
          </div>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
            Camera state
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CAMERA_BUTTONS.map(({ mode, label, icon: Icon }) => (
              <button
                type="button"
                key={mode}
                onClick={() => setCameraMode(mode)}
                className={`min-h-11 rounded-xl px-2 flex items-center justify-center gap-1.5 text-[11px] font-display font-bold transition-colors ${
                  requestedCameraMode === mode ? 'bg-white text-ink' : 'bg-white/10 text-white'
                }`}
                aria-pressed={requestedCameraMode === mode}
              >
                <Icon size={13} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-1">
            Learner baseline
          </p>
          <p className="text-[10.5px] font-semibold text-white/55 mb-2 leading-relaxed">
            Swap the baseline without changing the signals. The same readings should be judged
            differently.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.values(LEARNER_BASELINES).map((baseline) => (
              <button
                type="button"
                key={baseline.learnerId}
                onClick={() => setLearner(baseline.learnerId)}
                className={`min-h-12 rounded-xl px-2 text-[11px] font-display font-bold leading-snug transition-colors ${
                  learnerId === baseline.learnerId ? 'bg-white text-ink' : 'bg-white/10 text-white'
                }`}
                aria-pressed={learnerId === baseline.learnerId}
              >
                {baseline.learnerName}
                <span
                  className={`block text-[9.5px] font-semibold mt-0.5 ${
                    learnerId === baseline.learnerId ? 'text-ink-soft' : 'text-white/55'
                  }`}
                >
                  {baseline.typical.responseTimeSec}s typical
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => closeWindow(Date.now())}
              className="min-h-11 rounded-xl bg-coin text-ink px-2 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <SkipForward size={13} aria-hidden="true" />
              <span className="text-[11px] font-display font-bold">Close window now</span>
            </button>
            <button
              type="button"
              onClick={resetSession}
              className="min-h-11 rounded-xl bg-white/10 text-white px-2 flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span className="text-[11px] font-display font-bold">Reset session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
