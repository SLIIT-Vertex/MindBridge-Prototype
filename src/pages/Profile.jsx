import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins, Star, Flame, ChevronRight, Volume2, Music2, Bell, Accessibility, ShieldCheck, ShieldQuestion, Info, LogOut, Palette, Trophy, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATARS } from '../data/mockData';
import AvatarIcon from '../components/AvatarIcon';
import RewardChip from '../components/RewardChip';
import LanguageSelector from '../components/LanguageSelector';
import ParentPinModal from '../components/ParentPinModal';
import DailyRewardModal from '../components/DailyRewardModal';

export default function Profile() {
  const { child, avatarId, level, coins, streak, language, setLanguage, addCoins } = useApp();
  const navigate = useNavigate();
  const avatar = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];
  const [pinOpen, setPinOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [music, setMusic] = useState(true);
  const [notifs, setNotifs] = useState(true);

  return (
    <div className="pt-8 px-5 pb-4">
      <div className="flex flex-col items-center mb-6">
        <button onClick={() => navigate('/avatar-customize')} className="relative active:scale-95 transition-transform">
          <div className="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center card-shadow-lg">
            <AvatarIcon variant={avatar.emoji} size={78} />
          </div>
          <span className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1.5 card-shadow">
            <Palette size={12} />
          </span>
        </button>
        <p className="font-display font-extrabold text-lg text-ink mt-3">{child.name}</p>
        <p className="text-[12px] font-semibold text-ink-soft">{child.grade} &middot; {child.school}</p>
        <div className="flex gap-2 mt-3">
          <RewardChip icon={Flame} value={`${streak}d`} tone="orange" />
          <RewardChip icon={Star} value={`Lv ${level}`} tone="primary" />
          <RewardChip icon={Coins} value={coins} tone="coin" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <QuickCard icon={Trophy} label="Achievements" onClick={() => navigate('/achievements')} />
        <QuickCard icon={Gift} label="Daily Rewards" onClick={() => setRewardOpen(true)} />
      </div>

      <SettingsGroup title="Preferences">
        <RowToggle icon={Volume2} label="Sound" value={sound} onChange={setSound} />
        <RowToggle icon={Music2} label="Music" value={music} onChange={setMusic} />
        <RowToggle icon={Bell} label="Notifications" value={notifs} onChange={setNotifs} />
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Accessibility size={17} className="text-ink-soft" />
            <span className="text-[13px] font-semibold text-ink">Language</span>
          </div>
          <LanguageSelector value={language} onChange={setLanguage} compact />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Family & Safety">
        <RowNav icon={ShieldCheck} label="Parent Area" onClick={() => setPinOpen(true)} />
        <RowNav icon={ShieldQuestion} label="Camera & Privacy" onClick={() => navigate('/privacy')} />
      </SettingsGroup>

      <SettingsGroup title="About">
        <RowNav icon={Info} label="About MindBridge" onClick={() => {}} />
        <RowNav icon={LogOut} label="Logout" onClick={() => {}} last />
      </SettingsGroup>

      <ParentPinModal open={pinOpen} onClose={() => setPinOpen(false)} onSuccess={() => { setPinOpen(false); navigate('/parent'); }} />
      <DailyRewardModal open={rewardOpen} onClose={() => setRewardOpen(false)} onClaim={() => { addCoins(100); setRewardOpen(false); }} />
    </div>
  );
}

function QuickCard({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="bg-white rounded-2xl p-4 card-shadow flex flex-col items-center gap-2 active:scale-95 transition-transform">
      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
        <Icon size={18} className="text-primary" strokeWidth={1.8} />
      </div>
      <span className="font-display font-bold text-[12px] text-ink">{label}</span>
    </button>
  );
}

function SettingsGroup({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-[10.5px] font-bold text-ink-faint uppercase tracking-wide mb-2 ml-1">{title}</p>
      <div className="bg-white rounded-2xl card-shadow divide-y divide-cream-deep overflow-hidden">{children}</div>
    </div>
  );
}

function RowToggle({ icon: Icon, label, value, onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={17} className="text-ink-soft" />
        <span className="text-[13px] font-semibold text-ink">{label}</span>
      </div>
      {/* Padded hit area around a deliberately small track: 44px to tap, 28px to look at. */}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className="p-2 -m-2 flex-shrink-0"
      >
        <span className={`block w-12 h-7 rounded-full relative transition-colors ${value ? 'bg-primary' : 'bg-cream-deep'}`}>
          <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all shadow ${value ? 'left-[22px]' : 'left-0.5'}`} />
        </span>
      </button>
    </div>
  );
}

function RowNav({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={17} className="text-ink-soft" />
        <span className="text-[13px] font-semibold text-ink">{label}</span>
      </div>
      <ChevronRight size={16} className="text-ink-faint" />
    </button>
  );
}
