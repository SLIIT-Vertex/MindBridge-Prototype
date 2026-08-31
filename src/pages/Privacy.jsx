import { useState } from 'react';
import {
  ChevronDown,
  EyeOff,
  ShieldCheck,
  ThumbsUp,
  Trash2,
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { CAMERA_PERMISSION, useLearnerState } from '../context/LearnerStateContext';
import { CAMERA_MODE, PRIVACY_COPY, TEMPORAL_COPY } from '../data/learner-state/supportCopy';
import { CHILD_PRIVACY_COPY } from '../data/learner-state/childCopy';
import { VISUAL_FEATURE_LIST } from '../data/learner-state/pipeline';
import AppHeader from '../components/AppHeader';
import CameraStateIndicator from '../components/learner-state/CameraStateIndicator';

/**
 * Privacy, written twice.
 *
 * The child reads three plain promises in large type. The technical basis for
 * those promises — feature names, retention, the temporal claim — sits in a
 * collapsed "For grown-ups" section, closed by default so a nine-year-old is
 * never shown a list of the measurements taken from their face.
 */
export default function Privacy() {
  const { setVisualSupport } = useApp();
  const { requestedCameraMode, enableCamera, disableCamera } = useLearnerState();
  const [deleteMessage, setDeleteMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const cameraOn = requestedCameraMode === CAMERA_MODE.ACTIVE;
  const ICONS = { EyeOff, ShieldCheck, ThumbsUp };

  async function toggleCamera() {
    if (cameraOn) {
      disableCamera();
      setVisualSupport(false);
      return;
    }
    setBusy(true);
    const result = await enableCamera();
    setBusy(false);
    setVisualSupport(result.permission === CAMERA_PERMISSION.GRANTED);
  }

  function requestDelete() {
    setDeleteMessage('Done. Nothing from this session is kept.');
  }

  return (
    <div className="pb-8">
      <AppHeader title={CHILD_PRIVACY_COPY.title} />

      <div className="px-5 mt-2 flex flex-col gap-3.5">
        <div className="bg-teal-light rounded-2xl p-5 flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <EyeOff size={22} className="text-teal" strokeWidth={1.9} aria-hidden="true" />
          </div>
          <p className="font-display font-bold text-[16px] text-ink leading-snug min-w-0">
            {CHILD_PRIVACY_COPY.headline}
          </p>
        </div>

        {CHILD_PRIVACY_COPY.points.map((point) => {
          const Icon = ICONS[point.icon] ?? ShieldCheck;
          return (
            <div key={point.id} className="bg-white rounded-2xl p-4 card-shadow flex items-start gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: point.bg }}
              >
                <Icon size={20} color={point.color} strokeWidth={1.9} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-[14.5px] text-ink leading-snug">
                  {point.title}
                </p>
                <p className="text-[13px] font-semibold text-ink-soft mt-1 leading-relaxed">
                  {point.body}
                </p>
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-2xl p-4 card-shadow">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display font-bold text-[14.5px] text-ink min-w-0">Use the camera</p>
            {/* The track stays 30px tall for looks; the button around it is
                padded out to a 46px hit area for small fingers. */}
            <button
              type="button"
              role="switch"
              aria-checked={cameraOn}
              aria-label="Use the camera"
              disabled={busy}
              onClick={toggleCamera}
              className="p-2 -m-2 flex-shrink-0 disabled:opacity-60"
            >
              <span
                className={`block w-14 rounded-full relative transition-colors ${
                  cameraOn ? 'bg-primary' : 'bg-cream-deep'
                }`}
                style={{ height: 30 }}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all shadow ${
                    cameraOn ? 'left-[30px]' : 'left-0.5'
                  }`}
                />
              </span>
            </button>
          </div>
          <div className="mt-3.5 pt-3.5 border-t border-cream-deep">
            <CameraStateIndicator mode={requestedCameraMode} audience="child" showDetail />
          </div>
        </div>

        <button
          type="button"
          onClick={requestDelete}
          className="w-full bg-white rounded-2xl p-4 card-shadow flex items-center gap-3.5 text-left active:scale-[0.98] transition-transform"
        >
          <div className="w-11 h-11 rounded-2xl bg-coral-light flex items-center justify-center flex-shrink-0">
            <Trash2 size={20} className="text-coral" strokeWidth={1.9} aria-hidden="true" />
          </div>
          <p className="font-display font-bold text-[14.5px] text-ink min-w-0">
            Clear this session
          </p>
        </button>

        {deleteMessage && (
          <p
            role="status"
            className="text-[13px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5 leading-relaxed"
          >
            {deleteMessage}
          </p>
        )}

        {/* Everything technical lives below this line, closed by default. */}
        <div className="bg-white rounded-2xl card-shadow overflow-hidden mt-1">
          <button
            type="button"
            onClick={() => setDetailOpen((open) => !open)}
            aria-expanded={detailOpen}
            className="w-full min-h-12 px-4 py-3 flex items-center justify-between gap-3 text-left"
          >
            <span className="min-w-0">
              <span className="block font-display font-bold text-[13px] text-ink">
                {CHILD_PRIVACY_COPY.grownUpsTitle}
              </span>
              <span className="block text-[11px] font-semibold text-ink-soft mt-0.5">
                {CHILD_PRIVACY_COPY.grownUpsHint}
              </span>
            </span>
            <ChevronDown
              size={17}
              className={`text-ink-faint flex-shrink-0 transition-transform ${detailOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {detailOpen && (
            <div className="px-4 pb-4 pt-1 border-t border-cream-deep flex flex-col gap-3">
              <DetailBlock title="What the camera step produces" body={PRIVACY_COPY.features}>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {VISUAL_FEATURE_LIST.map((feature) => (
                    <span
                      key={feature}
                      className="text-[10.5px] font-semibold text-sky rounded-full px-2.5 py-1 bg-sky-light"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </DetailBlock>

              <DetailBlock
                title="Identity"
                body={`${PRIVACY_COPY.noIdentity} Frames are processed and discarded inside the current window; nothing is uploaded or written to storage.`}
              />
              <DetailBlock title="Estimation" body={TEMPORAL_COPY} />
              <DetailBlock
                title="Learning behaviour"
                body="Response time, incorrect and repeated attempts, hint usage, inactivity, recent performance, task completion and interaction frequency. Used with or without the camera."
              />
              <DetailBlock
                title="Prototype scope"
                body="Session evidence is held in memory for the current session only and is cleared on refresh. This is a research prototype and does not claim a production security implementation. It estimates when learning support may help; it is not a medical or psychological assessment."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ title, body, children }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-ink-faint uppercase tracking-wide mb-1">{title}</p>
      <p className="text-[12px] font-semibold text-ink-soft leading-relaxed">{body}</p>
      {children}
    </div>
  );
}
