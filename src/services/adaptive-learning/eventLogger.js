/**
 * Gameplay evidence capture. Pure module: `timestamp` must be supplied by the
 * caller so events stay reproducible.
 */

import { getOption, isCorrectOption } from '../../data/adaptive-learning/patternQuestions';

export const SESSION_META = {
  sessionId: 'demo-session-001',
  learnerId: 'demo-learner-001',
  learnerName: 'Demo Learner',
  grade: 5,
  domainId: 'GI',
  skillId: 'GI-PS-01',
};

/** Null for a correct answer, so a correct event carries no misconception signal. */
export function deriveErrorCode(question, optionId) {
  if (!question) return null;
  if (isCorrectOption(question, optionId)) return null;
  return getOption(question, optionId)?.errorCode ?? null;
}

/** Builds one immutable evidence event. `attemptNumber` is 1-based. */
export function createEvent({
  question,
  optionId,
  responseTimeMs,
  attemptNumber = 1,
  supportActive = false,
  supportType = null,
  timestamp,
}) {
  const isCorrect = isCorrectOption(question, optionId);
  const correctOption = question?.correctOption ?? null;

  return {
    sessionId: SESSION_META.sessionId,
    learnerId: SESSION_META.learnerId,
    grade: SESSION_META.grade,
    domainId: SESSION_META.domainId,
    skillId: question?.skillId ?? SESSION_META.skillId,
    questionId: question?.id ?? null,
    // Lets consumers keep baseline evidence out of the belief model and counters.
    phase: question?.phase ?? null,
    timestamp,
    selectedAnswer: optionId,
    correctAnswer: correctOption,
    isCorrect,
    responseTimeMs,
    attemptNumber,
    supportActive,
    supportType,
    errorCode: deriveErrorCode(question, optionId),
  };
}

/** Mean response time across a list of events. Returns 0 for an empty list. */
export function averageResponseTime(events) {
  if (!events || events.length === 0) return 0;
  const total = events.reduce((sum, e) => sum + (e.responseTimeMs ?? 0), 0);
  return total / events.length;
}

/** Counts occurrences of each error code across events. */
export function countErrorCodes(events) {
  const counts = {};
  (events ?? []).forEach((event) => {
    if (!event.errorCode) return;
    counts[event.errorCode] = (counts[event.errorCode] ?? 0) + 1;
  });
  return counts;
}

/** The most frequent error code, or null when there is no error evidence. */
export function dominantErrorCode(counts) {
  const entries = Object.entries(counts ?? {});
  if (entries.length === 0) return null;
  return entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best))[0];
}
