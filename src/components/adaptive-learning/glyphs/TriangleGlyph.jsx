import { motion } from 'framer-motion';
import {
  GLYPH_COLORS,
  GLYPH_VIEWBOX,
  ROTATION_TRANSFORM_STYLE,
  ROTATION_TRANSITION,
} from './glyphTokens';

/**
 * Equilateral triangle, apex UP at rotation 0.
 *
 * The coin-coloured dot marks one corner. Without it the triangle looks
 * identical at 0 / 120 / 240 degrees and its rotation becomes invisible, which
 * would make every triangle question unanswerable.
 *
 * The dot sits at (50,33) rather than exactly on the apex vertex (50,16): a
 * radius-9 circle centred on the vertex itself would spill outside the two
 * sloping edges. At y=33 the triangle is ~20 units wide, so the dot is fully
 * contained while still clearly marking the apex corner.
 */
export default function TriangleGlyph({
  rotation = 0,
  size = 64,
  color = GLYPH_COLORS.ink,
  markColor = GLYPH_COLORS.coin,
  animate = true,
  className = '',
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={GLYPH_VIEWBOX}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <motion.g
        style={ROTATION_TRANSFORM_STYLE}
        initial={false}
        animate={{ rotate: rotation }}
        transition={animate ? ROTATION_TRANSITION : { duration: 0 }}
      >
        <polygon
          points="50,16 86,78 14,78"
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        <circle cx="50" cy="33" r="9" fill={markColor} />
      </motion.g>
    </svg>
  );
}
