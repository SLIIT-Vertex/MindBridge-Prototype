import { ACHIEVEMENTS } from '../data/mockData';
import AchievementBadge from '../components/AchievementBadge';
import AppHeader from '../components/AppHeader';

export default function Achievements() {
  return (
    <div className="pb-8">
      <AppHeader title="Achievements" />
      <div className="px-5 mt-2">
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <AchievementBadge key={a.id} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}
