import { useState } from 'react';
import { Coins, Check, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATARS, AVATAR_SHOP } from '../data/mockData';
import AvatarIcon from '../components/AvatarIcon';
import AppHeader from '../components/AppHeader';

const CATEGORIES = [
  { key: 'hair', label: 'Hair' },
  { key: 'shirt', label: 'Shirt' },
  { key: 'accessories', label: 'Accessories' },
  { key: 'background', label: 'Background' },
];

export default function AvatarCustomize() {
  const { avatarId, avatarLoadout, ownedItems, purchaseItem, coins } = useApp();
  const [tab, setTab] = useState('hair');
  const avatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const items = AVATAR_SHOP[tab];

  function handlePick(item) {
    const owned = ownedItems.includes(item.id) || item.cost === 0;
    if (owned) {
      purchaseItem(item.id, 0, tab);
    } else {
      purchaseItem(item.id, item.cost, tab);
    }
  }

  return (
    <div className="pb-8">
      <AppHeader title="Customize Avatar" right={<span className="flex items-center gap-1 text-[12px] font-display font-bold text-ink"><Coins size={14} className="text-coin" />{coins}</span>} />

      <div className="px-5 mt-2 flex flex-col items-center mb-6">
        <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center card-shadow-lg">
          <AvatarIcon variant={avatar.emoji} size={90} />
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex bg-white rounded-full p-1 card-shadow overflow-x-auto gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setTab(c.key)}
              className={`flex-1 whitespace-nowrap px-3 py-2 rounded-full text-[12px] font-display font-bold transition-colors ${
                tab === c.key ? 'bg-primary text-white' : 'text-ink-soft'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 grid grid-cols-2 gap-3">
        {items.map((item) => {
          const owned = ownedItems.includes(item.id) || item.cost === 0;
          const selected = avatarLoadout[tab] === item.id;
          const canAfford = coins >= item.cost;
          return (
            <button
              key={item.id}
              onClick={() => handlePick(item)}
              disabled={!owned && !canAfford}
              className={`bg-white rounded-2xl p-4 card-shadow text-left border-2 ${
                selected ? 'border-primary' : 'border-transparent'
              } ${!owned && !canAfford ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-display font-bold text-[12.5px] text-ink">{item.label}</p>
                {selected && <Check size={15} className="text-primary" strokeWidth={3} />}
              </div>
              {item.cost === 0 ? (
                <span className="text-[11px] font-bold text-success">Free</span>
              ) : owned ? (
                <span className="text-[11px] font-bold text-ink-soft">Owned</span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-ink-soft">
                  {!canAfford && <Lock size={11} />}
                  <Coins size={12} className="text-coin" />
                  {item.cost}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
