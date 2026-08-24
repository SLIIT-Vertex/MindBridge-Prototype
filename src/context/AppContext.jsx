import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CHILD } from '../data/mockData';

const AppContext = createContext(null);
const STORAGE_KEY = 'mindbridge-state';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupt storage
  }
  return null;
}

export function AppProvider({ children }) {
  const saved = loadState();

  const [onboardingDone, setOnboardingDone] = useState(saved?.onboardingDone ?? false);
  const [language, setLanguage] = useState(saved?.language ?? 'en');
  const [child, setChild] = useState(saved?.child ?? DEFAULT_CHILD);
  const [avatarId, setAvatarId] = useState(saved?.avatarId ?? 'a1');
  const [avatarLoadout, setAvatarLoadout] = useState(
    saved?.avatarLoadout ?? { hair: 'h1', shirt: 's1', accessories: 'x3', background: 'bg1' }
  );
  const [ownedItems, setOwnedItems] = useState(saved?.ownedItems ?? ['h1', 's1', 'x3', 'bg1']);
  const [coins, setCoins] = useState(saved?.coins ?? DEFAULT_CHILD.coins);
  const [xp, setXp] = useState(saved?.xp ?? DEFAULT_CHILD.xp);
  const [level, setLevel] = useState(saved?.level ?? DEFAULT_CHILD.level);
  const [streak, setStreak] = useState(saved?.streak ?? DEFAULT_CHILD.streak);
  const [missionProgress, setMissionProgress] = useState(saved?.missionProgress ?? 1);
  const [visualSupport, setVisualSupport] = useState(saved?.visualSupport ?? true);
  const [learnerState, setLearnerState] = useState('engaged');

  useEffect(() => {
    const state = {
      onboardingDone, language, child, avatarId, avatarLoadout,
      ownedItems, coins, xp, level, streak, missionProgress, visualSupport,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — non-fatal for prototype
    }
  }, [onboardingDone, language, child, avatarId, avatarLoadout, ownedItems, coins, xp, level, streak, missionProgress, visualSupport]);

  function addXp(amount) {
    setXp((prev) => prev + amount);
  }

  function addCoins(amount) {
    setCoins((prev) => prev + amount);
  }

  function purchaseItem(itemId, cost, slot) {
    if (coins < cost) return false;
    setCoins((prev) => prev - cost);
    setOwnedItems((prev) => [...prev, itemId]);
    setAvatarLoadout((prev) => ({ ...prev, [slot]: itemId }));
    return true;
  }

  return (
    <AppContext.Provider
      value={{
        onboardingDone, setOnboardingDone,
        language, setLanguage,
        child, setChild,
        avatarId, setAvatarId,
        avatarLoadout, setAvatarLoadout,
        ownedItems, purchaseItem,
        coins, addCoins,
        xp, addXp,
        level, setLevel,
        streak, setStreak,
        missionProgress, setMissionProgress,
        visualSupport, setVisualSupport,
        learnerState, setLearnerState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
