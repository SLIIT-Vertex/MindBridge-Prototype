import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

import { PREVIEW_LABEL } from '../../data/adaptive-learning/curriculum';

/**
 * One Grade 5 Scholarship curriculum area on the Learn home.
 *
 * All five areas render with identical geometry — same grid, padding, badge
 * size and pill — so no area reads as more or less important. Only General
 * Intelligence is playable; the rest stay fully colourful (no lock, no
 * "coming soon", no dimming) and simply announce that they belong to the full
 * system rather than this prototype.
 */
export default function CurriculumCard({ area, index = 0, onSelect }) {
  const theme = area.theme ?? {};
  const playable = area.status === 'playable';
  const lines = area.blurbLines ?? [area.blurb];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onSelect?.(area)}
      className="w-full text-left grid grid-cols-[86px_1fr] max-[400px]:grid-cols-[76px_1fr] items-center gap-4 max-[400px]:gap-3 h-[158px] rounded-[26px] max-[400px]:rounded-[22px]"
      style={{
        background: theme.surface ?? '#FFFFFF',
        border: `1.5px solid ${theme.border ?? '#E6E2F5'}`,
        boxShadow:
          '0 6px 18px rgba(31, 31, 60, 0.055), inset 0 1px 0 rgba(255, 255, 255, 0.75)',
        padding: '16px 18px',
      }}
    >
      <div
        className="w-[86px] h-[86px] max-[400px]:w-[76px] max-[400px]:h-[76px] rounded-full p-[4px] flex-shrink-0"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 6px 14px rgba(31, 31, 60, 0.10)',
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
          style={{
            background: theme.badge ?? area.light,
            border: `1px solid ${theme.border ?? '#E6E2F5'}55`,
          }}
        >
          <img
            src={area.badgeArt}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="min-w-0">
        <p
          className="font-display font-extrabold text-[19px] max-[400px]:text-[17px] leading-[1.1]"
          style={{ color: theme.title ?? area.color }}
        >
          {area.name}
        </p>

        <p
          className="text-[13.5px] max-[400px]:text-[12.5px] font-medium leading-[1.35] mt-1.5"
          style={{ color: '#42445F' }}
        >
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          {playable ? null : (
            <span
              className="inline-flex items-center h-[26px] px-3 max-[400px]:px-2.5 rounded-full font-display font-semibold text-[10.5px] max-[400px]:text-[9.5px] uppercase tracking-[0.03em] whitespace-nowrap"
              style={{ background: theme.pill, color: theme.pillText }}
            >
              {PREVIEW_LABEL}
            </span>
          )}

          {playable ? (
            <span
              className="group ml-auto inline-flex items-center gap-0.5 h-[38px] max-[400px]:h-[34px] pl-3.5 pr-2.5 max-[400px]:pl-3 max-[400px]:pr-2 rounded-full font-display font-bold text-[14px] max-[400px]:text-[13px] text-white flex-shrink-0"
              style={{
                background: 'linear-gradient(90deg, #6B35EA 0%, #7446F5 100%)',
                boxShadow:
                  '0 6px 14px rgba(85, 40, 200, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.28)',
              }}
            >
              Start
              <ChevronRight
                size={16}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-[2px]"
                aria-hidden="true"
              />
            </span>
          ) : null}
        </div>
      </div>
    </motion.button>
  );
}
