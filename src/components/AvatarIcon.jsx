const PALETTES = {
  'star-explorer': { skin: '#F6C89F', hair: '#3A2E27', top: '#6C5CE7' },
  'fox-scout': { skin: '#F6C89F', hair: '#D9772B', top: '#FF9F5A' },
  'owl-sage': { skin: '#E8B98A', hair: '#5A4632', top: '#3FA9F5' },
  'turtle-friend': { skin: '#C98A5B', hair: '#241E1A', top: '#16BFA6' },
  'dragon-buddy': { skin: '#F0AA82', hair: '#7A2E2E', top: '#FF6B6B' },
  'panda-pal': { skin: '#F6D8B8', hair: '#2E2A45', top: '#35C46A' },
};

export default function AvatarIcon({ variant = 'star-explorer', size = 64, className = '' }) {
  const p = PALETTES[variant] || PALETTES['star-explorer'];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="48" fill={p.top} opacity="0.14" />
      <ellipse cx="50" cy="64" rx="26" ry="20" fill={p.top} />
      <circle cx="50" cy="40" r="22" fill={p.skin} />
      <path d="M28 34 Q50 14 72 34 Q72 22 50 20 Q28 22 28 34Z" fill={p.hair} />
      <circle cx="42" cy="40" r="2.6" fill="#2E2A45" />
      <circle cx="58" cy="40" r="2.6" fill="#2E2A45" />
      <path d="M43 48 Q50 53 57 48" stroke="#2E2A45" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="46" r="3" fill="#FF9F5A" opacity="0.5" />
      <circle cx="66" cy="46" r="3" fill="#FF9F5A" opacity="0.5" />
    </svg>
  );
}
