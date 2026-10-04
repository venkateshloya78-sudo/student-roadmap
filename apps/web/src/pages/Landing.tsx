import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Common/Logo'
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Compass,
  BookOpen,
  Layers,
  Award,
  Zap,
  BarChart3,
  Brain,
  Clock,
  Target,
  ChevronRight,
  ShieldCheck,
  Code2
} from 'lucide-react'

const features = [
  {
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    title: 'Precision Skill Gap Analysis',
    desc: 'Compare your current profile with real industry hiring standards. See exactly which skills you lack and what order to learn them.',
  },
  {
    icon: Layers,
    color: 'from-violet-500 to-purple-600',
    title: 'Prerequisite-Ordered Roadmaps',
    desc: 'Escape tutorial hell. Our dependency graphs ensure you master fundamentals first before tackling advanced systems.',
  },
  {
    icon: Brain,
    color: 'from-pink-500 to-rose-600',
    title: 'AI Career Mentor & Copilot',
    desc: 'Instant answers to difficult concepts, custom interactive flashcards, interview vaults, and automated knowledge checks.',
  },
  {
    icon: BarChart3,
    color: 'from-amber-500 to-orange-600',
    title: 'Real-Time Labor Market Data',
    desc: 'Every skill recommendation and roadmap phase is grounded in live market demand, salary trends, and employer expectations.',
  },
]

const careers = [
  {
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    skills: ['Python', 'PyTorch', 'Linear Algebra', 'MLOps'],
    salary: '₹14 - 32 LPA',
    color: 'from-rose-500 via-pink-600 to-purple-600',
    badge: 'High Demand',
  },
  {
    title: 'Software Developer',
    slug: 'software-developer',
    skills: ['Data Structures', 'TypeScript', 'System Design', 'SQL'],
    salary: '₹10 - 24 LPA',
    color: 'from-indigo-500 via-purple-600 to-blue-600',
    badge: 'Popular',
  },
  {
    title: 'Cloud & DevOps Engineer',
    slug: 'cloud-engineer',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    salary: '₹12 - 28 LPA',
    color: 'from-amber-500 via-orange-600 to-rose-600',
    badge: 'Fast Growing',
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    skills: ['SQL', 'Python', 'Power BI', 'Statistics'],
    salary: '₹8 - 18 LPA',
    color: 'from-blue-500 via-cyan-600 to-teal-500',
    badge: 'Beginner Friendly',
  },
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    skills: ['Network Security', 'Linux', 'Ethical Hacking', 'SIEM'],
    salary: '₹11 - 25 LPA',
    color: 'from-emerald-500 via-teal-600 to-cyan-600',
    badge: 'Critical Need',
  },
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
    salary: '₹8 - 20 LPA',
    color: 'from-fuchsia-500 via-pink-600 to-rose-500',
    badge: 'Creative',
  },
]

