import type { SkillCategory, Difficulty } from '../../types';
import clsx from 'clsx';

const categoryColors: Record<SkillCategory, string> = {
  technical: 'bg-blue-50 text-blue-700 border-blue-100',
  soft:      'bg-purple-50 text-purple-700 border-purple-100',
  domain:    'bg-emerald-50 text-emerald-700 border-emerald-100',
  tool:      'bg-amber-50 text-amber-700 border-amber-100',
};

const difficultyDot: Record<Difficulty, string> = {
  beginner:     'bg-emerald-400',
  intermediate: 'bg-amber-400',
  advanced:     'bg-orange-500',
  expert:       'bg-red-500',
};

export const SkillBadge = ({
  name,
  category,
  difficulty,
}: {
  name: string;
  category: SkillCategory;
  difficulty: Difficulty;
}) => (
  <span className={clsx('badge border gap-1.5', categoryColors[category])}>
    <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', difficultyDot[difficulty])} />
    {name}
  </span>
);
