import ArrowGlyph from './ArrowGlyph';
import TriangleGlyph from './TriangleGlyph';
import SquareGlyph from './SquareGlyph';
import DotSquarePair from './DotSquarePair';

/**
 * The only place that maps a question's `symbol` string to a glyph component,
 * which is what keeps the data layer free of React imports. Entries already carry
 * the `symbol`, `rotation` and `order` keys, so they can be spread in directly:
 *   <SymbolRenderer {...question.sequence[0]} size={64} />
 *
 * ROTATION CONTRACT: positive rotation is ALWAYS clockwise, with 0 = up, 90 =
 * right, 180 = down, 270 = left. Every question encodes "+90 clockwise per step"
 * and every ROTATION_DIRECTION_CONFUSION distractor is the counter-clockwise
 * answer, so inverting this silently turns every correct answer wrong while the
 * glyphs still look plausible. Verify visually at /learn/dev after any edit.
 */

const GLYPHS = {
  arrow: ArrowGlyph,
  triangle: TriangleGlyph,
  square: SquareGlyph,
  pair: DotSquarePair,
};

export default function SymbolRenderer({
  symbol,
  rotation = 0,
  order,
  size = 64,
  color,
  animate = true,
  className = '',
}) {
  const Glyph = GLYPHS[symbol];

  if (!Glyph) {
    console.warn(`[adaptive-learning] Unknown symbol "${symbol}" in SymbolRenderer.`);
    return null;
  }

  if (symbol === 'pair') {
    return <DotSquarePair order={order} size={size} color={color} className={className} />;
  }

  return (
    <Glyph
      rotation={rotation}
      size={size}
      color={color}
      animate={animate}
      className={className}
    />
  );
}
