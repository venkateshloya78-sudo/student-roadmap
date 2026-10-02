import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown, ChevronRight, CheckCircle2, Circle,
  Clock, Lightbulb, Map,
} from 'lucide-react';
import { roadmapsApi } from '../api/roadmaps';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { ProgressBar } from '../components/UI/ProgressBar';
import { EmptyState } from '../components/UI/EmptyState';
import type { RoadmapPhase, ItemStatus } from '../types';
import clsx from 'clsx';

const statusIcon = (status: ItemStatus) => {
  if (status === 'completed' || status === 'verified')
    return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
  if (status === 'in_progress')
    return <Circle className="w-5 h-5 text-brand-500 flex-shrink-0" />;
  return <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />;
};

const PhaseCard = ({ phase, roadmapId }: { phase: RoadmapPhase; roadmapId: string }) => {
  const [open, setOpen] = useState(phase.status === 'in_progress');
  const qc = useQueryClient();

  const done = phase.items.filter(
    (i) => i.status === 'completed' || i.status === 'verified'
  ).length;
  const pct = phase.items.length > 0
    ? Math.round((done / phase.items.length) * 100)
    : 0;

  const toggleStatus = useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: string }) =>
      roadmapsApi.updateItemStatus(roadmapId, itemId, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roadmap', 'active'] }),
  });

  return (
    <div className={clsx('card', phase.status === 'completed' && 'opacity-70')}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
            phase.status === 'completed'  ? 'bg-emerald-100 text-emerald-700' :
            phase.status === 'in_progress'? 'bg-brand-100 text-brand-700' :
                                            'bg-gray-100 text-gray-500'
          )}>
            {phase.phase_number}
          </div>
          <div className="text-left min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{phase.title}</h3>
            <p className="text-xs text-gray-500">
              {done}/{phase.items.length} items
              {phase.estimated_hours ? ` · ${phase.estimated_hours}h estimated` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-24 hidden sm:block">
            <ProgressBar value={pct} color={pct === 100 ? 'green' : 'blue'} height="sm" />
          </div>
          {open
            ? <ChevronDown className="w-4 h-4 text-gray-400" />
            : <ChevronRight className="w-4 h-4 text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="mt-4 space-y-3 pt-4 border-t border-gray-100">
          {phase.description && (
            <p className="text-sm text-gray-500 mb-2">{phase.description}</p>
          )}
          {phase.items.map((item) => (
            <div key={item.id} className={clsx(
              'flex gap-3 p-3 rounded-xl border transition-colors',
              item.status === 'completed' || item.status === 'verified'
                ? 'bg-emerald-50 border-emerald-100'
                : item.status === 'in_progress'
                ? 'bg-brand-50 border-brand-100'
                : 'bg-gray-50 border-gray-100'
            )}>
              <button
                onClick={() => toggleStatus.mutate({
                  itemId: item.id,
                  status: item.status === 'completed' ? 'not_started' : 'completed',
                })}
                className="mt-0.5"
              >
                {statusIcon(item.status)}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx(
                    'text-sm font-medium',
                    item.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'
                  )}>
                    {item.title}
                  </span>
                  <span className="badge bg-gray-100 text-gray-500 text-[10px] uppercase">{item.type}</span>
                  {item.estimated_hours && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />{item.estimated_hours}h
                    </span>
                  )}
                </div>
                {item.ai_explanation && (
                  <div className="mt-2 flex gap-1.5 text-xs text-amber-700 bg-amber-50 rounded-lg px-2.5 py-1.5">
                    <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>{item.ai_explanation}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const RoadmapPage = () => {
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['roadmap', 'active'],
    queryFn: roadmapsApi.getActive,
  });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  if (!roadmap) return (
    <EmptyState
      icon={Map}
      title="No roadmap generated yet"
      description="Complete your onboarding to generate a personalised, prerequisite-ordered learning roadmap."
      action={<Link to="/onboarding" className="btn-primary text-sm">Start onboarding</Link>}
    />
  );

  const total = roadmap.phases.flatMap((p) => p.items).length;
  const done  = roadmap.phases.flatMap((p) => p.items)
    .filter((i) => i.status === 'completed' || i.status === 'verified').length;

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {roadmap.career_role?.title ?? 'My Roadmap'}
          </h1>
          <p className="text-gray-500 mt-1">
            {done} of {total} milestones complete · v{roadmap.version}
          </p>
        </div>
        <div className="w-32 flex-shrink-0 pt-1">
          <ProgressBar value={total > 0 ? Math.round((done / total) * 100) : 0} height="md" showLabel />
        </div>
      </div>

      <div className="space-y-4">
        {roadmap.phases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} roadmapId={roadmap.id} />
        ))}
      </div>
    </div>
  );
};
