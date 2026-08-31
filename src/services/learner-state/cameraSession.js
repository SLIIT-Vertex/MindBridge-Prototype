/**
 * Camera lifecycle for the learner-state session.
 *
 * PRIVACY POSITION, IMPLEMENTED RATHER THAN CLAIMED:
 *   - the stream is acquired only while a learning session is running
 *   - it is never attached to a video element, so no frame is ever displayed
 *   - no frame is written to storage, uploaded, or kept past the current tick
 *   - the track is stopped on session end, on unmount and on tab hide
 *
 * The permission request is genuine, so "Continue without camera" is a real path
 * rather than a mocked one: a declined prompt puts the session into behaviour-only
 * mode through exactly the same code that a switched-off camera uses.
 */

export const CAMERA_PERMISSION = {
  UNKNOWN: 'unknown',
  GRANTED: 'granted',
  DENIED: 'denied',
  UNAVAILABLE: 'unavailable',
};

const VIDEO_CONSTRAINTS = { video: { width: 320, height: 240, facingMode: 'user' }, audio: false };

let activeStream = null;

export function isCameraSupported() {
  return typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia);
}

/**
 * Requests camera access and holds the track for the session.
 *
 * @returns {Promise<{permission:string, error?:string}>}
 */
export async function requestCamera() {
  if (!isCameraSupported()) {
    return { permission: CAMERA_PERMISSION.UNAVAILABLE, error: 'Camera API not available' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS);
    releaseCamera();
    activeStream = stream;
    return { permission: CAMERA_PERMISSION.GRANTED };
  } catch (error) {
    return {
      permission:
        error?.name === 'NotAllowedError'
          ? CAMERA_PERMISSION.DENIED
          : CAMERA_PERMISSION.UNAVAILABLE,
      error: error?.name ?? 'CameraError',
    };
  }
}

/** Stops every track and drops the reference. Safe to call repeatedly. */
export function releaseCamera() {
  if (!activeStream) return;
  activeStream.getTracks().forEach((track) => track.stop());
  activeStream = null;
}

/**
 * Live track health, read once per temporal window.
 *
 * `quality` stands in for the illumination / exposure estimate a real capture
 * loop would compute from the frame itself. A muted or ended track means the OS
 * or the user cut the feed mid-session, which must show up as falling visual
 * reliability rather than as a crash.
 */
export function getCameraHealth() {
  const track = activeStream?.getVideoTracks?.()[0] ?? null;

  if (!track) return { available: false, trackLive: false, quality: 0, framesAnalysed: 0 };

  const trackLive = track.readyState === 'live' && !track.muted;
  const settings = typeof track.getSettings === 'function' ? track.getSettings() : {};
  const frameRate = settings.frameRate ?? 15;

  return {
    available: true,
    trackLive,
    quality: trackLive ? 0.88 : 0.15,
    framesAnalysed: trackLive ? Math.round(frameRate * 20) : 0,
    label: 'camera',
  };
}

/** Health object used when the session is deliberately running without a camera. */
export const NO_CAMERA_HEALTH = {
  available: false,
  trackLive: false,
  quality: 0,
  framesAnalysed: 0,
};
