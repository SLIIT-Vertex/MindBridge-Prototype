import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, Hourglass, Lightbulb, ShieldCheck, ThumbsUp } from 'lucide-react';

import { useLearnerState } from '../context/LearnerStateContext';
import { COMPANION_COPY } from '../data/learner-state/childCopy';
import Mascot from '../components/Mascot';
import AppHeader from '../components/AppHeader';
import CameraStateIndicator from '../components/learner-state/CameraStateIndicator';

/**
 * "How Mindy Helps" — the child's own explanation of adaptive support.
 *
 * Every string comes from childCopy.js. There is no probability, no reliability,
 * no feature list, no window length and no link into the research screens: the
 * technical version of this page lives in the Parent Area as `/state-fusion`.
 *
 * Type is deliberately larger than the adult screens (15px body, 16px headings)
 * because the reader is nine.
 */

const ICONS = { Hourglass, Lightbulb, Heart, ThumbsUp };

export default function LearningCompanion() {
  const navigate = useNavigate();
  const { derived } = useLearnerState();

  return (
    <div className="pb-8">
      <AppHeader title={COMPANION_COPY.title} />

      <div className="px-5 mt-2 mb-6 flex flex-col items-center text-center">
        <Mascot size={96} mood="happy" />
        <p className="font-display font-bold text-[16px] text-ink mt-3 max-w-[290px] leading-snug">
          {COMPANION_COPY.intro}
        </p>
      </div>

      <div className="px-5 flex flex-col gap-3.5">
        <div className="bg-white rounded-2xl p-4 card-shadow">
          <p className="text-[11px] font-bold text-ink-faint uppercase tracking-wide mb-2.5">
            {COMPANION_COPY.cameraHeading}
          </p>
          <CameraStateIndicator mode={derived.effectiveCameraMode} audience="child" showDetail />
        </div>

        {COMPANION_COPY.cards.map((card) => {
          const Icon = ICONS[card.icon] ?? Heart;
          return (
            <div key={card.id} className="bg-white rounded-2xl p-4 card-shadow flex items-start gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.bg }}
              >
                <Icon size={22} color={card.color} strokeWidth={1.9} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-[15px] text-ink leading-snug">
                  {card.title}
                </p>
                <p className="text-[13.5px] font-semibold text-ink-soft mt-1 leading-relaxed">
                  {card.body}
                </p>
              </div>
            </div>
          );
        })}

        <div className="bg-teal-light rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={20} className="text-teal" strokeWidth={1.9} aria-hidden="true" />
          </div>
          <p className="font-display font-bold text-[14px] text-ink leading-snug min-w-0">
            {COMPANION_COPY.privacyLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/smart-learning-support')}
          className="w-full min-h-13 py-4 bg-primary text-white font-display font-bold text-[16px] rounded-full active:scale-95 transition-transform"
        >
          {COMPANION_COPY.cta}
        </button>

        {/* Quiet, adult-sized link out of the child experience. */}
        <button
          type="button"
          onClick={() => navigate('/privacy')}
          className="w-full min-h-12 flex items-center justify-center gap-1 text-ink-faint font-display font-bold text-[12px]"
        >
          {COMPANION_COPY.grownUps}
          <ChevronRight size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
