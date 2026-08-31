import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AppHeader({ title, onBack, right }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-2">
      {/* 44px minimum: this is the most-tapped control in the app and the hands
          using it are nine years old. */}
      <button
        onClick={onBack || (() => navigate(-1))}
        aria-label="Go back"
        className="w-11 h-11 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
      >
        <ChevronLeft size={20} className="text-ink" aria-hidden="true" />
      </button>
      <h2 className="font-display font-bold text-[17px] text-ink text-center px-2 min-w-0">{title}</h2>
      <div className="w-11 h-11 flex items-center justify-center flex-shrink-0">{right}</div>
    </div>
  );
}
