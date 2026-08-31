import { Activity, Camera, CameraOff, SunDim } from 'lucide-react';

import { CAMERA_MODE, CAMERA_MODE_COPY } from '../../data/learner-state/supportCopy';
import { CHILD_CAMERA_COPY } from '../../data/learner-state/childCopy';

/**
 * Camera state chip.
 *
 * `audience` picks the vocabulary, and it is the only difference between the two
 * versions. A child reads "Camera is fuzzy"; the research panel reads "Visual
 * Signal Limited". Neither ever shows a reliability number.
 */

const STYLES = {
  [CAMERA_MODE.ACTIVE]: { icon: Camera, bg: 'bg-teal-light', text: 'text-[#0F8C77]', dot: 'bg-teal' },
  [CAMERA_MODE.LIMITED]: { icon: SunDim, bg: 'bg-orange-light', text: 'text-[#C1650F]', dot: 'bg-orange' },
  [CAMERA_MODE.OFF]: { icon: CameraOff, bg: 'bg-cream-deep', text: 'text-ink-soft', dot: 'bg-ink-faint' },
  [CAMERA_MODE.DENIED]: { icon: CameraOff, bg: 'bg-cream-deep', text: 'text-ink-soft', dot: 'bg-ink-faint' },
};

export default function CameraStateIndicator({
  mode = CAMERA_MODE.OFF,
  audience = 'child',
  compact = false,
  showDetail = false,
}) {
  const source = audience === 'child' ? CHILD_CAMERA_COPY : CAMERA_MODE_COPY;
  const copy = source[mode] ?? source[CAMERA_MODE.OFF];
  const style = STYLES[mode] ?? STYLES[CAMERA_MODE.OFF];
  const Icon = audience === 'child' ? style.icon : (STYLES[mode]?.icon ?? Activity);
  const live = mode === CAMERA_MODE.ACTIVE;

  const chip = (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-display font-bold ${style.bg} ${style.text} ${
        compact ? 'px-3 py-2 text-[12px]' : 'px-4 py-2.5 text-[13px]'
      }`}
    >
      <span className="relative flex h-2 w-2 flex-shrink-0" aria-hidden="true">
        {live && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${style.dot} opacity-40 animate-ping motion-reduce:animate-none`}
          />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`} />
      </span>
      {copy.label}
      <Icon size={compact ? 14 : 15} className="flex-shrink-0" aria-hidden="true" />
    </span>
  );

  if (!showDetail) return chip;

  return (
    <div className="flex flex-col gap-2">
      {chip}
      <p
        className={`font-semibold text-ink-soft leading-relaxed ${
          audience === 'child' ? 'text-[13px]' : 'text-[11.5px]'
        }`}
      >
        {copy.detail}
      </p>
    </div>
  );
}
