import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, LifeBuoy, Trophy } from 'lucide-react';

import { CAMERA_MODE } from '../data/learner-state/supportCopy';
import { CHILD_CAMERA_COPY, SESSION_END_COPY } from '../data/learner-state/childCopy';

const DEFAULT_SUMMARY = {
  activitiesCompleted: 4,
  correctAnswers: 3,
  learningMinutes: 9,
  supportMoments: 2,
  interventions: [],
  cameraMode: CAMERA_MODE.OFF,
};

export default function SessionSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const summary = { ...DEFAULT_SUMMARY, ...location.state };
  const acceptedSupport = summary.interventions.filter((item) => item.accepted).length;

  const stats = [
    { icon: CheckCircle2, value: summary.activitiesCompleted, label: 'Activities Completed', color: '#35C46A', bg: '#E6F9EC' },
    { icon: Trophy, value: summary.correctAnswers, label: 'Correct Answers', color: '#6C5CE7', bg: '#EFECFD' },
    { icon: Clock3, value: `${summary.learningMinutes} min`, label: 'Learning Time', color: '#3FA9F5', bg: '#E8F5FE' },
    { icon: LifeBuoy, value: summary.supportMoments, label: 'Support Moments', color: '#FF9F5A', bg: '#FFF1E4' },
  ];

  return (
    <div className="min-h-dvh px-5 pt-10 pb-8 flex flex-col">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto card-shadow-lg">
          <Trophy size={36} className="text-success" />
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink mt-5">Great work today!</h1>
        <p className="text-[13px] font-semibold text-ink-soft mt-1">You kept learning and used support when it helped.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-7">
        {stats.map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 card-shadow">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={17} color={color} />
            </div>
            <p className="font-display font-extrabold text-xl text-ink">{value}</p>
            <p className="text-[10.5px] font-semibold text-ink-soft leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Situation, never a state label about the child. */}
      <div className="bg-teal-light rounded-2xl p-4 mt-4 flex items-start gap-3">
        <span className="w-3 h-3 rounded-full bg-teal flex-shrink-0 mt-1" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-display font-bold text-[13.5px] text-ink">
            {summary.supportMoments === 0
              ? SESSION_END_COPY.none
              : acceptedSupport > 0
                ? SESSION_END_COPY.accepted
                : SESSION_END_COPY.declined}
          </p>
          <p className="text-[11px] font-semibold text-ink-soft mt-1">
            {CHILD_CAMERA_COPY[summary.cameraMode]?.label ?? 'Camera off'}
          </p>
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
        >
          Back to Home
        </button>
        <button
          type="button"
          onClick={() => navigate('/practice')}
          className="w-full min-h-12 bg-white text-ink font-display font-bold text-[14px] rounded-full card-shadow active:scale-95 transition-transform"
        >
          Practice Again
        </button>
      </div>
    </div>
  );
}

