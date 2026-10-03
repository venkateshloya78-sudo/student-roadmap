import React, { useState, useMemo } from 'react';
import AppShell from '../components/Layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  BarChart, 
  ArrowRight, 
  Search, 
  Briefcase, 
  Layers, 
  Filter,
  CheckCircle,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { CourseOut } from '../types/course';
import ProgressBar from '../components/Course/ProgressBar';
import { useLanguage } from '../i18n/LanguageContext';
import { getRelatedCareersForCourse, COURSE_CAREERS_MAP } from '../data/careerCoursesMap';

const categoryIcons: Record<string, string> = {
  'programming': '💻',
  'data': '📊',
  'cloud': '☁️',
  'security': '🔒',
  'systems': '🐧',
  'tools': '🛠️',
  'mobile': '📱',
  'design': '🎨',
  'default': '📚'
};

const categoryLabels: Record<string, string> = {
  'programming': 'Programming & Algorithms',
  'data': 'Data & Databases',
  'cloud': 'Cloud & Infrastructure',
  'security': 'Cybersecurity',
  'systems': 'Linux & Systems',
  'tools': 'Developer Tools',
  'mobile': 'Mobile Development',
};

const difficultyColors: Record<string, string> = {
  'beginner': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'intermediate': 'bg-amber-50 text-amber-800 border-amber-200',
  'advanced': 'bg-rose-50 text-rose-800 border-rose-200',
  'expert': 'bg-purple-50 text-purple-800 border-purple-200',
};

