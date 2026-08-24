import { Gamepad2, FileText, Star, Lightbulb, Sprout } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';
import AppHeader from '../components/AppHeader';

const ICONS = { 'gamepad-2': Gamepad2, 'file-text': FileText, star: Star, lightbulb: Lightbulb, sprout: Sprout };

export default function Notifications() {
  return (
    <div className="pb-8">
      <AppHeader title="Notifications" />
      <div className="px-5 mt-2 flex flex-col gap-2.5">
        {NOTIFICATIONS.map((n) => {
          const Icon = ICONS[n.icon];
          return (
            <div key={n.id} className="bg-white rounded-2xl p-4 card-shadow flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-[12.5px] font-semibold text-ink leading-snug">{n.text}</p>
                <p className="text-[10.5px] font-semibold text-ink-faint mt-1">{n.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
