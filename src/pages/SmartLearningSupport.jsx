import { useNavigate } from 'react-router-dom';
import { Activity, Camera, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';

export default function SmartLearningSupport() {
  const navigate = useNavigate();
  const { visualSupport, setVisualSupport, setLearnerState } = useApp();

  function startLearning() {
    setLearnerState('engaged');
    navigate('/minigame');
  }

  return (
    <div className="pb-8">
      <AppHeader title="Smart Learning Support" />

      <div className="px-5 mt-3">
        <div className="bg-teal-light rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 card-shadow">
            <ShieldCheck size={23} className="text-teal" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-xl text-ink leading-tight">Support when you need it</h1>
            <p className="text-[12.5px] font-semibold text-ink-soft mt-1.5 leading-relaxed">
              We can use your learning activity and optional camera signals to understand when you may need a little support.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow mt-4 divide-y divide-cream-deep overflow-hidden">
          <div className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-sky-light flex items-center justify-center flex-shrink-0">
                <Camera size={18} className="text-sky" />
              </div>
              <div>
                <p className="font-display font-bold text-[13.5px] text-ink">Camera Monitoring</p>
                <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Optional visual behaviour signals</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={visualSupport}
              aria-label="Camera monitoring"
              onClick={() => setVisualSupport((value) => !value)}
              className={`w-12 rounded-full relative transition-colors flex-shrink-0 ${visualSupport ? 'bg-primary' : 'bg-cream-deep'}`}
              style={{ height: 26 }}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${visualSupport ? 'left-[26px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
              <Activity size={18} className="text-teal" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-[13.5px] text-ink">Learning Behaviour Monitoring</p>
              <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Attempts, response time and activity</p>
            </div>
            <span className="flex items-center gap-1 text-[10.5px] font-display font-bold text-[#1E8A47]">
              <CheckCircle2 size={14} /> Enabled
            </span>
          </div>
        </div>

        {!visualSupport && (
          <div className="bg-primary-light rounded-2xl p-3.5 mt-4 text-[12px] font-semibold text-ink-soft leading-relaxed">
            Learning behaviour will still be used to provide support.
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full text-primary font-display font-bold text-[12.5px] py-4"
        >
          How privacy and camera signals work
        </button>

        <button
          type="button"
          onClick={startLearning}
          className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
        >
          Start Learning
        </button>
      </div>
    </div>
  );
}

