import { useNavigate } from 'react-router-dom';
import { Globe2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LanguageSelector from '../components/LanguageSelector';

export default function LanguageSelect() {
  const { language, setLanguage } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-16 pb-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
          <Globe2 size={30} className="text-primary" strokeWidth={1.8} />
        </div>
        <h2 className="font-display font-extrabold text-2xl text-ink">How would you like to learn?</h2>
      </div>

      <LanguageSelector value={language} onChange={setLanguage} />

      <div className="flex-1" />

      <button
        onClick={() => navigate('/profile-setup')}
        className="bg-primary text-white font-display font-bold text-[15px] rounded-full py-4 active:scale-95 transition-transform"
      >
        Continue
      </button>
    </div>
  );
}
