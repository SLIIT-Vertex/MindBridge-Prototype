import { motion, useReducedMotion } from 'framer-motion';

import ArrowGlyph from './glyphs/ArrowGlyph';
import { GLYPH_COLORS } from './glyphs/glyphTokens';

/**
 * Shared teaching graphic: a circle split into four slices so a Grade 5 learner
 * can see what "one quarter turn clockwise" actually is.
 */

export const DIRECTIONS = [
  { rotation: 0, label: 'Up' },
  { rotation: 90, label: 'Right' },
  { rotation: 180, label: 'Down' },
  { rotation: 270, label: 'Left' },
];

export function wrapRotation(deg) {
  return ((deg % 360) + 360) % 360;
}

export function directionAt(rotation) {
  return DIRECTIONS.find((entry) => entry.rotation === wrapRotation(rotation)) ?? DIRECTIONS[0];
}

function polar(cx, cy, deg, radius) {
  const radians = ((deg - 90) * Math.PI) / 180;
  return [cx + radius * Math.cos(radians), cy + radius * Math.sin(radians)];
}

function wedgePath(cx, cy, fromDeg, slices, radius) {
  const start = polar(cx, cy, fromDeg, radius);
  const end = polar(cx, cy, fromDeg + slices * 90, radius);
  const large = slices > 2 ? 1 : 0;
  return `M ${cx} ${cy} L ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${large} 1 ${end[0]} ${end[1]} Z`;
}

export function DirectionTile({ rotation, size = 48, dim = false, emphasize = false }) {
  const dir = directionAt(rotation);

  return (
    <div className={`flex flex-col items-center gap-0.5 ${dim ? 'opacity-35' : ''}`}>
      <div
        className={`bg-white rounded-xl flex items-center justify-center ${
          emphasize ? 'ring-2 ring-primary card-shadow' : 'card-shadow'
        }`}
        style={{ width: size, height: size }}
      >
        <ArrowGlyph rotation={rotation} size={Math.round(size * 0.7)} animate={false} />
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wide text-ink-soft">{dir.label}</span>
    </div>
  );
}

export function QuarterChip() {
  return (
    <span
      className="w-6 h-6 rounded-full bg-primary-light text-primary text-[10px] font-display font-extrabold flex items-center justify-center flex-shrink-0"
      aria-hidden="true"
    >
      ¼
    </span>
  );
}

/** Tiny pie used on the "how many quarters?" options. */
export function QuarterCountIcon({ quarters = 1, size = 34 }) {
  const cx = 40;
  const cy = 40;
  const radius = 28;
  const slices = Math.min(4, Math.max(1, quarters));

  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <circle cx={cx} cy={cy} r={radius} fill="#EFECFD" />
      <path d={wedgePath(cx, cy, 0, slices, radius)} fill={GLYPH_COLORS.primary} opacity="0.9" />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={GLYPH_COLORS.primary} strokeWidth="2.5" />
      {[0, 90, 180, 270].map((deg) => {
        const [x, y] = polar(cx, cy, deg, radius);
        return (
          <line
            key={deg}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke={GLYPH_COLORS.primary}
            strokeWidth="1.5"
            opacity="0.35"
          />
        );
      })}
    </svg>
  );
}

export default function QuarterTurnDiagram({ from = 0, size = 156, compact = false }) {
  const reduceMotion = useReducedMotion();
  const fromDir = directionAt(from);
  const toDir = directionAt(from + 90);
  const cx = 80;
  const cy = 80;
  const radius = 50;
  const [startX, startY] = polar(cx, cy, from, radius);
  const [endX, endY] = polar(cx, cy, from + 90, radius);

  const labelPos = [
    { ...DIRECTIONS[0], x: 80, y: 14 },
    { ...DIRECTIONS[1], x: 148, y: 84 },
    { ...DIRECTIONS[2], x: 80, y: 154 },
    { ...DIRECTIONS[3], x: 22, y: 84 },
  ];

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx={cx} cy={cy} r={radius + 6} fill="#EFECFD" />
        <motion.path
          d={wedgePath(cx, cy, from, 1, radius)}
          fill={GLYPH_COLORS.primary}
          opacity="0.28"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.28 }}
        />
        {[0, 90, 180, 270].map((deg) => {
          const [x, y] = polar(cx, cy, deg, radius);
          return (
            <line
              key={deg}
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke="#B9AEF2"
              strokeWidth="2"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#6C5CE7" strokeWidth="3" />
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="#6C5CE7"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx={endX} cy={endY} r="5" fill="#6C5CE7" />
        <text
          x={cx}
          y={cy + 6}
          textAnchor="middle"
          fill="#6C5CE7"
          fontSize="22"
          fontWeight="800"
          fontFamily="inherit"
        >
          ¼
        </text>
        {compact
          ? null
          : labelPos.map((entry) => (
              <text
                key={entry.label}
                x={entry.x}
                y={entry.y}
                textAnchor="middle"
                fill={
                  entry.rotation === fromDir.rotation || entry.rotation === toDir.rotation
                    ? '#6C5CE7'
                    : '#6E6A88'
                }
                fontSize="11"
                fontWeight="700"
                fontFamily="inherit"
              >
                {entry.label}
              </text>
            ))}
      </svg>
      {compact ? null : (
        <p className="mt-1 font-display font-bold text-[13px] text-primary leading-snug px-2 text-center">
          One quarter turn: {fromDir.label} → {toDir.label}
        </p>
      )}
    </div>
  );
}
