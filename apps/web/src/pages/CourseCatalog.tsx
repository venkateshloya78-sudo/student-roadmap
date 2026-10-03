import React, { useState } from 'react';
import AppShell from '../components/Layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, BarChart, ArrowRight, Search } from 'lucide-react';
import { CourseOut } from '../types/course';
import ProgressBar from '../components/Course/ProgressBar';
import { useLanguage } from '../i18n/LanguageContext';

const categoryIcons: Record<string, string> = {
  'programming': '💻',
  'data': '📊',
  'design': '🎨',
  'cloud': '☁️',
  'security': '🔒',
  'default': '📚'
};

const difficultyColors: Record<string, string> = {
  'beginner': 'bg-emerald-100 text-emerald-800',
  'intermediate': 'bg-amber-100 text-amber-800',
  'advanced': 'bg-rose-100 text-rose-800',
  'expert': 'bg-purple-100 text-purple-800',
};


export default function CourseCatalog() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses = [], isLoading } = useQuery<CourseOut[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
  });

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];
  const filteredCourses = courses.filter(c => {
    const matchesCategory = filter === 'All' || c.category === filter;
    const matchesSearch = !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.skills_gained && c.skills_gained.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="bg-indigo-600 rounded-2xl p-8 sm:p-12 text-white mb-8 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{t('courses.title', 'Build Your Career Skills')}</h1>
            <p className="text-indigo-100 text-lg mb-8">
              {t('courses.subtitle', 'Master the most in-demand skills with our interactive, project-based courses. Start learning today and track your progress along the way.')}
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-3 border border-white/20">
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-indigo-200 text-sm">{t('courses.allCourses', 'Active Courses')}</div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-20 -mb-20 w-64 h-64 rounded-full bg-indigo-400/20 blur-2xl"></div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex overflow-x-auto gap-2 hide-scrollbar pb-1 max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses, skills..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 h-72 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-slate-100 rounded"></div>
                  <div className="h-3 bg-slate-100 rounded"></div>
                  <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl mt-auto"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No courses found</h3>
            <p className="text-slate-500">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link 
                key={course.id} 
                to={`/courses/${course.slug}`}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all p-6 flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                    {categoryIcons[course.category] || categoryIcons.default}
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${difficultyColors[course.difficulty] || difficultyColors.Beginner}`}>
                    {course.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-5">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-slate-400" />
                    {course.duration_weeks} weeks
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-slate-400" />
                    {course.num_lessons} lessons
                  </div>
                </div>

                {course.skills_gained && course.skills_gained.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
                    {course.skills_gained.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {skill}
                      </span>
                    ))}
                    {course.skills_gained.length > 3 && (
                      <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                        +{course.skills_gained.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {!course.skills_gained?.length && <div className="mt-auto"></div>}

                {course.enrolled ? (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <ProgressBar pct={course.progress_pct} color="bg-indigo-500" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600">{t('courses.continueCourse', 'Continue Learning')}</span>
                      <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-slate-700 group-hover:text-indigo-600 font-bold text-sm transition-colors">
                      {t('courses.startCourse', 'Start Learning')}
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
