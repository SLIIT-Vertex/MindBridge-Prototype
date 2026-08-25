import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import BreakSupportContent from '../components/BreakSupportContent';

export default function BreakSupport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh">
      <AppHeader title="Quick Learning Break" />
      <BreakSupportContent onContinue={() => navigate('/minigame')} />
    </div>
  );
}

