import { useState } from 'react';
import { FlaskConical, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STATES = ['engaged', 'confusion', 'frustration', 'low_alertness'];
const STATE_LABELS = {
  engaged: 'Engaged',
  confusion: 'Possible Confusion',
  frustration: 'Possible Frustration',
  low_alertness: 'Low Alertness',
};
const PERFORMANCE = ['Strong', 'Medium', 'Needs Support'];
const SPEEDS = ['Fast', 'Normal', 'Slow'];

export default function DemoControls() {
  const { learnerState, setLearnerState, visualSupport, setVisualSupport } = useApp();
  const [pendingState, setPendingState] = useState(learnerState);
  const [performance, setPerformance] = useState('Medium');
  const [attempts, setAttempts] = useState(2);
  const [speed, setSpeed] = useState('Normal');
  const [applied, setApplied] = useState(false);

  function apply() {
    setLearnerState(pendingState);
    setApplied(true);
    setTimeout(() => setApplied(false), 1800);
  }

  return (
    <div className="pb-10 bg-ink min-h-dvh text-white">
      <div className="px-5 pt-6 pb-4 flex items-center gap-2">
        <FlaskConical size={18} className="text-coin" />
        <h2 className="font-display font-bold text-[15px]">Research Demo Controls</h2>
      </div>
      <p className="px-5 text-[11.5px] font-semibold text-white/50 mb-6">
        Presenter-only panel. Not part of the normal child experience.
      </p>

      <div className="px-5 flex flex-col gap-6">
        <Section title="Learner State">
          <div className="grid grid-cols-2 gap-2">
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setPendingState(s)}
                className={`rounded-xl py-2.5 text-[12px] font-display font-bold transition-colors ${
                  pendingState === s ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
              >
                {STATE_LABELS[s]}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Performance">
          <div className="grid grid-cols-3 gap-2">
            {PERFORMANCE.map((p) => (
              <button
                key={p}
                onClick={() => setPerformance(p)}
                className={`rounded-xl py-2.5 text-[11px] font-display font-bold transition-colors ${
                  performance === p ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Section>

        <Section title={`Recent Incorrect Attempts: ${attempts}`}>
          <input
            type="range"
            min={0}
            max={5}
            value={attempts}
            onChange={(e) => setAttempts(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </Section>

        <Section title="Response Speed">
          <div className="grid grid-cols-3 gap-2">
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                onClick={() => setSpeed(sp)}
                className={`rounded-xl py-2.5 text-[11px] font-display font-bold transition-colors ${
                  speed === sp ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Visual Support">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setVisualSupport(true)}
              className={`rounded-xl py-2.5 text-[12px] font-display font-bold transition-colors ${
                visualSupport ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
              }`}
            >
              ON
            </button>
            <button
              onClick={() => setVisualSupport(false)}
              className={`rounded-xl py-2.5 text-[12px] font-display font-bold transition-colors ${
                !visualSupport ? 'bg-primary text-white' : 'bg-white/10 text-white/80'
              }`}
            >
              OFF
            </button>
          </div>
        </Section>

        <button
          onClick={apply}
          className="bg-coin text-ink font-display font-bold text-[14px] rounded-full py-4 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {applied ? <Check size={16} strokeWidth={3} /> : null}
          {applied ? 'Applied' : 'Apply Simulation'}
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-[10.5px] font-display font-bold text-white/50 uppercase tracking-wide mb-2.5">{title}</p>
      {children}
    </div>
  );
}
