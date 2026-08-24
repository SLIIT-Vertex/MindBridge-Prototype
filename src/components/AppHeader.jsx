import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AppHeader({ title, onBack, right }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between px-5 pt-6 pb-2">
      <button
        onClick={onBack || (() => navigate(-1))}
        className="w-10 h-10 rounded-full bg-white card-shadow flex items-center justify-center active:scale-90 transition-transform"
      >
        <ChevronLeft size={20} className="text-ink" />
      </button>
      <h2 className="font-display font-bold text-[17px] text-ink">{title}</h2>
      <div className="w-10 h-10 flex items-center justify-center">{right}</div>
    </div>
  );
}
