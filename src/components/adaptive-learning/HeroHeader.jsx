import { motion } from 'framer-motion';

import AvatarIcon from '../AvatarIcon';
import { useApp } from '../../context/AppContext';
import { AVATARS } from '../../data/mockData';

const JOURNEY_DECORATION = '/curriculum/header_adventure_decoration.svg';

/**
 * Learn tab hero: playful two-line title on the left, learner avatar and a
 * secondary journey landscape on the right.
 *
 * The decoration is absolutely positioned and non-interactive so it can never
 * take a tap or push the title text around.
 */

export default function HeroHeader() {
  const { avatarId } = useApp();
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0];

  return (
    <header className="relative">
      <img
        src={JOURNEY_DECORATION}
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute top-[38px] -right-10 w-[205px] max-[400px]:top-[34px] max-[400px]:w-[172px] opacity-[0.9]"
      />

      <div className="relative flex items-start justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative min-w-0"
        >
          <svg
            className="pointer-events-none absolute -left-3 -top-2 w-6"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g stroke="#FFC93C" strokeWidth="3" strokeLinecap="round">
              <path d="M4 12 9 8" />
              <path d="M7 19 12 17" />
            </g>
          </svg>

          <h1
            className="font-display font-extrabold text-[38px] max-[400px]:text-[33px] leading-[0.98] tracking-[-0.01em]"
            style={{ color: '#23116E' }}
          >
            Learn
            <br />
            <span style={{ color: '#0D65C9' }}>While </span>
            <span className="relative" style={{ color: '#EA3179' }}>
              Playing
              <svg
                className="pointer-events-none absolute -right-4 top-1 w-4"
                viewBox="0 0 20 24"
                aria-hidden="true"
              >
                <g stroke="#FFC93C" strokeWidth="3" strokeLinecap="round">
                  <path d="M3 6 9 4" />
                  <path d="M4 13 11 13" />
                  <path d="M3 20 9 21" />
                </g>
              </svg>
            </span>
          </h1>

          <p
            className="font-display font-bold text-[19px] max-[400px]:text-[17px] leading-tight mt-[18px]"
            style={{ color: '#6650E8' }}
          >
            Grade 5 Scholarship Preparation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="relative w-[68px] h-[68px] max-[400px]:w-[60px] max-[400px]:h-[60px] rounded-full p-[3px] flex-shrink-0"
          style={{
            background: '#FBF1DF',
            boxShadow: '0 6px 14px rgba(46, 42, 69, 0.10)',
          }}
        >
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
            <AvatarIcon variant={avatar.emoji} size={56} className="w-full h-full" />
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.14 }}
        className="relative text-left text-[16px] font-medium leading-[1.4] mt-3.5"
        style={{ color: '#4B4D6B' }}
      >
        Build scholarship skills through
        <br />
        fun interactive missions.
      </motion.p>
    </header>
  );
}
