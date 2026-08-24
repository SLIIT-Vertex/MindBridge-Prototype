export default function RewardChip({ icon: Icon, value, tone = 'primary' }) {
  const tones = {
    primary: 'bg-primary-light text-primary-dark',
    coin: 'bg-coin-light text-[#B8860B]',
    orange: 'bg-orange-light text-[#C1650F]',
    success: 'bg-success-light text-[#1E8A47]',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display font-bold text-[12.5px] ${tones[tone]}`}>
      <Icon size={14} strokeWidth={2.6} />
      {value}
    </span>
  );
}
