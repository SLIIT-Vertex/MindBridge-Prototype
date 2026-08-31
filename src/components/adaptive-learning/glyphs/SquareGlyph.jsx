import { motion } from 'framer-motion';
import {
  GLYPH_COLORS,
  GLYPH_VIEWBOX,
  ROTATION_TRANSFORM_STYLE,
  ROTATION_TRANSITION,
} from './glyphTokens';

/**
 * Rounded square with a marked corner, used by Independent Check item GI-PS-I03.
 *
 * At rotation 0 the marked corner is TOP-LEFT. As with the triangle, the mark is
 * what makes the rotation readable — an unmarked square is identical every 90
 * degrees.
 *
 * The dot is at (34,34) rather than (30,30): the rx=10 corner rounding cuts the
 * true corner away, and a dot centred closer in would overlap that arc.
 */
export default function SquareGlyph({
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
        <rect
          x="18"
          y="18"
          width="64"
          height="64"
          rx="10"
          fill="none"
          stroke={color}
          strokeWidth={9}
        />
        <circle cx="34" cy="34" r="8" fill={markColor} />
      </motion.g>
    </svg>
  );
}
