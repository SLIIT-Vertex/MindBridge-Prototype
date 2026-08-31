import { Camera, Check } from 'lucide-react';

import { CAMERA_ASK_COPY } from '../../data/learner-state/childCopy';

/**
 * The camera question, asked in words a child and a parent can both read.
 *
 * "No, keep it off" is a full-size button beside "Yes", not a link underneath,
 * because behaviour-only mode is a supported way to use the product rather than
 * a degraded one. Nothing here blocks: learning starts either way.
 */
export default function CameraPermissionCard({ onAllow, onDecline, busy = false, error = null }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-sky-light flex items-center justify-center flex-shrink-0">
          <Camera size={22} className="text-sky" strokeWidth={1.9} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-display font-bold text-[16px] text-ink leading-snug">
            {CAMERA_ASK_COPY.title}
          </h2>
          <p className="text-[13.5px] font-semibold text-ink-soft mt-1.5 leading-relaxed">
            {CAMERA_ASK_COPY.body}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {CAMERA_ASK_COPY.points.map((point) => (
          <div key={point} className="flex items-start gap-2.5">
            <span
              className="w-5 h-5 rounded-full bg-teal-light flex items-center justify-center flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <Check size={12} className="text-teal" strokeWidth={3} />
            </span>
            <p className="text-[13px] font-semibold text-ink-soft leading-relaxed min-w-0">{point}</p>
          </div>
        ))}
      </div>

      {error && (
        <p
          role="status"
          className="mt-4 text-[13px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5 leading-relaxed"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={onAllow}
          disabled={busy}
          className="w-full min-h-13 py-4 bg-primary text-white font-display font-bold text-[15.5px] rounded-full active:scale-95 transition-transform disabled:opacity-60"
        >
          {busy ? CAMERA_ASK_COPY.asking : CAMERA_ASK_COPY.allow}
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="w-full min-h-13 py-4 bg-cream-deep text-ink font-display font-bold text-[15px] rounded-full active:scale-95 transition-transform"
        >
          {CAMERA_ASK_COPY.decline}
        </button>
      </div>
    </div>
  );
}
