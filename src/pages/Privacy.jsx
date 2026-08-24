import { Camera, BarChart3, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';

export default function Privacy() {
  const { visualSupport, setVisualSupport } = useApp();

  return (
    <div className="pb-8">
      <AppHeader title="Your Learning Privacy" />

      <div className="px-5 mt-2 flex flex-col gap-4">
        <InfoCard
          icon={Camera}
          color="#3FA9F5"
          bg="#E8F5FE"
          title="Camera"
          body="When enabled, visual cues help MindBridge understand whether learning support may be useful."
        />
        <InfoCard
          icon={BarChart3}
          color="#16BFA6"
          bg="#E4FAF5"
          title="Learning Activity"
          body="We use activity information such as attempts and response time to improve your learning experience."
        />
        <InfoCard
          icon={Lock}
          color="#6C5CE7"
          bg="#EFECFD"
          title="Privacy"
          body="Your learning information is protected."
        />

        <div className="bg-white rounded-2xl p-4 card-shadow flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-[13.5px] text-ink">Visual Learning Support</p>
            <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Camera assists — never processed or stored</p>
          </div>
          <button
            onClick={() => setVisualSupport((v) => !v)}
            className={`w-12 h-6.5 rounded-full relative transition-colors flex-shrink-0 ${visualSupport ? 'bg-primary' : 'bg-cream-deep'}`}
            style={{ height: 26 }}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${visualSupport ? 'left-[26px]' : 'left-0.5'}`} />
          </button>
        </div>

        {!visualSupport && (
          <p className="text-[12px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5">
            MindBridge will continue using learning activity signals.
          </p>
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, color, bg, title, body }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <div>
        <p className="font-display font-bold text-[13.5px] text-ink">{title}</p>
        <p className="text-[12px] font-semibold text-ink-soft mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
