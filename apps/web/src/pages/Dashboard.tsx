import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Map, BookOpen, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { roadmapsApi } from '../api/roadmaps';
import { ProgressBar } from '../components/UI/ProgressBar';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { EmptyState } from '../components/UI/EmptyState';

const POPULAR_CAREERS = [
  'Software Development Engineer', 'Data Analyst',
  'Product Manager', 'UI/UX Designer',
];

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['roadmap', 'active'],
    queryFn: roadmapsApi.getActive,
  });

  const allItems   = roadmap?.phases.flatMap((p) => p.items) ?? [];
  const doneItems  = allItems.filter((i) => i.status === 'completed' || i.status === 'verified');
  const progress   = allItems.length > 0 ? Math.round((doneItems.length / allItems.length) * 100) : 0;
  const nextItem   = allItems.find((i) => i.status === 'not_started' || i.status === 'in_progress');
  const curPhase   = roadmap?.phases.find((p) => p.status === 'in_progress') ?? roadmap?.phases[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = user?.email?.split('@')[0] ?? 'there';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, {name} 👋</h1>
        <p className="text-gray-500 mt-1">
          {profile?.profile_completed_at
            ? "Here's where you left off."
            : "Let's complete your profile to generate your roadmap."}
        </p>
      </div>

      {/* Profile incomplete banner */}
      {!profile?.profile_completed_at && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              Complete your profile to get your personalised roadmap
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              Takes about 5 minutes. Progress is saved at each step.
            </p>
          </div>
          <Link to="/onboarding" className="btn-primary text-xs py-1.5 px-3 whitespace-nowrap">
            Continue →
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : !roadmap ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <EmptyState
            icon={Map}
            title="No roadmap yet"
            description="Complete your profile and select a career path to generate your personalised learning roadmap."
            action={<Link to="/onboarding" className="btn-primary text-sm">Set up my profile</Link>}
          />
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" /> Popular career paths
            </h3>
            <div className="space-y-1">
              {POPULAR_CAREERS.map((c) => (
                <Link key={c} to="/careers"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <span className="text-sm text-gray-700">{c}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
                </Link>
              ))}
            </div>
            <Link to="/careers" className="block text-center text-sm text-brand-600 font-medium mt-4 hover:underline">
              View all 15 paths →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress card */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {roadmap.career_role?.title ?? 'Your Roadmap'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {doneItems.length} of {allItems.length} milestones complete
                  </p>
                </div>
                <span className={`badge ${
                  roadmap.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {roadmap.status}
                </span>
              </div>
              <ProgressBar value={progress} height="lg" showLabel />
              <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
                {[
                  { label: 'Phases',     value: roadmap.phases.length },
                  { label: 'Milestones', value: allItems.length },
                  { label: 'Completed',  value: doneItems.length },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{value}</div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next action */}
            {nextItem && (
              <div className="card border-brand-200 bg-brand-50">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-brand-600" />
                  <span className="text-sm font-semibold text-brand-700">Up next</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{nextItem.title}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {nextItem.ai_explanation || nextItem.description || 'Continue working on this item.'}
                </p>
                <Link to="/roadmap" className="btn-primary inline-flex items-center gap-2 text-sm">
                  Go to roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {curPhase && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-3">Current phase</h3>
                <p className="text-sm font-medium text-brand-700 mb-3">{curPhase.title}</p>
                <div className="space-y-2">
                  {curPhase.items.slice(0, 6).map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                        item.status === 'completed' || item.status === 'verified'
                          ? 'text-emerald-500'
                          : item.status === 'in_progress'
                          ? 'text-brand-500'
                          : 'text-gray-200'
                      }`} />
                      <span className={`text-xs ${item.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/roadmap"
                  className="block text-center text-xs text-brand-600 font-medium mt-4 hover:underline">
                  View full roadmap →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
