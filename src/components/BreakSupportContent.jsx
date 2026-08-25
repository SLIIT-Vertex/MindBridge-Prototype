import { useEffect, useState } from 'react';
import { Droplets, Eye, PersonStanding, Wind } from 'lucide-react';

const BREAK_OPTIONS = [
  { id: 'breathe', label: 'Slow breath', icon: Wind, color: '#6C5CE7', bg: '#EFECFD' },
  { id: 'water', label: 'Drink water', icon: Droplets, color: '#3FA9F5', bg: '#E8F5FE' },
  { id: 'stretch', label: 'Gentle stretch', icon: PersonStanding, color: '#16BFA6', bg: '#E4FAF5' },
  { id: 'eyes', label: 'Rest your eyes', icon: Eye, color: '#FF9F5A', bg: '#FFF1E4' },
];

export default function BreakSupportContent({ onContinue }) {
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="px-5 pb-8 flex flex-col items-center text-center">
      <div className="relative w-36 h-36 flex items-center justify-center my-6">
        <span className="absolute inset-3 rounded-full bg-primary-light animate-pulse" />
        <span className="absolute inset-7 rounded-full bg-white card-shadow" />
        <div className="relative">
          <p className="font-display font-extrabold text-3xl text-primary">{seconds}</p>
          <p className="text-[10.5px] font-bold text-ink-faint uppercase tracking-wide">seconds</p>
        </div>
      </div>

      <h1 className="font-display font-extrabold text-2xl text-ink">A tiny reset</h1>
      <p className="text-[13px] font-semibold text-ink-soft leading-relaxed mt-1 max-w-[300px]">
        Take a slow breath and choose anything that helps you feel ready.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full mt-6">
        {BREAK_OPTIONS.map(({ id, label, icon: Icon, color, bg }) => (
          <div key={id} className="bg-white rounded-2xl p-4 card-shadow flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon size={17} color={color} />
            </div>
            <span className="font-display font-bold text-[12px] text-ink">{label}</span>
          </div>
        ))}
      </div>

      <p className="font-display font-bold text-[15px] text-ink mt-8">Ready to continue?</p>
      <button
        type="button"
        onClick={onContinue}
        className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full mt-3 active:scale-95 transition-transform"
      >
        Continue Learning
      </button>
    </div>
  );
}

