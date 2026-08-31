import { Check, X } from 'lucide-react';

import { ERROR_CODE_LABELS } from '../../data/adaptive-learning/misconceptions';

/**
 * The last few captured evidence events: item id, correct/incorrect, error code
 * and response time.
 *
 * This is the raw material the whole research loop reasons over, so it is shown
 * verbatim rather than summarised. Correctness is marked with a tick or a cross
 * as well as a colour, so it reads in greyscale.
 *
 * Baseline events appear here even though they are excluded from the belief model
 * and difficulty counters (decision D5) — they are genuine evidence of what the
 * learner could do unaided, and hiding them would misrepresent the log.
 */

const PHASE_LABELS = {
  baseline: 'Baseline',
  gameplay: 'Gameplay',
  supported: 'Supported',
  independent: 'Independent',
};

function formatSeconds(ms) {
  if (ms == null) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function EvidenceTimeline({ events }) {
  if (!events || events.length === 0) {
    return <p className="text-[11.5px] font-semibold text-white/40">No responses captured yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {events.map((event, index) => (
        <li
          key={`${event.questionId}-${event.attemptNumber}-${index}`}
          className="flex items-start gap-2.5"
        >
          <span
            className={`mt-[1px] w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
              event.isCorrect ? 'bg-success' : 'bg-coral'
            }`}
          >
            {event.isCorrect ? (
              <Check size={10} className="text-white" strokeWidth={3.5} aria-hidden="true" />
            ) : (
              <X size={10} className="text-white" strokeWidth={3.5} aria-hidden="true" />
            )}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-display font-bold text-white truncate">
                {event.questionId}
              </span>
              <span className="text-[10.5px] font-semibold text-white/55 tabular-nums flex-shrink-0">
                {formatSeconds(event.responseTimeMs)}
              </span>
            </div>

            <p className="text-[9.5px] font-semibold text-white/40">
              {PHASE_LABELS[event.phase] ?? event.phase}
              {event.attemptNumber > 1 ? ` · attempt ${event.attemptNumber}` : ''}
              {event.supportActive ? ' · with support' : ''}
            </p>

            {event.errorCode ? (
              <p className="text-[10px] font-semibold text-coral mt-0.5">
                {ERROR_CODE_LABELS[event.errorCode] ?? event.errorCode}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
