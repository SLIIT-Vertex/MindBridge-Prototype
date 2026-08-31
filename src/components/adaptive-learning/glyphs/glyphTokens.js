/**
 * Shared constants for the reasoning glyphs.
 *
 * Colours are duplicated as literals rather than read from Tailwind because
 * these are SVG `fill` / `stroke` attributes, not classes.
 */

export const GLYPH_VIEWBOX = '0 0 100 100';

export const GLYPH_COLORS = {
  ink: '#2E2A45',
  inkSoft: '#6E6A88',
  inkFaint: '#A6A2BC',
  primary: '#6C5CE7',
  coin: '#FFC542',
  white: '#FFFFFF',
};

/**
 * Rotation must be applied around the centre of the viewBox.
 *
 * `transformBox: 'view-box'` is set explicitly: browsers have historically
 * disagreed on the default for SVG children, and getting it wrong makes the
 * glyph orbit its own bounding box instead of spinning in place.
 */
export const ROTATION_TRANSFORM_STYLE = {
  transformBox: 'view-box',
  transformOrigin: '50% 50%',
};

/** Slow enough for a child to track the turn (plan section 5.4). */
export const ROTATION_TRANSITION = { duration: 0.6, ease: 'easeInOut' };
