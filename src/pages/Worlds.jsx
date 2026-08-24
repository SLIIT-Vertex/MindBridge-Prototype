import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WORLDS } from '../data/mockData';
import GameWorldCard from '../components/GameWorldCard';

export default function Worlds() {
  const navigate = useNavigate();

  return (
    <div className="pt-8 px-5">
      <h1 className="font-display font-extrabold text-2xl text-ink mb-1">Choose Your Adventure</h1>
      <p className="text-[13px] font-semibold text-ink-soft mb-6">Every world builds a different skill</p>

      <div className="flex flex-col gap-3">
        {WORLDS.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <GameWorldCard world={w} onClick={() => navigate(`/worlds/${w.id}`)} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
