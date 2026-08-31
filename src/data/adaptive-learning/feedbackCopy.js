/**
 * Child-facing answer feedback. Never the word "Wrong", and the noun always
 * matches the symbol on screen so a 10-year-old is not pointed at a shape that
 * is not there.
 */

const SYMBOL_NOUN = { arrow: 'arrow', triangle: 'shape', square: 'shape', pair: 'shapes' };

export function wrongFeedback(question) {
  const noun = SYMBOL_NOUN[question?.sequence?.[0]?.symbol] ?? 'shape';
  return `Not quite — look at how the ${noun} changed.`;
}
