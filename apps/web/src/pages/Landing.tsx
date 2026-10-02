import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Target, Map, TrendingUp,
  CheckCircle2, ArrowRight, Zap, BookOpen, Users,
} from 'lucide-react';

const features = [
  { icon: Target,    title: 'Skill Gap Analysis',    desc: 'Know exactly which skills you have, which are partial, and which are missing for your target role.' },
  { icon: Map,       title: 'Personalised Roadmap',   desc: 'Prerequisite-ordered, phase-by-phase learning plan generated specifically for your profile and goals.' },
  { icon: BookOpen,  title: 'Curated Resources',      desc: '50+ verified courses, books and projects — free and paid — mapped to each skill and career path.' },
  { icon: TrendingUp,title: 'Progress Tracking',      desc: 'Three-component competency scores give you an honest, measurable career-readiness number.' },
  { icon: Zap,       title: 'AI Explanations',        desc: "Every recommendation includes a plain-language explanation of why it was chosen for you specifically." },
  { icon: Users,     title: 'Built for India',        desc: 'Career paths, timeline estimates, and companies calibrated for Indian undergraduate placement cycles.' },
];

const careers = [
  'Software Development Engineer', 'Data Analyst', 'Data Scientist / ML Engineer',
  'DevOps / SRE', 'Product Manager', 'Business Analyst',
  'UI/UX Designer', 'Cybersecurity Analyst', 'Cloud Architect',
  'Investment Banking Analyst', 'Digital Marketing Analyst', 'Full-Stack Developer',
  'Quant / Quant Finance', 'Consultant (Strategy)', 'Financial Analyst',
];

const steps = [
  { n: '01', title: 'Create your profile',  desc: 'Tell us your degree, year, current skills and how many hours per week you can learn.' },
  { n: '02', title: 'Pick a career path',   desc: 'Browse 15 curated paths. See required skills, timelines and example companies.' },
  { n: '03', title: 'Get your roadmap',     desc: 'A prerequisite-ordered, phase-by-phase plan with resources and projects.' },
  { n: '04', title: 'Track and adapt',      desc: 'Mark milestones complete. Your competency score updates. The roadmap adapts as you grow.' },
];

export const Landing = () => (
  <div className="min-h-screen bg-white">
    {/* Navbar */}
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">
            Student<span className="text-brand-600">Roadmap</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login"    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get started free</Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-purple-50 pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-brand-700 text-sm font-medium mb-6">
          <Zap className="w-3.5 h-3.5" /> AI-powered career guidance for Indian students
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
          Your personalised career<br />
          <span className="text-brand-600">roadmap, step by step.</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Stop guessing. Know exactly which skills to build, in what order, with verified
          resources — tailored to your degree, year, and target job.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-7 py-3">
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/careers" className="btn-secondary text-base px-7 py-3">Browse career paths</Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">No credit card required · Takes 5 minutes to get your roadmap</p>
      </div>

      {/* Hero mock */}
      <div className="max-w-3xl mx-auto mt-16 px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-gray-400 font-mono">StudentRoadmap AI — Data Analyst Path</span>
          </div>
          <div className="space-y-3">
            {[
              { phase: 'Phase 1 — Foundation',   items: ['Python Basics', 'SQL Fundamentals', 'Statistics 101'], done: true,  active: false },
              { phase: 'Phase 2 — Core Tools',   items: ['Pandas & NumPy', 'Data Visualisation', 'Excel'],       done: false, active: true  },
              { phase: 'Phase 3 — Analytics',    items: ['Business Analysis', 'Dashboard Design', 'Case Study'], done: false, active: false },
            ].map((ph) => (
              <div key={ph.phase} className={`rounded-xl p-4 border ${
                ph.done   ? 'bg-emerald-50 border-emerald-100' :
                ph.active ? 'bg-brand-50 border-brand-200'    :
                            'bg-gray-50 border-gray-100'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-semibold ${
                    ph.done ? 'text-emerald-700' : ph.active ? 'text-brand-700' : 'text-gray-400'
                  }`}>
                    {ph.done && <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />}
                    {ph.phase}
                  </span>
                  {ph.active && <span className="badge bg-brand-100 text-brand-700">In Progress</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ph.items.map((item) => (
                    <span key={item} className="text-xs bg-white border border-gray-200 rounded-md px-2 py-1 text-gray-600">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Stats bar */}
    <section className="py-12 bg-brand-600">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-white text-center">
        {[['15+','Career Paths'],['50+','Verified Resources'],['30+','Project Ideas'],['8-step','Onboarding']].map(([n,l]) => (
          <div key={l}>
            <div className="text-3xl font-extrabold">{n}</div>
            <div className="text-brand-100 text-sm mt-1">{l}</div>
          </div>
        ))}
      </div>
    </section>

    {/* How it works */}
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          <p className="text-gray-500">From sign-up to a personalised roadmap in under 10 minutes.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="w-10 h-10 bg-brand-50 border-2 border-brand-200 rounded-xl flex items-center justify-center text-brand-700 font-bold text-sm mb-4">
                {s.n}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to get placed</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            One platform that replaces 10 scattered sources of career advice — with evidence-based, personalised guidance.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Career paths */}
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">15 career paths. Yours is here.</h2>
          <p className="text-gray-500">Curated for Indian undergraduates across tech, finance, design, and consulting.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2.5">
          {careers.map((c) => (
            <span key={c}
              className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:border-brand-400 hover:text-brand-700 cursor-pointer transition-colors">
              {c}
            </span>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
            Explore all paths <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-800">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to build your roadmap?</h2>
        <p className="text-brand-100 mb-8">
          Join students building skills the right way — in the right order, for the right role.
        </p>
        <Link to="/register"
          className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors">
          Create free account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-gray-400 py-10">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-400" />
          <span className="text-white font-semibold">StudentRoadmap AI</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} StudentRoadmap AI. Built for Indian students.</p>
      </div>
    </footer>
  </div>
);
