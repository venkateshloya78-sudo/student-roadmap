import { Link } from 'react-router-dom'

const features = [
  { icon: '🎯', title: 'Skill Gap Analysis', desc: 'See exactly which skills you\'re missing for your target career, ranked by priority.' },
  { icon: '🗺️', title: 'Personalised Roadmap', desc: 'Get a prerequisite-ordered, phase-by-phase learning plan built around your schedule.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Track every skill you learn, every project you build, every milestone you hit.' },
  { icon: '🔍', title: 'Evidence-Grounded', desc: 'Every skill requirement is sourced from real job market data — not guesswork.' },
]

const careers = [
  { title: 'Data Analyst', slug: 'data-analyst', skills: ['SQL', 'Python', 'Power BI', 'Statistics'], color: 'from-blue-500 to-cyan-500' },
  { title: 'Software Developer', slug: 'software-developer', skills: ['Python', 'Git', 'REST APIs', 'SQL'], color: 'from-violet-500 to-purple-500' },
  { title: 'AI/ML Engineer', slug: 'ai-ml-engineer', skills: ['Python', 'TensorFlow', 'Statistics', 'Linear Algebra'], color: 'from-rose-500 to-pink-500' },
  { title: 'Cloud Engineer', slug: 'cloud-engineer', skills: ['AWS', 'Docker', 'Kubernetes', 'Linux'], color: 'from-amber-500 to-orange-500' },
  { title: 'UI/UX Designer', slug: 'ui-ux-designer', skills: ['Figma', 'Prototyping', 'User Research'], color: 'from-emerald-500 to-teal-500' },
  { title: 'Product Manager', slug: 'product-manager', skills: ['Strategy', 'Analytics', 'Roadmapping'], color: 'from-indigo-500 to-blue-500' },
]

const stats = [
  { value: '12', label: 'Career Paths' },
  { value: '55+', label: 'Skills Mapped' },
  { value: '100+', label: 'Skill Requirements' },
  { value: '49', label: 'Prerequisite Links' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">SR</span>
            </div>
            <span className="font-bold text-slate-900">StudentRoadmap</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm">Get started free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-6 border border-indigo-100">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            Evidence-grounded career planning for students
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Your career roadmap,
            <br />
            <span className="text-indigo-600">built by data.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn your profile into a personalised, prerequisite-ordered skill-building plan. 
            Know exactly what to learn, in what order, and why.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3 shadow-lg shadow-indigo-200">
              Build my roadmap →
            </Link>
            <Link to="/careers" className="btn-secondary text-base px-6 py-3">
              Browse careers
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-indigo-600">{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to go from student to job-ready</h2>
            <p className="text-slate-500 text-lg">No more scattered YouTube tabs, random courses, and seniors' conflicting advice.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career paths */}
      <section className="py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">12 career paths. All mapped.</h2>
            <p className="text-slate-500">Every role has curated, evidence-backed skill requirements.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {careers.map(c => (
              <Link key={c.slug} to={`/careers/${c.slug}`} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} mb-4 flex items-center justify-center`}>
                  <span className="text-white text-lg font-bold">{c.title[0]}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {c.skills.map(s => (
                    <span key={s} className="badge bg-slate-100 text-slate-600">{s}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/careers" className="btn-secondary">View all 12 careers →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card p-12 bg-gradient-to-br from-indigo-600 to-purple-600 border-0">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to build your roadmap?</h2>
            <p className="text-indigo-100 mb-8 text-lg">Takes 2 minutes to set up. Free forever.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors shadow-lg">
              Get started free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">SR</span>
            </div>
            StudentRoadmap AI — evidence-grounded career planning
          </div>
          <div className="text-slate-400 text-xs">Built for students. Powered by real market data.</div>
        </div>
      </footer>
    </div>
  )
}
