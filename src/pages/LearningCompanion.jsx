import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Move, ScanFace, Compass, Timer, Repeat2, XCircle, MousePointerClick, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VISUAL_SIGNALS, BEHAVIOUR_SIGNALS } from '../data/tutorScripts';
import { LEARNER_STATES } from '../data/learnerStateMockData';
import Mascot from '../components/Mascot';
import AppHeader from '../components/AppHeader';
import StateSupportCard from '../components/StateSupportCard';

const VISUAL_ICONS = [Eye, Compass, Move, ScanFace];
const BEHAVIOUR_ICONS = [Timer, XCircle, Repeat2, MousePointerClick, TrendingUp];

const STATE_MOOD = { engaged: 'excited', confusion: 'thinking', frustration: 'calm', low_alertness: 'sleepy' };
const STATE_DOT = { engaged: 'bg-success', confusion: 'bg-orange', frustration: 'bg-primary', low_alertness: 'bg-teal' };

export default function LearningCompanion() {
  const navigate = useNavigate();
  const { learnerState, setLearnerState, visualSupport } = useApp();
  const [showDemo, setShowDemo] = useState(false);
  const content = LEARNER_STATES[learnerState] || LEARNER_STATES.engaged;

  function handleAction(id) {
    if (id === 'help') navigate('/hint-session');
    if (id === 'break' || id === 'pause' || id === 'water') navigate('/break-support');
    if (id === 'retry' || id === 'continue') setLearnerState('engaged');
    if (id === 'easier') setLearnerState('engaged');
  }

  return (
    <div className="pb-6">
      <AppHeader
        title="Learning Companion"
        right={
          <button onClick={() => setShowDemo((d) => !d)} className="text-[10.5px] font-display font-bold text-ink-faint">
            Demo
          </button>
        }
      />

      <div className="px-5 mt-1 mb-6 flex flex-col items-center text-center">
        <Mascot size={90} mood={STATE_MOOD[learnerState]} />
        <p className="font-display font-bold text-[14.5px] text-ink mt-3 max-w-[260px]">
          I'm helping make learning comfortable for you.
        </p>
      </div>

      {showDemo && (
        <div className="px-5 mb-5">
          <div className="bg-ink rounded-2xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <SlidersHorizontal size={13} className="text-white/70" />
              <p className="text-[10.5px] font-display font-bold text-white/70 uppercase tracking-wide">Presenter Demo Controls</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(LEARNER_STATES).map((key) => (
                <button
                  key={key}
                  onClick={() => setLearnerState(key)}
                  className={`rounded-xl py-2.5 text-[12px] font-display font-bold capitalize transition-colors ${
                    learnerState === key ? 'bg-white text-ink' : 'bg-white/10 text-white'
                  }`}
                >
                  {LEARNER_STATES[key].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl p-4 card-shadow flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${STATE_DOT[learnerState]}`} />
          <div>
            <p className="text-[10.5px] font-bold text-ink-faint uppercase tracking-wide">Learning right now</p>
            <p className="font-display font-bold text-[14px] text-ink">{content.label}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <StateSupportCard content={content} onAction={handleAction} />
      </div>

      <div className="px-5 flex flex-col gap-4">
        <SignalGroup title="Visual Signals" items={VISUAL_SIGNALS} icons={VISUAL_ICONS} dim={!visualSupport} />
        <SignalGroup title="Learning Behaviour" items={BEHAVIOUR_SIGNALS} icons={BEHAVIOUR_ICONS} />
      </div>

      {!visualSupport && (
        <div className="px-5 mt-4">
          <p className="text-[11.5px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5">
            Visual support is off. MindBridge will continue using learning activity signals.
          </p>
        </div>
      )}
    </div>
  );
}

function SignalGroup({ title, items, icons, dim }) {
  return (
    <div className={`bg-white rounded-2xl p-4 card-shadow ${dim ? 'opacity-45' : ''}`}>
      <p className="font-display font-bold text-[12.5px] text-ink mb-3">{title}</p>
      <div className="flex flex-col gap-2.5">
        {items.map((label, i) => {
          const Icon = icons[i];
          return (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cream-deep flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-ink-soft" />
              </div>
              <span className="text-[12px] font-semibold text-ink-soft">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
