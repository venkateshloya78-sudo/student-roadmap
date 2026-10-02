import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Map, Clock, BookOpen } from 'lucide-react';
import { careersApi } from '../api/careers';
import { SkillBadge } from '../components/UI/SkillBadge';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

export const CareerDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: role, isLoading } = useQuery({
    queryKey: ['career', slug],
    queryFn: () => careersApi.get(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!role)     return <div className="text-center py-20 text-gray-500">Career path not found.</div>;

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to careers
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h1>
            <p className="text-gray-600 leading-relaxed">{role.description}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="badge bg-gray-100 text-gray-700 gap-1.5">
                <Clock className="w-3 h-3" />
                {role.entry_level_experience_years === 0
                  ? 'No prior experience needed'
                  : `${role.entry_level_experience_years}+ yrs experience`}
              </span>
              <span className="badge bg-gray-100 text-gray-700 capitalize">
                {role.seniority_level} level
              </span>
              {role.industry && (
                <span className="badge bg-gray-100 text-gray-700">{role.industry.name}</span>
              )}
            </div>
          </div>

          {/* Required skills */}
          {role.required_skills && role.required_skills.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" /> Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {role.required_skills.map((rs) => (
                  <SkillBadge
                    key={rs.id}
                    name={rs.skill.name}
                    category={rs.skill.category}
                    difficulty={rs.required_level}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Education requirements */}
          {role.education_requirements && Object.keys(role.education_requirements).length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-3">Education Requirements</h2>
              {(role.education_requirements.preferred_degrees as string[] | undefined) && (
                <div className="mb-2">
                  <p className="text-xs text-gray-500 mb-1">Preferred degrees</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(role.education_requirements.preferred_degrees as string[]).map((d) => (
                      <span key={d} className="badge bg-gray-100 text-gray-700">{d}</span>
                    ))}
                  </div>
                </div>
              )}
              {role.education_requirements.notes && (
                <p className="text-sm text-gray-500 mt-2">{role.education_requirements.notes as string}</p>
              )}
            </div>
          )}
        </div>

        {/* CTA sidebar */}
        <div className="space-y-4">
          <div className="card border-brand-200 bg-brand-50">
            <h3 className="font-semibold text-brand-900 mb-2">Ready to start?</h3>
            <p className="text-sm text-brand-700 mb-4">
              Generate your personalised roadmap for this career path.
            </p>
            <Link to="/onboarding" className="btn-primary w-full text-sm gap-2">
              <Map className="w-4 h-4" /> Build my roadmap
            </Link>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Next steps</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Complete your 5-min onboarding profile</p>
              <p>2. Review your personalised skill gap report</p>
              <p>3. Start Phase 1 of your roadmap</p>
              <p>4. Submit evidence to earn competency scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
