import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lightbulb, HelpCircle, Target, Repeat, Mic, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MINDY_SUGGESTIONS } from '../data/mockData';
import { TUTOR_SCRIPTS } from '../data/tutorScripts';
import Mascot from '../components/Mascot';
import TutorBubble from '../components/TutorBubble';
import LanguageSelector from '../components/LanguageSelector';

const ICONS = { lightbulb: Lightbulb, 'help-circle': HelpCircle, target: Target, repeat: Repeat };

export default function Mindy() {
  const { child, language, setLanguage } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showTry, setShowTry] = useState(false);

  function send(text) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'child', text }]);
    setInput('');

    const lower = text.toLowerCase();
    const script = lower.includes('fraction') ? TUTOR_SCRIPTS.fractions : TUTOR_SCRIPTS.default;

    setTimeout(() => {
      setMessages((m) => [...m, { from: 'mindy', text: script.reply }]);
      if (script.followUp) {
        setTimeout(() => setShowTry(true), 400);
      }
    }, 500);
  }

  function handleSuggestion(label) {
    send(label);
  }

  return (
    <div className="flex flex-col min-h-dvh pt-6 pb-4">
      <div className="px-5 flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
            <Mascot size={38} mood="happy" animate={false} />
          </div>
          <div>
            <p className="font-display font-extrabold text-[16px] text-ink">Mindy</p>
            <p className="text-[11.5px] font-semibold text-ink-soft">Your learning companion</p>
          </div>
        </div>
        <LanguageSelector value={language} onChange={setLanguage} compact />
      </div>

      <div className="px-5 flex-1 flex flex-col gap-4 overflow-y-auto">
        {messages.length === 0 && (
          <>
            <TutorBubble text={`Hi ${child.name}! What are we learning today?`} />
            <div className="grid grid-cols-2 gap-2.5 mt-1">
              {MINDY_SUGGESTIONS.map((s) => {
                const Icon = ICONS[s.icon];
                return (
                  <motion.button
                    key={s.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestion(s.label)}
                    className="bg-white rounded-2xl p-3.5 card-shadow flex flex-col items-start gap-2 text-left"
                  >
                    <Icon size={18} className="text-primary" strokeWidth={1.8} />
                    <span className="font-display font-bold text-[12px] text-ink leading-tight">{s.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </>
        )}

        {messages.map((m, i) => (
          <TutorBubble key={i} text={m.text} from={m.from} />
        ))}

        {showTry && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-2.5">
            <div className="w-9 h-9 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <p className="text-[12.5px] font-bold text-ink-soft">Want to try one together?</p>
              <div className="flex gap-2">
                <button onClick={() => navigate('/hint-session')} className="bg-primary text-white font-display font-bold text-[12px] rounded-full px-4 py-2">
                  Yes!
                </button>
                <button
                  onClick={() => { setShowTry(false); send('Show me another example'); }}
                  className="bg-white text-ink font-display font-bold text-[12px] rounded-full px-4 py-2 card-shadow"
                >
                  Show another example
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2 bg-white rounded-full card-shadow px-2 py-2">
          <button className="w-9 h-9 rounded-full bg-cream-deep flex items-center justify-center flex-shrink-0">
            <Mic size={16} className="text-ink-soft" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Mindy anything..."
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-ink"
          />
          <button
            onClick={() => send(input)}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
          >
            <Send size={15} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
