import { LANGUAGES } from '../data/mockData';

export default function LanguageSelector({ value, onChange, compact = false }) {
  if (compact) {
    return (
      <div className="inline-flex bg-cream-deep rounded-full p-1 gap-1">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => onChange(l.code)}
            className={`min-h-11 px-3 rounded-full text-[12px] font-display font-bold transition-colors ${
              value === l.code ? 'bg-primary text-white' : 'text-ink-soft'
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-colors ${
            value === l.code ? 'border-primary bg-primary-light' : 'border-transparent bg-white card-shadow'
          }`}
        >
          <span className="font-display font-bold text-[18px] text-ink">{l.native}</span>
          <span className="text-[12.5px] font-semibold text-ink-soft">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