const stats = [
  { value: '12', label: 'Curated Career Roles', sub: 'Industry-standard pathways' },
  { value: '55+', label: 'Skills Mapped', sub: 'With verified prerequisites' },
  { value: '100%', label: 'Free for Students', sub: 'No paywalls on learning' },
  { value: '24/7', label: 'AI Study Assistant', sub: 'Interactive tutoring on demand' },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState<'preview' | 'skills' | 'mentor'>('preview')

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Sleek Floating Glass Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Logo href="/" size="md" showTagline={true} />

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#careers" className="hover:text-indigo-600 transition-colors">Career Paths</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors">Live Demo</a>
            <Link to="/courses" className="hover:text-indigo-600 transition-colors">Course Catalog</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm font-medium">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm font-semibold shadow-md shadow-indigo-500/25">
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-400/20 via-violet-400/20 to-pink-400/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-12 left-10 w-72 h-72 bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-10 w-96 h-96 bg-purple-400/15 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Announcement Chip */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200/70 shadow-sm backdrop-blur-md mb-8 hover:border-indigo-400 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800">
              Personalized Career Intelligence • Powered by Real Market Data
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Your dream career,{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              engineered by data.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Turn your academic profile into an intelligent, prerequisite-ordered roadmap.
            Know exactly what to learn, when to build, and how to become 100% industry ready.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span>Build my roadmap free</span>
              <ArrowRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/careers"
              className="btn-secondary text-base px-7 py-3.5 rounded-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              <Compass className="w-4 h-4 mr-1 text-slate-500" />
              <span>Browse 12 career roles</span>
            </Link>
          </div>

          {/* Trust Metrics Pill */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500 pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Prerequisite-validated paths</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>55+ Verified industry skills</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Built-in AI tutor with flashcards</span>
            </div>
          </div>
        </div>

        {/* HERO SHOWPIECE: Interactive Simulated Dashboard Card */}
        <div id="demo" className="mt-16 max-w-5xl mx-auto relative">
          <div className="p-1 sm:p-2.5 rounded-3xl bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent shadow-2xl backdrop-blur-2xl">
            <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xl overflow-hidden">
              {/* Window Header */}
              <div className="px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs text-slate-400 ml-2 font-mono">studentroadmap.ai/dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live Preview
                  </span>
                </div>
              </div>

              {/* Showpiece Body */}
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-slate-50/50">
                {/* Profile Overview Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white shadow-lg mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
                        Target Goal
                      </span>
                      <span className="text-xs text-indigo-100">B.Tech CS • 3rd Year</span>
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">AI & Machine Learning Engineer</h3>
                    <p className="text-xs text-indigo-100 mt-1">Average Starting Package: ₹14,00,000 - ₹32,00,000 / year</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-2xl font-extrabold">78%</span>
                      <p className="text-[11px] text-indigo-200">Readiness Score</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                      <TrendingUp className="w-6 h-6 text-emerald-300" />
                    </div>
                  </div>
                </div>

                {/* Simulated Roadmap Steps */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {/* Phase 1 */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Phase 1: Foundations</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Python & Mathematical Logic</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-emerald-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-600 h-full w-full" />
                      </div>
                      <span className="text-xs font-semibold text-emerald-800">100%</span>
                    </div>
                  </div>

                  {/* Phase 2 */}
                  <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 shadow-sm relative">
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">
                      Current Focus
                    </span>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">Phase 2: Core ML</span>
                      <Clock className="w-4 h-4 text-indigo-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Supervised Learning & Pandas</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-indigo-200 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-600 h-full w-[65%]" />
                      </div>
                      <span className="text-xs font-semibold text-indigo-800">65%</span>
                    </div>
                  </div>

                  {/* Phase 3 */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Phase 3: Deep Tech</span>
                      <span className="text-xs text-slate-400">Prereq Locked</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Neural Networks & PyTorch</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-slate-300 h-full w-[0%]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">0%</span>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Insight Banner */}
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-300">
                      <span className="font-semibold text-white">AI Mentor Tip:</span> Completing the 2 practice quizzes in Module 3 this week unlocks your first milestone certificate and pushes your readiness match to 82%!
                    </p>
                  </div>
                  <Link
                    to="/register"
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                  >
                    Try it yourself →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="py-14 border-y border-slate-200/80 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center group">
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform duration-300">
                {s.value}
              </div>
              <div className="text-sm font-bold text-slate-800">{s.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Feature Showcase */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-200/60">
              Why StudentRoadmap Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4">
              Engineered to replace confusion with absolute clarity
            </h2>
            <p className="text-slate-600 text-lg">
              No more random courses, broken syllabus links, or senior myths. Everything you need to transition from student to hireable engineer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="card-interactive p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-md shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-indigo-600 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 12 Career Paths Grid */}
      <section id="careers" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-100/70 to-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider border border-purple-200/60">
                12 High-Impact Pathways
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-2">
                Curated Career Blueprints
              </h2>
              <p className="text-slate-600 text-base">
                Explore in-demand roles mapped with salary expectations and essential competencies.
              </p>
            </div>
            <Link
              to="/careers"
              className="mt-4 sm:mt-0 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
            >
              <span>View all 12 paths</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map(c => (
              <Link
                key={c.slug}
                to={`/careers/${c.slug}`}
                className="card-interactive p-6 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-all duration-300`}>
                      {c.title[0]}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {c.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-600 mb-4">
                    Est. {c.salary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.skills.map(s => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                  <span>Explore Curriculum & Roadmap</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Massive Call To Action */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 -z-10" />
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 p-10 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-6 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              100% Free For All Students
            </span>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 leading-tight">
              Ready to take control of your career?
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8 font-light leading-relaxed">
              Join thousands of students who traded guesswork for structured, prerequisite-grounded learning roadmaps.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 shadow-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Create your free roadmap →
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                Sign into existing account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Modern Footer */}
      <footer className="py-12 border-t border-slate-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo href="/" size="sm" showTagline={true} />

            <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
              <Link to="/courses" className="hover:text-indigo-600 transition-colors">Courses</Link>
              <Link to="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link>
              <Link to="/login" className="hover:text-indigo-600 transition-colors">Sign in</Link>
              <Link to="/register" className="hover:text-indigo-600 transition-colors">Register</Link>
            </div>

            <div className="text-xs text-slate-400">
              © 2026 StudentRoadmap AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
