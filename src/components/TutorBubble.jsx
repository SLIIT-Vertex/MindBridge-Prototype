import { motion } from 'framer-motion';
import Mascot from './Mascot';

export default function TutorBubble({ text, from = 'mindy', mood = 'happy' }) {
  if (from === 'child') {
    return (
      <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
        <div className="bg-primary text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[78%] text-[13.5px] font-medium card-shadow">
          {text}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-2.5">
      <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0 overflow-hidden">
        <Mascot size={30} mood={mood} animate={false} />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 max-w-[78%] text-[13.5px] font-medium text-ink card-shadow">
        {text}
      </div>
    </motion.div>
  );
}
