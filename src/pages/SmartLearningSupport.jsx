import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

import { useApp } from '../context/AppContext';
import { CAMERA_PERMISSION, useLearnerState } from '../context/LearnerStateContext';
import { CAMERA_MODE } from '../data/learner-state/supportCopy';
import { CAMERA_ASK_COPY, SUPPORT_INTRO_COPY } from '../data/learner-state/childCopy';
import Mascot from '../components/Mascot';
import AppHeader from '../components/AppHeader';
import CameraPermissionCard from '../components/learner-state/CameraPermissionCard';
import CameraStateIndicator from '../components/learner-state/CameraStateIndicator';

/**
 * The way into a monitored learning session.
 *
 * Reads as a friendly hand-off, not a consent form. The camera question is asked
 * once; whichever way it is answered, the same "Start learning" button follows.
 */
export default function SmartLearningSupport() {
  const navigate = useNavigate();
  const { setVisualSupport } = useApp();
  const { cameraPermission, requestedCameraMode, enableCamera, disableCamera } = useLearnerState();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const decided = cameraPermission !== CAMERA_PERMISSION.UNKNOWN;

  async function allowCamera() {
    setBusy(true);
    setError(null);
    const result = await enableCamera();
    setBusy(false);

    if (result.permission === CAMERA_PERMISSION.GRANTED) {
      setVisualSupport(true);
      return;
    }

    setVisualSupport(false);
    setError(
      result.permission === CAMERA_PERMISSION.DENIED
        ? CAMERA_ASK_COPY.declined
        : CAMERA_ASK_COPY.unavailable
    );
  }

  function continueWithoutCamera() {
    disableCamera();
    setVisualSupport(false);
    setError(null);
  }

  return (
    <div className="pb-10">
      <AppHeader title="Learn with Mindy" />

      <div className="px-5 mt-1 flex flex-col gap-3.5">
        <div className="flex flex-col items-center text-center mb-1">
          <Mascot size={84} mood="excited" />
          <h1 className="font-display font-extrabold text-[20px] text-ink mt-2.5 leading-tight">
            {SUPPORT_INTRO_COPY.title}
          </h1>
          <p className="text-[14px] font-semibold text-ink-soft mt-1.5 leading-relaxed max-w-[290px]">
            {SUPPORT_INTRO_COPY.body}
          </p>
        </div>

        {!decided && (
          <CameraPermissionCard
            onAllow={allowCamera}
            onDecline={continueWithoutCamera}
            busy={busy}
            error={error}
          />
        )}

        {decided && (
          <div className="bg-white rounded-2xl p-4 card-shadow">
            <CameraStateIndicator mode={requestedCameraMode} audience="child" showDetail />

            {error && (
              <p
                role="status"
                className="mt-3 text-[13px] font-semibold text-ink-soft bg-cream-deep rounded-2xl p-3.5 leading-relaxed"
              >
                {error}
              </p>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={allowCamera}
                disabled={busy || requestedCameraMode === CAMERA_MODE.ACTIVE}
                className="min-h-12 rounded-full bg-cream-deep text-ink font-display font-bold text-[13px] active:scale-95 transition-transform disabled:opacity-45"
              >
                Turn on
              </button>
              <button
                type="button"
                onClick={continueWithoutCamera}
                disabled={requestedCameraMode === CAMERA_MODE.OFF}
                className="min-h-12 rounded-full bg-cream-deep text-ink font-display font-bold text-[13px] active:scale-95 transition-transform disabled:opacity-45"
              >
                Turn off
              </button>
            </div>
          </div>
        )}

        <div className="bg-orange-light rounded-2xl p-4 flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-orange" strokeWidth={1.9} aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-[14.5px] text-ink">
              {SUPPORT_INTRO_COPY.behaviourTitle}
            </p>
            <p className="text-[13px] font-semibold text-ink-soft mt-1 leading-relaxed">
              {SUPPORT_INTRO_COPY.behaviourBody}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/minigame')}
          className="w-full min-h-13 py-4 bg-primary text-white font-display font-bold text-[16px] rounded-full active:scale-95 transition-transform"
        >
          {SUPPORT_INTRO_COPY.start}
        </button>

        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full min-h-12 flex items-center justify-center gap-1 text-ink-faint font-display font-bold text-[12px]"
        >
          {SUPPORT_INTRO_COPY.privacyLink}
          <ChevronRight size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
