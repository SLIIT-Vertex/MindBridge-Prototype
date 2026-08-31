/**
 * Meaningful-difficulty detection. Pure module.
 *
 * Difficulty fires only when at least two independent signals agree, so a single
 * accidental error never triggers support. Thresholds are tuned so the scripted
 * demo triggers on the third related error (17.6s average, confidence 0.84).
 *
 * Confidence is a presentation heuristic, not a validated statistic — always
 * render it beside a "Prototype simulation" caption.
 */

import { ERROR_CODE_LABELS } from '../../data/adaptive-learning/misconceptions';

export const THRESHOLDS = {
  RELATED_ERRORS: 3,
  DOMINANT_ERROR_COUNT: 3,
  AVG_ERROR_RESPONSE_MS: 15000,
  ATTEMPTS_ON_ITEM: 2,
};

/** How many signals must agree before support is triggered. */
export const SIGNALS_REQUIRED = 2;

const CONFIDENCE_BASE = 0.4;
const CONFIDENCE_PER_SIGNAL = 0.11;
const CONFIDENCE_CEILING = 0.9;

/** Each `test` receives the gameplay evidence snapshot and returns a boolean. */
export const SIGNAL_DEFINITIONS = [
  {
    id: 'A',
    label: `${THRESHOLDS.RELATED_ERRORS}+ related incorrect responses`,
    test: (e) => (e.relatedErrors ?? 0) >= THRESHOLDS.RELATED_ERRORS,
    describe: (e) => `${e.relatedErrors} related rotation errors`,
  },
  {
    id: 'B',
    label: `Same error pattern repeated ${THRESHOLDS.DOMINANT_ERROR_COUNT}+ times`,
    test: (e) => (e.dominantErrorCodeCount ?? 0) >= THRESHOLDS.DOMINANT_ERROR_COUNT,
    describe: (e) =>
      `Repeated ${ERROR_CODE_LABELS[e.dominantErrorCode] ?? 'related'} (${e.dominantErrorCodeCount}x)`,
  },
  {
    id: 'C',
    label: `Average response time above ${THRESHOLDS.AVG_ERROR_RESPONSE_MS / 1000}s`,
    test: (e) => (e.avgResponseTimeOnErrorsMs ?? 0) > THRESHOLDS.AVG_ERROR_RESPONSE_MS,
    describe: (e) =>
      `Average response time above threshold (${(e.avgResponseTimeOnErrorsMs / 1000).toFixed(1)}s)`,
  },
  {
    id: 'D',
    label: `${THRESHOLDS.ATTEMPTS_ON_ITEM}+ attempts on the same item`,
    test: (e) => (e.attemptsOnCurrentItem ?? 0) >= THRESHOLDS.ATTEMPTS_ON_ITEM,
    describe: (e) => `${e.attemptsOnCurrentItem} attempts on the same item`,
  },
  {
    id: 'E',
    label: 'Learner asked for help',
    test: (e) => e.explicitHelpRequested === true,
    describe: () => 'Learner explicitly asked for help',
  },
];

/** Evaluates an evidence snapshot built by `buildEvidence`. */
export function detectDifficulty(evidence = {}) {
  const signals = SIGNAL_DEFINITIONS.map((signal) => ({
    id: signal.id,
    label: signal.label,
    met: Boolean(signal.test(evidence)),
  }));

  const metSignals = signals.filter((signal) => signal.met);
  const signalsMet = metSignals.length;
  const detected = signalsMet >= SIGNALS_REQUIRED;

  const evidenceLines = metSignals.map((signal) => {
    const definition = SIGNAL_DEFINITIONS.find((d) => d.id === signal.id);
    return definition.describe(evidence);
  });

  return {
    detected,
    // 0 until difficulty fires, so the UI cannot imply a decision was made.
    confidence: detected ? computeConfidence(signalsMet) : 0,
    signalsMet,
    signals,
    evidence: evidenceLines,
    dominantErrorCode: evidence.dominantErrorCode ?? null,
  };
}

/** min(0.9, 0.4 + 0.11 * signalsMet), rounded to 2dp to keep float noise out of the UI. */
export function computeConfidence(signalsMet) {
  const raw = CONFIDENCE_BASE + CONFIDENCE_PER_SIGNAL * signalsMet;
  return Math.round(Math.min(CONFIDENCE_CEILING, raw) * 100) / 100;
}

/** Builds the evidence snapshot from reducer gameplay counters. */
export function buildEvidence({
  relatedErrors = 0,
  errorCodeCounts = {},
  dominantErrorCode = null,
  avgResponseTimeOnErrorsMs = 0,
  attemptsOnCurrentItem = 0,
  explicitHelpRequested = false,
} = {}) {
  return {
    relatedErrors,
    dominantErrorCode,
    dominantErrorCodeCount: dominantErrorCode ? (errorCodeCounts[dominantErrorCode] ?? 0) : 0,
    avgResponseTimeOnErrorsMs,
    attemptsOnCurrentItem,
    explicitHelpRequested,
  };
}

export const DIFFICULTY_CAVEAT =
  'Prototype simulation — confidence is not statistically validated.';
