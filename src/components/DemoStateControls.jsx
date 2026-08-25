import { useState } from 'react';
import { FlaskConical, ChevronDown } from 'lucide-react';
import { LEARNER_STATES } from '../data/learnerStateMockData';

export default function DemoStateControls({ activeState, onSimulate }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-ink text-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="w-full min-h-11 px-4 flex items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <FlaskConical size={14} className="text-coin" />
          <span className="font-display font-bold text-[10.5px] uppercase tracking-wide">Prototype demo only</span>
        </span>
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 pb-4">
          <p className="text-[10.5px] font-semibold text-white/55 mb-3">
            Manually simulate a learner-state event for the presentation.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(LEARNER_STATES).map(([key, state]) => (
              <button
                type="button"
                key={key}
                onClick={() => onSimulate(key)}
                className={`min-h-10 rounded-xl px-2 text-[11px] font-display font-bold transition-colors ${
                  activeState === key ? 'bg-white text-ink' : 'bg-white/10 text-white'
                }`}
              >
                {state.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

