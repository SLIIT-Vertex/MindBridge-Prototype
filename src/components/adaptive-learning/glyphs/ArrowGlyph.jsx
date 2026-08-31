import { motion } from 'framer-motion';
import {
  GLYPH_COLORS,
  GLYPH_VIEWBOX,
  ROTATION_TRANSFORM_STYLE,
  ROTATION_TRANSITION,
} from './glyphTokens';

/**
 * A thick arrow pointing straight UP at rotation 0.
 *
 * See SymbolRenderer.jsx for the rotation contract. In short: positive rotation
 * is clockwise, so 90 points right.
 */
export default function ArrowGlyph({
  rotation = 0,
  size = 64,
  color = GLYPH_COLORS.ink,
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
        <line
          x1="50"
          y1="78"
          x2="50"
          y2="30"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
        />
        <polygon points="50,14 32,38 68,38" fill={color} />
      </motion.g>
    </svg>
  );
}
