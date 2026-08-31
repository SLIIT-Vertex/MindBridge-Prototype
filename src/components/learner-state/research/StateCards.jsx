import { Activity, Brain, Camera, Scale, Timer } from 'lucide-react';

import ResearchCard, { ResearchRow } from '../../ResearchCard';
import { useLearnerState } from '../../../context/LearnerStateContext';
import { CAMERA_MODE_COPY } from '../../../data/learner-state/supportCopy';
import { formatWindowRange, WINDOW_RANGE_SECONDS } from '../../../services/learner-state/temporalWindow';
import { MIN_USEFUL_RELIABILITY } from '../../../services/learner-state/reliabilityFusion';
import { pct, prob } from './format';

/** Confusion and disengagement for the most recently closed window. */
export function CurrentStateCard() {
  const { derived } = useLearnerState();
  const window = derived.latestWindow;
  const estimate = window?.stateEstimate;

  return (
    <ResearchCard
      label="Current State"
      icon={Brain}
      available={Boolean(estimate)}
      footnote="Estimated over the whole window, not from a single frame or a single answer."
    >
      <ResearchRow
        label="Confusion"
        value={prob(estimate?.confusionProbability)}
        valueClass="text-orange"
      />
      <ResearchRow
        label="Disengagement"
        value={prob(estimate?.disengagementProbability)}
        valueClass="text-sky"
      />
      {estimate && !estimate.disengagementCorroborated ? (
        <p className="text-[10.5px] font-semibold text-white/55 leading-relaxed mt-2.5 pt-2.5 border-t border-white/10">
          Disengagement capped: gaze-away evidence was not corroborated by learning behaviour.
        </p>
      ) : null}
    </ResearchCard>
  );
}

/** Can we see, and can we tell? Kept separate from what the signals mean. */
export function SignalReliabilityCard() {
  const { derived } = useLearnerState();
  const window = derived.latestWindow;
  const reliability = window?.reliability;

  return (
    <ResearchCard
      label="Signal Reliability"
      icon={Camera}
      available={Boolean(reliability)}
      footnote={`Below ${MIN_USEFUL_RELIABILITY} a modality is attenuated before fusion.`}
    >
      <ReliabilityBar
        label="Visual"
        value={reliability?.visual}
        detail={reliability?.visualDetail?.reason}
        color="#3FA9F5"
      />
      <ReliabilityBar
        label="Behaviour"
        value={reliability?.behavior}
        detail={reliability?.behaviorDetail?.reason}
        color="#16BFA6"
      />
    </ResearchCard>
  );
}

/** The dynamic weights, which is the point of the whole card. */
export function FusionWeightCard() {
  const { derived } = useLearnerState();
  const window = derived.latestWindow;
  const weights = window?.weights;
  const estimate = window?.stateEstimate;

  return (
    <ResearchCard
      label="Fusion Weight"
      icon={Scale}
      available={Boolean(weights)}
      footnote={estimate?.fusionReason}
    >
      <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10 mb-3" aria-hidden="true">
        <div style={{ width: `${(weights?.visual ?? 0) * 100}%`, background: '#3FA9F5' }} />
        <div style={{ width: `${(weights?.behavior ?? 1) * 100}%`, background: '#16BFA6' }} />
      </div>
      <ResearchRow label="Visual" value={pct(weights?.visual)} valueClass="text-sky" />
      <ResearchRow label="Behaviour" value={pct(weights?.behavior)} valueClass="text-teal" />
      <ResearchRow
        label="Mode"
        value={(estimate?.fusionMode ?? 'behavior_only').replace(/_/g, ' ')}
        valueClass="text-coin"
      />
    </ResearchCard>
  );
}

