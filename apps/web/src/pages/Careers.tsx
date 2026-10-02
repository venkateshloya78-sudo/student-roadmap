import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Briefcase } from 'lucide-react';
import { careersApi } from '../api/careers';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';
import { EmptyState } from '../components/UI/EmptyState';

const seniorityColor: Record<string, string> = {
  entry:  'bg-emerald-50 text-emerald-700',
  mid:    'bg-blue-50 text-blue-700',
  senior: 'bg-purple-50 text-purple-700',
};

export const CareersPage = () => {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['careers', search],
    queryFn: () => careersApi.list({ search, size: 50 }),
    placeholderData: (prev) => prev,
  });

  const careers = data?.items ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Career Paths</h1>
        <p className="text-gray-500 mt-1">
          15 curated paths for Indian undergraduates. Pick one and get your roadmap.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search careers (e.g. Data, Product, Cloud…)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : careers.length === 0 ? (
        <EmptyState icon={Briefcase} title="No careers found" description="Try a different search term." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {careers.map((role) => (
            <Link
              key={role.id}
              to={`/careers/${role.slug}`}
              className="card hover:shadow-md hover:border-brand-200 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${seniorityColor[role.seniority_level] ?? 'bg-gray-100 text-gray-600'}`}>
                  {role.seniority_level}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{role.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{role.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">{role.industry?.name ?? 'Technology'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
