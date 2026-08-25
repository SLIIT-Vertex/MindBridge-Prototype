import { Activity, Camera, CameraOff } from 'lucide-react';

export default function LearnerSupportStatus({ cameraEnabled, compact = false }) {
  const Icon = cameraEnabled ? Camera : CameraOff;
  const label = cameraEnabled ? 'Learning Support Active' : 'Behaviour-based support active';

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full bg-teal-light text-[#0F8C77] font-display font-bold ${
        compact ? 'px-3 py-1.5 text-[10.5px]' : 'px-3.5 py-2 text-[11.5px]'
      }`}
      aria-label={label}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-40 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      {label}
      {compact ? <Icon size={13} aria-hidden="true" /> : <Activity size={14} aria-hidden="true" />}
    </div>
  );
}

