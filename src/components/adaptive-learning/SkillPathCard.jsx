import { motion } from 'framer-motion';
import { ArrowRight, Lock, Play } from 'lucide-react';

import ProgressBar from '../ProgressBar';
import { PREVIEW_LABEL } from '../../data/adaptive-learning/curriculum';

/**
 * One skill inside a curriculum area.
 *
 * Same lock contract as CurriculumCard: preview skills are not buttons, not
 * clickable, and labelled Full System Area. The playable skill is the only
 * entry into the Pattern Temple research loop.
 */

export default function SkillPathCard({ skill, index = 0, accent = '#6C5CE7', onOpen }) {
  const playable = skill.status === 'playable';

  const inner = (
    <div className="flex items-center gap-3.5">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: playable ? '#EFECFD' : '#F2EDE1' }}
      >
        {playable ? (
          <Play size={18} color={accent} fill={accent} aria-hidden="true" />
        ) : (
          <Lock size={18} className="text-ink-faint" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-[13.5px] text-ink leading-snug">{skill.name}</p>
        {playable && skill.blurb ? (
          <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed mt-0.5">
            {skill.blurb}
          </p>
        ) : null}

        {playable ? (
          <>
            <div className="mt-2.5">
              <ProgressBar pct={0} color={accent} height={7} />
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="inline-flex items-center bg-primary-light text-primary-dark font-display font-bold text-[10.5px] rounded-full px-2.5 py-1">
                Playable
              </span>
              <span className="inline-flex items-center gap-0.5 font-display font-bold text-[12px] text-primary">
                Open
                <ArrowRight size={14} strokeWidth={2.6} aria-hidden="true" />
              </span>
            </div>
          </>
        ) : (
          <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
            {PREVIEW_LABEL}
          </p>
        )}
      </div>
    </div>
  );

  if (playable) {
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={onOpen}
        className="w-full text-left bg-white rounded-2xl p-4 card-shadow"
        aria-label={`Open ${skill.name}`}
      >
        {inner}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 0.6, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="w-full text-left bg-white rounded-2xl p-4 card-shadow pointer-events-none select-none"
      aria-disabled="true"
    >
      {inner}
    </motion.div>
  );
}
