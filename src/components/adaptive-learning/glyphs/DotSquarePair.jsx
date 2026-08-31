import { GLYPH_COLORS, GLYPH_VIEWBOX } from './glyphTokens';

/**
 * Two side-by-side cells for the alternating-position item GI-PS-B02.
 *
 * `order` is a hyphenated pair naming the left cell then the right cell:
 *   'dot-square'  ->  filled circle, outlined square
 *   'square-dot'  ->  outlined square, filled circle
 *   'dot-dot'     ->  both circles  (the position-tracking distractor)
 *
 * Rotation does not apply here — the transformation tested is a swap of position,
 * not a turn. Shares the 100x100 viewBox of the rotation glyphs so SymbolRenderer
 * can size every symbol identically.
 */

const SLOT_X = { left: 29, right: 71 };
const CENTER_Y = 50;

function Cell({ kind, cx, color }) {
  if (kind === 'dot') {
    return <circle cx={cx} cy={CENTER_Y} r="15" fill={color} />;
  }
  return (
    <rect
      x={cx - 15}
      y={CENTER_Y - 15}
      width="30"
      height="30"
      rx="7"
      fill="none"
      stroke={color}
      strokeWidth={8}
    />
  );
}

export default function DotSquarePair({
  order = 'dot-square',
  size = 64,
  color = GLYPH_COLORS.ink,
  className = '',
}) {
  const [left, right] = order.split('-');

  return (
    <svg
      width={size}
      height={size}
      viewBox={GLYPH_VIEWBOX}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <Cell kind={left} cx={SLOT_X.left} color={color} />
      <Cell kind={right} cx={SLOT_X.right} color={color} />
    </svg>
  );
}
