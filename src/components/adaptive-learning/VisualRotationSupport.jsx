import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCw } from 'lucide-react';

import ArrowGlyph from './glyphs/ArrowGlyph';
import QuarterTurnDiagram, { DIRECTIONS } from './QuarterTurnDiagram';
import {
  VISUAL_ROTATION_STEPS,
  VISUAL_ROTATION_PROMPT,
  VISUAL_ROTATION_SUCCESS,
} from '../../data/adaptive-learning/learningSupports';

/**
 * Animated Visual Rotation — watch a real quarter-turn, then do one.
 *
 * Beats: introduce the quarter-turn slice, animate Up → Right → Down → Left,
 * then let the child turn Up to Right themselves.
 */

const STEP_HOLD_MS = 1600;
const INTERACT_START = 0;
const INTERACT_TARGET = 90;
const DRAG_THRESHOLD = 50;

function pointerAngle(event, element) {
  const rect = element.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

function shortestDelta(from, to) {
  let delta = to - from;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

export default function VisualRotationSupport({ onComplete, replay = false }) {
  const reduceMotion = useReducedMotion();
  const padRef = useRef(null);
  const dragStart = useRef(null);

  const [beat, setBeat] = useState('intro');
  const [demoIndex, setDemoIndex] = useState(0);
  const [dragRotation, setDragRotation] = useState(INTERACT_START);

  useEffect(() => {
    if (beat !== 'demo') return undefined;
    if (demoIndex >= VISUAL_ROTATION_STEPS.length - 1) {
      const timer = setTimeout(() => setBeat('interact'), reduceMotion ? 200 : 800);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(
      () => setDemoIndex((index) => index + 1),
      reduceMotion ? 200 : STEP_HOLD_MS
    );
    return () => clearTimeout(timer);
  }, [beat, demoIndex, reduceMotion]);

  const succeed = () => {
    setDragRotation(INTERACT_TARGET);
    setBeat('done');
  };

  const onPointerDown = (event) => {
    if (beat !== 'interact' || !padRef.current) return;
    dragStart.current = pointerAngle(event, padRef.current);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (beat !== 'interact' || dragStart.current == null || !padRef.current) return;
    const delta = shortestDelta(dragStart.current, pointerAngle(event, padRef.current));
    const clockwise = Math.max(0, delta);
    setDragRotation(Math.min(INTERACT_TARGET, clockwise));
    if (clockwise >= DRAG_THRESHOLD) {
      dragStart.current = null;
      succeed();
    }
  };

  const onPointerUp = () => {
    if (beat !== 'interact') return;
    dragStart.current = null;
    setDragRotation((current) => (current >= DRAG_THRESHOLD ? INTERACT_TARGET : INTERACT_START));
  };

  const demoStep = VISUAL_ROTATION_STEPS[demoIndex];
  const rotation = beat === 'demo' ? demoStep.rotation : dragRotation;

  if (beat === 'intro') {
    return (
      <div className="text-center">
        <Header
          title="Animated Visual Rotation"
          subtitle="First: what a quarter turn is."
        />
        <QuarterTurnDiagram from={0} size={168} />
        <p className="mt-3 text-[13px] font-semibold text-ink leading-relaxed px-1">
          A circle has 4 slices. Moving <span className="text-primary font-display font-extrabold">one slice</span> is
          a quarter turn. Clockwise follows a clock: Up → Right → Down → Left.
        </p>
        <button
          type="button"
          onClick={() => setBeat('demo')}
          className="mt-5 w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
        >
          Watch it turn
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Header
        title="Animated Visual Rotation"
        subtitle={
          beat === 'demo'
            ? 'Watch each quarter turn.'
            : beat === 'interact'
              ? 'Now you try one quarter turn.'
              : 'You just made a quarter turn.'
        }
      />

      <div
        ref={padRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`relative mx-auto touch-none select-none ${
          beat === 'interact' ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
        style={{ width: 196, height: 196 }}
        aria-label={
          beat === 'interact'
            ? 'Drag the arrow one quarter-turn clockwise, from Up to Right'
            : 'Arrow rotating one quarter turn clockwise'
        }
      >
        <svg
          viewBox="0 0 196 196"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="98" cy="98" r="78" fill="#EFECFD" />
          <circle
            cx="98"
            cy="98"
            r="62"
            fill="none"
            stroke="#B9AEF2"
            strokeWidth="2"
            strokeDasharray="5 6"
          />
          <motion.path
            d="M 98 36 A 62 62 0 0 1 160 98"
            fill="none"
            stroke="#6C5CE7"
            strokeWidth="4"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: beat === 'demo' && demoIndex === 0 ? 0.2 : 1, opacity: 0.9 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6 }}
          />
          <polygon points="156,86 168,98 156,110" fill="#6C5CE7" />
          {DIRECTIONS.map((entry) => {
            const pos = {
              0: { x: 98, y: 18 },
              90: { x: 178, y: 102 },
              180: { x: 98, y: 186 },
              270: { x: 18, y: 102 },
            }[entry.rotation];
            const active = wrapNear(rotation, entry.rotation);
            return (
              <text
                key={entry.label}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                fill={active ? '#6C5CE7' : '#6E6A88'}
                fontSize="12"
                fontWeight="700"
                fontFamily="inherit"
              >
                {entry.label}
              </text>
            );
          })}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <ArrowGlyph rotation={rotation} size={96} color="#2E2A45" animate={!reduceMotion} />
        </div>
      </div>

      <AnimateCaption>
        {beat === 'interact' ? (
          <p className="mt-3 text-[13px] font-semibold text-ink leading-relaxed px-2">
            {VISUAL_ROTATION_PROMPT}
          </p>
        ) : beat === 'done' ? (
          <p className="mt-3 font-display font-bold text-[14px] text-success leading-snug px-2">
            {VISUAL_ROTATION_SUCCESS}
          </p>
        ) : (
          <p className="mt-3 font-display font-bold text-[14px] text-primary">{demoStep.caption}</p>
        )}
      </AnimateCaption>

      {beat === 'interact' ? (
        <button
          type="button"
          onClick={succeed}
          className="mt-4 min-h-12 px-6 rounded-full bg-primary text-white font-display font-bold text-[13.5px] inline-flex items-center gap-2 active:scale-95 transition-transform"
        >
          <RotateCw size={15} aria-hidden="true" />
          Turn one quarter
        </button>
      ) : null}

      {beat === 'done' ? (
        <button
          type="button"
          onClick={onComplete}
          className="mt-5 w-full min-h-12 bg-primary text-white font-display font-bold text-[14.5px] rounded-full active:scale-95 transition-transform"
        >
          {replay ? 'Back to the puzzle' : "I'm ready to try"}
        </button>
      ) : null}
    </div>
  );
}

function wrapNear(rotation, target) {
  let delta = Math.abs(rotation - target) % 360;
  if (delta > 180) delta = 360 - delta;
  return delta < 20;
}

function Header({ title, subtitle }) {
  return (
    <div className="text-center mb-3">
      <div className="flex items-center justify-center gap-1.5">
        <RotateCw size={15} className="text-primary" aria-hidden="true" />
        <p className="text-[10.5px] font-bold uppercase tracking-wide text-primary">{title}</p>
      </div>
      <p className="text-[11.5px] font-semibold text-ink-soft mt-1 leading-snug px-2">{subtitle}</p>
    </div>
  );
}

function AnimateCaption({ children }) {
  return (
    <motion.div
      key={typeof children === 'string' ? children : children?.props?.children}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
