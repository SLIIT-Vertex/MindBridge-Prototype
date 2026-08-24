import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { AVATARS, LANGUAGES } from '../data/mockData';
import AvatarIcon from '../components/AvatarIcon';

const GRADES = ['Grade 4', 'Grade 5'];

export default function ProfileSetup() {
  const { child, setChild, avatarId, setAvatarId, language, setOnboardingDone } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(child.name);
  const [grade, setGrade] = useState(child.grade);
  const [school, setSchool] = useState(child.school);

  const canStart = name.trim().length > 0;

  function start() {
    setChild((c) => ({ ...c, name: name.trim() || 'Explorer', grade, school, language }));
    setOnboardingDone(true);
    navigate('/home');
  }

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-12 pb-10">
      <h2 className="font-display font-extrabold text-2xl text-ink mb-1">Let's set you up</h2>
      <p className="text-[13.5px] font-medium text-ink-soft mb-6">Tell us a bit about you</p>

      <div className="mb-6">
        <p className="font-display font-bold text-[13px] text-ink mb-3">Choose your avatar</p>
        <div className="grid grid-cols-3 gap-3">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAvatarId(a.id)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5 border-2 transition-colors ${
                avatarId === a.id ? 'border-primary bg-primary-light' : 'border-transparent bg-white card-shadow'
              }`}
            >
              <AvatarIcon variant={a.emoji} size={44} />
              <span className="text-[10px] font-bold text-ink-soft">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kavindu"
            className="w-full bg-transparent font-display font-semibold text-[15px] text-ink outline-none"
          />
        </Field>

        <Field label="Grade">
          <div className="flex gap-2">
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-display font-bold ${
                  grade === g ? 'bg-primary text-white' : 'bg-cream-deep text-ink-soft'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </Field>

        <Field label="School">
          <input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder="e.g. Royal Junior College"
            className="w-full bg-transparent font-display font-semibold text-[15px] text-ink outline-none"
          />
        </Field>

        <Field label="Preferred Language">
          <span className="font-display font-semibold text-[15px] text-ink">
            {LANGUAGES.find((l) => l.code === language)?.native}
          </span>
        </Field>
      </div>

      <div className="flex-1" />

      <motion.button
        whileTap={{ scale: 0.96 }}
        disabled={!canStart}
        onClick={start}
        className="bg-primary text-white font-display font-bold text-[15px] rounded-full py-4 disabled:opacity-40 transition-opacity"
      >
        Start My Adventure
      </motion.button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="bg-white rounded-2xl px-4 py-3 card-shadow">
      <p className="text-[10.5px] font-bold text-ink-faint uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  );
}
