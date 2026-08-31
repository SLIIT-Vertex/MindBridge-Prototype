import { Clock3, LifeBuoy, Scale } from 'lucide-react';

import {
  CAMERA_MODE_COPY,
  CLASSIFICATION,
  CLASSIFICATION_LABELS,
} from '../data/learner-state/supportCopy';

/**
 * One stored session, summarised.
 *
 * Reliability and the modality split sit on the card next to the state, because
 * a dominant-state label read without them is not reviewable evidence.
 */

const PRESENTATION = {
  [CLASSIFICATION.ENGAGED]: { color: '#1E8A47', bg: '#E6F9EC' },
  [CLASSIFICATION.PRODUCTIVE_CONFUSION]: { color: '#0F8C77', bg: '#E4FAF5' },
  [CLASSIFICATION.INTERVENTION_WORTHY_CONFUSION]: { color: '#C1650F', bg: '#FFF1E4' },
  [CLASSIFICATION.DISENGAGEMENT]: { color: '#237BB8', bg: '#E8F5FE' },
};

export default function SessionInsightCard({ session }) {
  const presentation =
    PRESENTATION[session.dominantClassification] ?? PRESENTATION[CLASSIFICATION.ENGAGED];
  const label =
    CLASSIFICATION_LABELS[session.dominantClassification] ??
    CLASSIFICATION_LABELS[CLASSIFICATION.ENGAGED];
  const supportMoments = session.interventions?.length ?? 0;
  const visualPct = Math.round((session.avgVisualWeight ?? 0) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-[14px] text-ink">{session.day}</p>
          <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5 flex items-center gap-1.5">
            <Clock3 size={12} aria-hidden="true" />
            {session.startTime} {'–'} {session.endTime}
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-display font-bold text-right flex-shrink-0"
          style={{ color: presentation.color, background: presentation.bg }}
        >
          {label}
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-cream-deep grid grid-cols-2 gap-2">
        <Metric
          icon={Scale}
          label="Visual / behaviour"
          value={`${visualPct}% / ${100 - visualPct}%`}
        />
        <Metric
          icon={LifeBuoy}
          label={supportMoments === 1 ? 'support moment' : 'support moments'}
          value={supportMoments}
        />
      </div>

      <p className="text-[10.5px] font-semibold text-ink-faint mt-2.5">
        {CAMERA_MODE_COPY[session.cameraMode]?.label} {'·'} reliability{' '}
        {session.avgVisualReliability?.toFixed(2)} visual / {session.avgBehaviorReliability?.toFixed(2)}{' '}
        behaviour {'·'} {session.windows} windows
      </p>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft">
      <Icon size={13} className="text-primary flex-shrink-0" aria-hidden="true" />
      <span className="font-display font-bold text-ink">{value}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
