import { motion } from 'framer-motion';
import {
  ArrowDown,
  Brain,
  Gamepad2,
  LifeBuoy,
  ScanFace,
  Scale,
  SignalHigh,
  Timer,
  TrendingUp,
  UserCheck,
} from 'lucide-react';

import AppHeader from '../components/AppHeader';
import {
  BEHAVIOR_FEATURE_LIST,
  COMPONENT_BOUNDARY,
  INTEGRATION_CONTRACT,
  PIPELINE_STAGES,
  VISUAL_FEATURE_LIST,
} from '../data/learner-state/pipeline';
import { TEMPORAL_COPY } from '../data/learner-state/supportCopy';
import { WINDOW_RANGE_SECONDS } from '../services/learner-state/temporalWindow';

/**
 * The pipeline, drawn from the same data the implementation is described by, so
 * the diagram cannot drift away from the services that actually run.
 */

const ICONS = { Gamepad2, ScanFace, SignalHigh, UserCheck, Timer, Scale, Brain, TrendingUp, LifeBuoy };

export default function StateFusion() {
  return (
    <div className="pb-8">
      <AppHeader title="How Learner State Is Estimated" />

      <div className="px-5 mt-2 mb-1">
        <p className="text-[13px] font-semibold text-ink-soft text-center leading-relaxed">
          {TEMPORAL_COPY}
        </p>
      </div>

      <div className="px-5 mt-5 flex flex-col items-center gap-1">
        {PIPELINE_STAGES.map((stage, index) => {
          const Icon = ICONS[stage.icon] ?? Brain;
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="w-full"
            >
              <div className="w-full rounded-2xl p-4 card-shadow" style={{ background: stage.bg }}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <Icon size={18} color={stage.color} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-[13.5px] text-ink leading-snug">
                      {stage.title}
                    </p>
                    <p className="text-[9.5px] font-semibold text-ink-soft/70 truncate">
                      {stage.service}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {stage.items.map((item) => (
                    <span
                      key={item}
                      className="text-[10.5px] font-semibold rounded-full px-2.5 py-1 bg-white"
                      style={{ color: stage.color }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {index < PIPELINE_STAGES.length - 1 && (
                <div className="flex justify-center py-1.5">
                  <ArrowDown size={18} className="text-ink-faint" aria-hidden="true" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="px-5 mt-6 flex flex-col gap-4">
        <FeatureCard
          title="Visual features"
          subtitle="Derived measurements only. No facial identity recognition."
          items={VISUAL_FEATURE_LIST}
          color="#3FA9F5"
          bg="#E8F5FE"
        />
        <FeatureCard
          title="Learning-behaviour features"
          subtitle="Captured from the Gamified Learning Module."
          items={BEHAVIOR_FEATURE_LIST}
          color="#16BFA6"
          bg="#E4FAF5"
        />

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <p className="font-display font-bold text-[14px] text-ink mb-3">Why a window, not a frame</p>
          <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed">
            A state is estimated over {WINDOW_RANGE_SECONDS[0]} to {WINDOW_RANGE_SECONDS[1]} seconds
            of evidence. One wrong answer is not confusion, and one glance away is not disengagement.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 card-shadow">
          <p className="font-display font-bold text-[14px] text-ink mb-3">Where this sits</p>
          <div className="flex flex-col gap-3">
            {INTEGRATION_CONTRACT.inputs.map((input) => (
              <ContractRow key={input.source} label="Receives from" name={input.source} fields={input.fields} tone="#6C5CE7" bg="#EFECFD" />
            ))}
            {INTEGRATION_CONTRACT.outputs.map((output) => (
              <ContractRow key={output.target} label="Sends to" name={output.target} fields={output.fields} tone="#FF9F5A" bg="#FFF1E4" />
            ))}
          </div>
          <p className="text-[11.5px] font-semibold text-ink-soft leading-relaxed mt-4 pt-4 border-t border-cream-deep">
            {COMPONENT_BOUNDARY}
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, subtitle, items, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <p className="font-display font-bold text-[14px] text-ink">{title}</p>
      <p className="text-[11.5px] font-semibold text-ink-soft mt-0.5 mb-3 leading-relaxed">
        {subtitle}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="text-[10.5px] font-semibold rounded-full px-2.5 py-1"
            style={{ color, background: bg }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ContractRow({ label, name, fields, tone, bg }) {
  return (
    <div className="rounded-xl p-3" style={{ background: bg }}>
      <p className="text-[9.5px] font-bold uppercase tracking-wide" style={{ color: tone }}>
        {label}
      </p>
      <p className="font-display font-bold text-[12.5px] text-ink mt-0.5">{name}</p>
      <p className="text-[11px] font-semibold text-ink-soft mt-1 leading-relaxed">
        {fields.join(' · ')}
      </p>
    </div>
  );
}