/** The window itself: when it ran, what was in it, how long it was. */
export function TemporalWindowCard() {
  const { derived, startTime, windows, currentWindow } = useLearnerState();
  const window = derived.latestWindow;
  const behavior = window?.behaviorFeatures;
  const visual = window?.visualFeatures;

  return (
    <ResearchCard
      label="Temporal Window"
      icon={Timer}
      available={Boolean(window)}
      footnote={`Target ${WINDOW_RANGE_SECONDS[0]}–${WINDOW_RANGE_SECONDS[1]}s per window. Open window: ${currentWindow?.id?.toUpperCase() ?? '—'}.`}
    >
      <ResearchRow label="Window" value={formatWindowRange(window, startTime)} valueClass="text-coin" />
      <ResearchRow label="Duration" value={window ? `${window.durationSec}s` : '—'} />
      <ResearchRow label="Windows closed" value={windows.length} />

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
          Behaviour features
        </p>
        <ResearchRow label="Response time" value={behavior ? `${behavior.responseTimeSec}s` : '—'} />
        <ResearchRow label="Incorrect / repeated" value={behavior ? `${behavior.incorrectAttempts} / ${behavior.repeatedAttempts}` : '—'} />
        <ResearchRow label="Hint requests" value={behavior?.hintRequests ?? '—'} />
        <ResearchRow label="Inactivity" value={behavior ? `${behavior.inactivitySec}s` : '—'} />
        <ResearchRow label="Interactions / min" value={behavior?.interactionsPerMinute ?? '—'} />
        <ResearchRow label="Recent accuracy" value={pct(behavior?.recentAccuracy)} />
      </div>

      <div className="mt-3 pt-3 border-t border-white/10">
        <p className="text-[9.5px] font-bold uppercase tracking-wide text-white/40 mb-2">
          Visual features
        </p>
        {visual && visual.framesAnalysed > 0 ? (
          <>
            <ResearchRow label="Eye openness" value={prob(visual.eyeOpenness)} />
            <ResearchRow label="Gaze on task" value={prob(visual.gazeOnTaskRatio)} />
            <ResearchRow label="Head pose stability" value={prob(visual.headStability)} />
            <ResearchRow label="Facial dynamics" value={prob(visual.facialDynamics)} />
            <ResearchRow label="Face visibility" value={prob(visual.faceVisibilityRatio)} />
            <ResearchRow label="Landmark confidence" value={prob(visual.landmarkConfidence)} />
          </>
        ) : (
          <p className="text-[11.5px] font-semibold text-white/40">
            No visual signal in this window.
          </p>
        )}
      </div>
    </ResearchCard>
  );
}

/** Which camera state the child is actually in, and why. */
export function CameraModeCard() {
  const { derived, cameraPermission, requestedCameraMode } = useLearnerState();
  const copy = CAMERA_MODE_COPY[derived.effectiveCameraMode];

  return (
    <ResearchCard label="Camera Mode" icon={Activity}>
      <ResearchRow label="Effective mode" value={copy?.label ?? '—'} valueClass="text-coin" />
      <ResearchRow label="Requested" value={requestedCameraMode} />
      <ResearchRow label="Permission" value={cameraPermission} />
      <ResearchRow
        label="Behaviour-only"
        value={derived.behaviorOnly ? 'Yes' : 'No'}
        valueClass={derived.behaviorOnly ? 'text-orange' : 'text-white'}
      />
      <p className="text-[10.5px] font-semibold text-white/40 mt-3 leading-relaxed">
        Raw video is not stored. Derived features only.
      </p>
    </ResearchCard>
  );
}

function ReliabilityBar({ label, value, detail, color }) {
  const shown = value ?? 0;
  return (
    <div className="py-1">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11.5px] font-semibold text-white/55">{label}</span>
        <span className="text-[11.5px] font-display font-bold text-white">{prob(value)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-1.5">
        <div className="h-full rounded-full" style={{ width: `${shown * 100}%`, background: color }} />
      </div>
      {detail ? <p className="text-[10px] font-semibold text-white/40 mt-1">{detail}</p> : null}
    </div>
  );
}
