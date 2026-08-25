import { useState } from 'react';
import { BarChart3, Camera, CheckCircle2, Info, Lock, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppHeader from '../components/AppHeader';

export default function Privacy() {
  const { visualSupport, setVisualSupport } = useApp();
  const [deleteMessage, setDeleteMessage] = useState('');

  function requestDelete() {
    setDeleteMessage('Prototype action recorded. No real session records are deleted in this demonstration.');
  }

  return (
    <div className="pb-8">
      <AppHeader title="Privacy & Camera Controls" />

      <div className="px-5 mt-2 flex flex-col gap-4">
        <div className="bg-primary-light rounded-2xl p-4 flex items-start gap-3">
          <Info size={17} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-[12px] font-semibold text-ink-soft leading-relaxed">
            Camera monitoring is optional. When disabled, Smart Learning Support continues using learning-interaction behaviour.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 card-shadow flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-sky-light flex items-center justify-center flex-shrink-0">
              <Camera size={18} className="text-sky" />
            </div>
            <div>
              <p className="font-display font-bold text-[13.5px] text-ink">Camera Monitoring</p>
              <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Use optional visual behaviour signals</p>
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

        {!visualSupport && (
          <p className="text-[12px] font-semibold text-ink-soft bg-teal-light rounded-2xl p-3.5">
            Behaviour-based support active. Learning continues normally without camera signals.
          </p>
        )}

        <InfoCard
          icon={BarChart3}
          color="#16BFA6"
          bg="#E4FAF5"
          title="Learning Behaviour Monitoring"
          body="The prototype considers response time, incorrect and repeated attempts, inactivity, recent performance and task completion."
          trailing={<CheckCircle2 size={16} className="text-success" />}
        />
        <InfoCard
          icon={Camera}
          color="#3FA9F5"
          bg="#E8F5FE"
          title="Visual Information"
          body="Visual information is used only to estimate learning-related behavioural indicators in this prototype."
        />
        <InfoCard
          icon={Lock}
          color="#6C5CE7"
          bg="#EFECFD"
          title="Data Usage"
          body="Mock session information demonstrates how support moments and repeated learning patterns could be summarized. This prototype does not claim a production security implementation."
        />

        <button
          type="button"
          onClick={requestDelete}
          className="w-full bg-white rounded-2xl p-4 card-shadow flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-coral-light flex items-center justify-center flex-shrink-0">
            <Trash2 size={18} className="text-coral" />
          </div>
          <div>
            <p className="font-display font-bold text-[13.5px] text-ink">Delete Session Insights</p>
            <p className="text-[11px] font-semibold text-ink-soft mt-0.5">Prototype action placeholder</p>
          </div>
        </button>

        {deleteMessage && (
          <p role="status" className="text-[11.5px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5 leading-relaxed">
            {deleteMessage}
          </p>
        )}

        <p className="text-[10.5px] font-semibold text-ink-faint leading-relaxed px-1">
          Smart Learning Support estimates possible learning-support needs. It does not provide a medical or psychological assessment.
        </p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, color, bg, title, body, trailing }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display font-bold text-[13.5px] text-ink">{title}</p>
          {trailing}
        </div>
        <p className="text-[12px] font-semibold text-ink-soft mt-0.5 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

