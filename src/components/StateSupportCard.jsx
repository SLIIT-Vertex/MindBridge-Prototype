import { motion, AnimatePresence } from 'framer-motion';
import Mascot from './Mascot';

const TONE_STYLES = {
  success: { bg: '#E6F9EC', text: '#1E8A47', mood: 'excited' },
  orange: { bg: '#FFF1E4', text: '#C1650F', mood: 'thinking' },
  primary: { bg: '#EFECFD', text: '#5442D6', mood: 'calm' },
  teal: { bg: '#E4FAF5', text: '#0F8C77', mood: 'sleepy' },
};

export default function StateSupportCard({ content, onAction, visible = true }) {
  const tone = TONE_STYLES[content.dotColor || content.tone] || TONE_STYLES.primary;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="rounded-2xl p-4 card-shadow-lg flex items-start gap-3"
          style={{ background: tone.bg }}
        >
          <div className="w-11 h-11 rounded-full bg-white/70 flex items-center justify-center flex-shrink-0">
            <Mascot size={34} mood={tone.mood} animate={false} />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-[14.5px]" style={{ color: tone.text }}>{content.title}</p>
            <p className="text-[12.5px] font-medium text-ink-soft mt-0.5">{content.body}</p>
            {content.actions?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {content.actions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => onAction?.(a.id)}
                    className={`min-h-10 text-[11.5px] font-display font-bold rounded-full px-3.5 py-2 active:scale-95 transition-transform ${
                      a.style === 'primary' ? 'text-white' : 'bg-white/80 text-ink'
                    }`}
                    style={a.style === 'primary' ? { background: tone.text } : {}}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
