import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Gamepad2, FileText, Sparkles, LineChart } from 'lucide-react';

const TABS = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/learn', label: 'Learn', icon: Gamepad2 },
  { to: '/practice', label: 'Practice', icon: FileText },
  { to: '/mindy', label: 'Mindy', icon: Sparkles },
  { to: '/progress', label: 'Progress', icon: LineChart },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur border-t border-black/5 px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex justify-around z-30">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-w-[56px]">
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute -top-1 w-10 h-1.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={22} strokeWidth={2.3} className={isActive ? 'text-primary' : 'text-ink-faint'} />
              <span className={`font-display text-[10px] font-bold ${isActive ? 'text-primary' : 'text-ink-faint'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