export default function CourseCatalog() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');

  const { data: courses = [], isLoading } = useQuery<CourseOut[]>({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
    staleTime: 60_000,
  });

  // Extract unique categories & careers
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(courses.map(c => c.category)))];
  }, [courses]);

  const allCareers = useMemo(() => {
    const careerSet = new Map<string, string>();
    for (const carList of Object.values(COURSE_CAREERS_MAP)) {
      for (const car of carList) {
        careerSet.set(car.slug, car.title);
      }
    }
    return [
      { slug: 'All', title: 'All Careers' },
      ...Array.from(careerSet.entries()).map(([slug, title]) => ({ slug, title }))
    ];
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      // 1. Category filter
      if (selectedCategory !== 'All' && c.category !== selectedCategory) {
        return false;
      }

      // 2. Difficulty filter
      if (selectedDifficulty !== 'All' && c.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
        return false;
      }

      // 3. Duration filter
      if (selectedDuration === 'short' && c.duration_weeks > 4) return false;
      if (selectedDuration === 'medium' && (c.duration_weeks <= 4 || c.duration_weeks > 6)) return false;
      if (selectedDuration === 'long' && c.duration_weeks <= 6) return false;

      // 4. Career filter
      if (selectedCareer !== 'All') {
        const related = getRelatedCareersForCourse(c.slug);
        const matchesCareer = related.some(r => r.slug === selectedCareer);
        if (!matchesCareer) return false;
      }

      // 5. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const related = getRelatedCareersForCourse(c.slug);
        const inTitle = c.title.toLowerCase().includes(q);
        const inDesc = c.description.toLowerCase().includes(q);
        const inSkills = c.skills_gained?.some(s => s.toLowerCase().includes(q));
        const inCareer = related.some(r => r.title.toLowerCase().includes(q));
        if (!inTitle && !inDesc && !inSkills && !inCareer) return false;
      }

      return true;
    });
  }, [courses, selectedCategory, selectedCareer, selectedDifficulty, selectedDuration, searchQuery]);

  const activeFiltersCount = (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCareer !== 'All' ? 1 : 0) +
    (selectedDifficulty !== 'All' ? 1 : 0) +
    (selectedDuration !== 'All' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCareer('All');
    setSelectedDifficulty('All');
    setSelectedDuration('All');
    setSearchQuery('');
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 mb-8 relative overflow-hidden shadow-2xl border border-slate-800">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-4 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CAREER-ORIENTED COURSE CATALOG</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight">
              {t('courses.title', 'Master In-Demand Career Skills')}
            </h1>
            <p className="text-indigo-200 text-base sm:text-lg mb-8 leading-relaxed">
              Explore our comprehensive library of 12 structured, career-aligned courses. Each course offers interactive lessons, runnable code, quizzes, and portfolio projects that directly connect to target tech roles.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 border border-white/15">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">{courses.length}</div>
                <div className="text-indigo-200 text-xs font-medium">Distinct Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 border border-white/15">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
                <div className="text-indigo-200 text-xs font-medium">Unique Curricula (No Duplicates)</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl px-5 py-3 border border-white/15">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">12</div>
                <div className="text-indigo-200 text-xs font-medium">Connected Career Paths</div>
              </div>
            </div>
          </div>
          {/* Decorative glows */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Filter & Search Control Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 mb-8 shadow-xs">
          {/* Top Row: Search & Active Filter Reset */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-5 pb-5 border-b border-slate-100">
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by course name, skill (e.g. Python, Docker, React), or career..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1.5 self-start md:self-auto px-3 py-1.5 bg-rose-50 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset {activeFiltersCount} active filter{activeFiltersCount > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>

          {/* Bottom Filter Controls: Career, Category, Difficulty, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Filter by Career */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                <span>Filter by Career</span>
              </label>
              <select
                value={selectedCareer}
                onChange={e => setSelectedCareer(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {allCareers.map(car => (
                  <option key={car.slug} value={car.slug}>
                    {car.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Filter by Category */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Filter by Category</span>
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer capitalize"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : categoryLabels[cat] || cat}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Filter by Difficulty */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BarChart className="w-3.5 h-3.5 text-indigo-500" />
                <span>Difficulty Level</span>
              </label>
              <select
                value={selectedDifficulty}
                onChange={e => setSelectedDifficulty(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer capitalize"
              >
                <option value="All">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* 4. Filter by Duration */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Course Duration</span>
              </label>
              <select
                value={selectedDuration}
                onChange={e => setSelectedDuration(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="All">All Durations</option>
                <option value="short">Short (&le; 4 weeks)</option>
                <option value="medium">Medium (5 &ndash; 6 weeks)</option>
                <option value="long">Comprehensive (7+ weeks)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Showing <strong>{filteredCourses.length}</strong> of <strong>{courses.length}</strong> available courses
          </span>
          {selectedCareer !== 'All' && (
            <span className="text-indigo-600 font-medium">
              Filtered for career: <strong>{allCareers.find(c => c.slug === selectedCareer)?.title}</strong>
            </span>
          )}
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 h-80 animate-pulse space-y-4">
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                  <div className="w-20 h-6 bg-slate-100 rounded-full" />
                </div>
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-14 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-100 rounded mt-auto" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No matching courses found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search keywords, clearing career filters, or exploring all categories.
            </p>
            <button onClick={clearAllFilters} className="btn-primary text-xs py-2 px-4">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => {
              const relatedCareers = getRelatedCareersForCourse(course.slug);

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 p-6 sm:p-7 flex flex-col group relative overflow-hidden"
                >
                  {/* Card Header: Icon & Difficulty */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200">
                      {categoryIcons[course.category] || categoryIcons.default}
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${difficultyColors[course.difficulty.toLowerCase()] || difficultyColors.beginner}`}>
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Course Title & Description */}
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed h-10">
                    {course.description}
                  </p>

                  {/* Duration & Lessons Meta */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-indigo-500" />
                      <span>{course.duration_weeks} weeks</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={14} className="text-indigo-500" />
                      <span>{course.num_lessons} interactive lessons</span>
                    </div>
                  </div>

                  {/* RELATED CAREERS BADGES (Crucial Career Connection) */}
                  <div className="mb-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>Related Career Roles:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {relatedCareers.map((car, idx) => (
                        <Link
                          key={idx}
                          to={`/careers/${car.slug}`}
                          onClick={e => e.stopPropagation()}
                          className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-100 flex items-center gap-1"
                        >
                          <span>💼</span>
                          <span>{car.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Skills Gained Tags */}
                  {course.skills_gained && course.skills_gained.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                      {course.skills_gained.slice(0, 3).map((skill, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          {skill}
                        </span>
                      ))}
                      {course.skills_gained.length > 3 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-400 rounded">
                          +{course.skills_gained.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer Action Button */}
                  {course.enrolled ? (
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <ProgressBar pct={course.progress_pct} color="bg-indigo-500" />
                      <Link
                        to={`/courses/${course.slug}`}
                        className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-between"
                      >
                        <span>{t('courses.continueCourse', 'Continue Learning')}</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-slate-100">
                      <Link
                        to={`/courses/${course.slug}`}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm shadow-indigo-500/20 active:scale-98 flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Start Learning Course</span>
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
