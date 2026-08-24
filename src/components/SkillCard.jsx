import ProgressBar from './ProgressBar';

export default function SkillCard({ name, pct, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 card-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-display font-bold text-[13.5px] text-ink">{name}</span>
        <span className="font-display font-bold text-[13px]" style={{ color }}>{pct}%</span>
      </div>
      <ProgressBar pct={pct} color={color} />
      {trend && <p className="text-[11px] font-semibold text-success mt-1.5">{trend} this week</p>}
    </div>
  );
}
