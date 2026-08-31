import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { phaseLabel } from '../../services/adaptive-learning/phaseMachine';

/**
 * Barely-visible presenter HUD: which research step is live, and which support
 * type is on screen. Not part of the child experience — keep contrast low.
 */

const SUPPORT_PHASES = new Set([
  'SUPPORT_SELECTED',
  'SUPPORT_ACTIVE',
  'SUPPORTED_PRACTICE',
  'SUPPORT_WITHDRAWN',
]);

export default function PrototypeStepLabel() {
  const { phase, selectedSupport, supportStatus } = useAdaptive();
  const step = phaseLabel(phase);
  const showSupport =
    Boolean(selectedSupport) &&
    (SUPPORT_PHASES.has(phase) || supportStatus === 'active' || supportStatus === 'removed');

  return (
    <p
      className="min-w-0 flex-1 text-left text-[8.5px] font-semibold uppercase tracking-[0.14em] text-ink/35 leading-snug pr-2"
      aria-hidden="true"
    >
      {step}
      {showSupport ? (
        <>
          <span className="text-ink/20"> · </span>
          {selectedSupport.label}
        </>
      ) : null}
    </p>
  );
}
