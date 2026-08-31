import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import SymbolRenderer from '../../components/adaptive-learning/glyphs/SymbolRenderer';
import TempleScene from '../../components/adaptive-learning/scene/TempleScene';
import TempleGate from '../../components/adaptive-learning/scene/TempleGate';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';

import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { SUPPORT_STATUS } from '../../data/adaptive-learning/learningSupports';
import { getQuestion } from '../../data/adaptive-learning/patternQuestions';
import { getScriptedAttempt } from '../../data/adaptive-learning/demoScenario';

/**
 * DEV HARNESS at /learn/dev — not part of the child experience or the demo script.
 * A regression screen for glyphs and research cards, since an inverted rotation
 * would silently break every question in the app.
 */

const ROTATIONS = [0, 90, 180, 270];
const DIAGONALS = [45, 135, 225, 315];
const EXPECTED = { 0: 'up', 90: 'right', 180: 'down', 270: 'left' };
const EXPECTED_DIAGONAL = { 45: 'up-right', 135: 'down-right', 225: 'down-left', 315: 'up-left' };

export default function AdaptiveLearningDevHarness() {
  const navigate = useNavigate();
  const adaptive = useAdaptive();

  // Replays the scripted trajectory so every Research View card can be inspected
  // with real data, producing the same result as playing through by hand.
  const runScriptedSession = () => {
    const {
      answerQuestion,
      goToPhase,
      chooseSupport,
      setSupportStatus,
      recordIndependence,
      updatePolicy,
      resetSession,
    } = adaptive;

    resetSession();

    const answer = (questionId, attemptNumber) => {
      const attempt = getScriptedAttempt(questionId, attemptNumber);
      answerQuestion({
        question: getQuestion(questionId),
        optionId: attempt.optionId,
        responseTimeMs: attempt.responseTimeMs,
      });
    };

    goToPhase('CURRICULUM');
    goToPhase('SKILL_OVERVIEW');
    goToPhase('BASELINE');
    answer('GI-PS-B01', 1);
    answer('GI-PS-B02', 1);
    answer('GI-PS-B03', 1);

    goToPhase('GAMEPLAY');
    answer('PT-G1-Q1', 1);
    answer('PT-G1-Q1', 2);
    answer('PT-G2-Q1', 1);
    answer('PT-G2-Q1', 2); // difficulty fires here

    goToPhase('MISCONCEPTION_UPDATED');
    chooseSupport();
    goToPhase('SUPPORT_SELECTED');
    goToPhase('SUPPORT_ACTIVE');
    setSupportStatus(SUPPORT_STATUS.ACTIVE);

    goToPhase('SUPPORTED_PRACTICE');
    answer('PT-SP-Q1', 1);

    goToPhase('SUPPORT_WITHDRAWN');
    setSupportStatus(SUPPORT_STATUS.REMOVED);

    goToPhase('INDEPENDENT_CHECK');
    answer('GI-PS-I01', 1);
    answer('GI-PS-I02', 1);
    answer('GI-PS-I03', 1);

    goToPhase('RESULT');
    recordIndependence();
    goToPhase('POLICY_UPDATED');
    updatePolicy();
  };

  return (
    <div className="min-h-full w-[min(100vw,430px)] bg-cream pb-28">
      <div className="px-5 pt-6 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-white card-shadow flex items-center justify-center"
          aria-label="Go back"
        >
          <ChevronLeft size={18} className="text-ink" aria-hidden="true" />
        </button>
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-wide text-coral">Dev harness</p>
          <h1 className="font-display font-extrabold text-[19px] text-ink leading-tight">
            Glyphs &amp; Research View
          </h1>
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-4">
        <Panel
          title="Rotation contract — cardinal"
          note="0 = up, then one quarter turn CLOCKWISE per step."
        >
          <GlyphRow symbol="arrow" rotations={ROTATIONS} expected={EXPECTED} />
        </Panel>

        <Panel
          title="Rotation contract — diagonal"
          note="Used by the supported-practice and independent-check items."
        >
          <GlyphRow symbol="arrow" rotations={DIAGONALS} expected={EXPECTED_DIAGONAL} />
        </Panel>

        <Panel
          title="Marked triangle"
          note="The coin dot must travel clockwise with the shape, otherwise the rotation is invisible."
        >
          <GlyphRow symbol="triangle" rotations={ROTATIONS} expected={EXPECTED} />
        </Panel>

        <Panel title="Marked square" note="Marked corner is top-left at rotation 0.">
          <GlyphRow symbol="square" rotations={ROTATIONS} expected={EXPECTED} />
        </Panel>

        <Panel title="Alternating pair" note="Position swap, not rotation.">
          <div className="flex flex-wrap gap-4 justify-center">
            {['dot-square', 'square-dot', 'dot-dot'].map((order) => (
              <div key={order} className="flex flex-col items-center gap-1">
                <SymbolRenderer symbol="pair" order={order} size={64} />
                <p className="text-[10px] font-semibold text-ink-soft">{order}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Temple scene & gates" note="Backdrop stays low-contrast; gates show all three states.">
          <div className="-mx-5 rounded-2xl overflow-hidden">
            <TempleScene height={220}>
              <div className="absolute inset-x-0 bottom-2 flex items-end justify-center gap-3">
                <TempleGate state="open" index={1} label="Direction Rule" />
                <TempleGate state="active" index={2} label="Rotation Rule" />
                <TempleGate state="locked" index={3} label="The Final Gate" />
              </div>
            </TempleScene>
          </div>
        </Panel>

        <Panel
          title="Research View"
          note="Replay the scripted session, then open the drawer to inspect every card with real data."
        >
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={runScriptedSession}
              className="w-full min-h-11 bg-primary text-white font-display font-bold text-[13px] rounded-full active:scale-95 transition-transform"
            >
              Run scripted session
            </button>
            <button
              type="button"
              onClick={adaptive.resetSession}
              className="w-full min-h-11 bg-white text-ink font-display font-bold text-[13px] rounded-full card-shadow active:scale-95 transition-transform"
            >
              Reset session
            </button>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Stat label="Phase" value={adaptive.phase} />
            <Stat label="Events" value={adaptive.events.length} />
            <Stat label="Related errors" value={adaptive.gameplay.relatedErrors} />
            <Stat
              label="Confidence"
              value={adaptive.difficulty.detected ? adaptive.difficulty.confidence.toFixed(2) : '—'}
            />
            <Stat
              label="Top belief"
              value={`${adaptive.derived.beliefRows[0].percentage}%`}
            />
            <Stat label="Bars total" value={`${adaptive.derived.beliefRows.reduce((s, r) => s + r.percentage, 0)}%`} />
            <Stat label="Support" value={adaptive.selectedSupport?.label ?? '—'} />
            <Stat label="Gain" value={adaptive.derived.independenceGainView.gainLabel} />
          </dl>
        </Panel>
      </div>

      <ResearchViewToggle placement="plain" />
      <ResearchPanel />
    </div>
  );
}

function Panel({ title, note, children }) {
  return (
    <section className="bg-white rounded-2xl p-4 card-shadow">
      <h2 className="font-display font-bold text-[13.5px] text-ink">{title}</h2>
      {note ? (
        <p className="text-[11px] font-semibold text-ink-soft mt-0.5 mb-3 leading-relaxed">{note}</p>
      ) : (
        <div className="mb-3" />
      )}
      {children}
    </section>
  );
}

function GlyphRow({ symbol, rotations, expected }) {
  return (
    <div className="flex justify-between gap-1">
      {rotations.map((rotation) => (
        <div key={rotation} className="flex flex-col items-center gap-1">
          <SymbolRenderer symbol={symbol} rotation={rotation} size={62} />
          <p className="text-[10.5px] font-display font-bold text-ink tabular-nums">{rotation}&deg;</p>
          <p className="text-[9.5px] font-semibold text-ink-soft">{expected[rotation]}</p>
        </div>
      ))}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[9.5px] font-bold uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="text-[11.5px] font-display font-bold text-ink truncate">{value}</dd>
    </div>
  );
}
