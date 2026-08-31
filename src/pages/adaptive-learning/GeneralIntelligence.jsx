import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '../../components/AppHeader';
import SkillPathCard from '../../components/adaptive-learning/SkillPathCard';
import ResearchViewToggle from '../../components/adaptive-learning/ResearchViewToggle';
import ResearchPanel from '../../components/adaptive-learning/ResearchPanel';
import { useAdaptive } from '../../context/AdaptiveLearningContext';
import { GI_SKILLS, getCurriculumArea } from '../../data/adaptive-learning/curriculum';

/**
 * Curriculum area — Screen 2. Only Pattern & Sequence Reasoning is playable.
 */
export default function GeneralIntelligence() {
  const navigate = useNavigate();
  const { goToPhase } = useAdaptive();
  const area = getCurriculumArea('GI');

  useEffect(() => {
    goToPhase('CURRICULUM');
  }, [goToPhase]);

  return (
    <div className="min-h-full w-[min(100vw,430px)] pb-28">
      <AppHeader title="General Intelligence" onBack={() => navigate('/learn')} />

      <div className="px-5 mt-2">
        <h1 className="font-display font-extrabold text-2xl text-ink leading-tight">
          {area?.name ?? 'General Intelligence & Aptitude'}
        </h1>
        <p className="text-[12.5px] font-semibold text-ink-soft leading-relaxed mt-2 mb-6">
          Build the reasoning skills used to recognize patterns, relationships, transformations
          and logical rules.
        </p>

        <h2 className="font-display font-bold text-[15px] text-ink mb-3">Skills</h2>

        <div className="flex flex-col gap-3">
          {GI_SKILLS.map((skill, index) => (
            <SkillPathCard
              key={skill.id}
              skill={skill}
              index={index}
              accent={area?.color ?? '#6C5CE7'}
              onOpen={() => navigate('/learn/pattern-sequence')}
            />
          ))}
        </div>
      </div>

      <ResearchViewToggle placement="nav" />
      <ResearchPanel />
    </div>
  );
}
