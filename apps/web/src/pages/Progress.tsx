import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { skillsApi } from '../api/skills';
import { roadmapsApi } from '../api/roadmaps';
import { CompetencyRing } from '../components/UI/CompetencyRing';
import { ProgressBar } from '../components/UI/ProgressBar';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { SkillBadge } from '../components/UI/SkillBadge';
import { EmptyState } from '../components/UI/EmptyState';

export const ProgressPage = () => {
  const { data: mySkills,  isLoading: ls } = useQuery({ queryKey: ['skills', 'mine'], queryFn: skillsApi.mySkills });
  const { data: roadmap,   isLoading: lr } = useQuery({ queryKey: ['roadmap', 'active'], queryFn: roadmapsApi.getActive });

  const isLoading = ls || lr;

  const avgScore = mySkills && mySkills.length > 0
    ? Math.round(mySkills.reduce((s, sk) => s + (sk.competency_score ?? 0) * 100, 0) / mySkills.length)
    : 0;

  const totalItems = roadmap?.phases.flatMap((p) => p.items).length ?? 0;
  const doneItems  = roadmap?.phases.flatMap((p) => p.items)
    .filter((i) => i.status === 'completed' || i.status === 'verified').length ?? 0;
  const roadmapPct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-500 mt-1">Track your skill competency scores and roadmap completion.</p>
      </div>

      {/* Summary rings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { score: avgScore,              label: 'Avg. Skill Score'    },
          { score: roadmapPct,            label: 'Roadmap Complete'    },
          { score: mySkills?.length ?? 0, label: 'Skills Tracked'      },
        ].map(({ score, label }) => (
          <div key={label} className="card flex flex-col items-center py-6">
            <CompetencyRing score={score} size={88} />
            <p className="text-sm font-medium text-gray-700 mt-3 text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Skill breakdown */}
      {!mySkills || mySkills.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No skill data yet"
          description="Rate your skills during onboarding to see your competency breakdown here."
        />
      ) : (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-600" /> Skill Competency Breakdown
          </h2>
          <div className="space-y-5">
            {[...mySkills]
              .sort((a, b) => (b.competency_score ?? 0) - (a.competency_score ?? 0))
              .map((sk) => (
                <div key={sk.id}>
                  <div className="flex items-center justify-between mb-2">
                    <SkillBadge
                      name={sk.skill.name}
                      category={sk.skill.category}
                      difficulty={sk.skill.difficulty}
                    />
                    <span className="text-xs font-semibold text-gray-700 tabular-nums">
                      {Math.round((sk.competency_score ?? 0) * 100)}%
                    </span>
                  </div>
                  <div className="space-y-1 pl-1">
                    {[
                      { label: 'Self (20%)',       value: (sk.self_rating ?? 0) * 10,           color: 'purple' as const },
                      { label: 'Assessment (40%)', value: (sk.assessment_rating ?? 0) * 100,    color: 'blue'   as const },
                      { label: 'Evidence (40%)',   value: (sk.evidence_rating ?? 0) * 100,      color: 'green'  as const },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 w-28 flex-shrink-0">{label}</span>
                        <ProgressBar value={value} color={color} height="sm" showLabel />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
