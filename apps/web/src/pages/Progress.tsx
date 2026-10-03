import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../components/Layout/AppShell'

// Skills with known slugs — we show progress for any that have study data
const KNOWN_SKILLS = [
  { slug: 'python', name: 'Python', emoji: '🐍' },
  { slug: 'javascript', name: 'JavaScript', emoji: '⚡' },
  { slug: 'react', name: 'React', emoji: '⚛️' },
  { slug: 'sql', name: 'SQL', emoji: '🗄️' },
  { slug: 'dsa', name: 'DSA', emoji: '🧮' },
  { slug: 'git', name: 'Git', emoji: '🌿' },
  { slug: 'docker', name: 'Docker', emoji: '🐳' },
  { slug: 'linux-cli', name: 'Linux CLI', emoji: '💻' },
  { slug: 'aws', name: 'AWS', emoji: '☁️' },
  { slug: 'postgresql', name: 'PostgreSQL', emoji: '🐘' },
  { slug: 'statistics', name: 'Statistics', emoji: '📊' },
  { slug: 'linear-algebra', name: 'Linear Algebra', emoji: '📐' },
  { slug: 'probability', name: 'Probability', emoji: '🎲' },
  { slug: 'oop', name: 'OOP', emoji: '🏗️' },
  { slug: 'rest-api', name: 'REST API', emoji: '🔌' },
  { slug: 'data-visualization', name: 'Data Viz', emoji: '📈' },
  { slug: 'agile-scrum', name: 'Agile / Scrum', emoji: '🏃' },
  { slug: 'figma', name: 'Figma', emoji: '🎨' },
  { slug: 'power-bi', name: 'Power BI', emoji: '📉' },
]

interface SkillProgress {
  slug: string
  name: string
  emoji: string
  studiedCount: number
  notesCount: number
}

function SkillProgressCard({ skill }: { skill: SkillProgress }) {
  if (skill.studiedCount === 0 && skill.notesCount === 0) return null
  return (
    <Link
      to={`/skills/${skill.slug}`}
      className="card p-4 hover:shadow-md transition-all hover:border-indigo-200 group"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{skill.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{skill.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            {skill.studiedCount > 0 && (
              <span className="text-xs text-emerald-600">✓ {skill.studiedCount} topics</span>
            )}
            {skill.notesCount > 0 && (
              <span className="text-xs text-violet-600">✏️ {skill.notesCount} notes</span>
            )}
          </div>
        </div>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export const ProgressPage = () => {
  // Read all study data from localStorage
  const { skillProgress, totalStudied, totalNotes, recentActivity } = useMemo(() => {
    const progress: SkillProgress[] = KNOWN_SKILLS.map(skill => {
      let studiedCount = 0
      let notesCount = 0
      try {
        const studied = JSON.parse(localStorage.getItem(`srm_studied_${skill.slug}`) || '[]')
        studiedCount = studied.length
      } catch {}
      try {
        const notes = JSON.parse(localStorage.getItem(`srm_mynotes_${skill.slug}`) || '{}')
        notesCount = Object.keys(notes).length
      } catch {}
      return { ...skill, studiedCount, notesCount }
    })

    const totalStudied = progress.reduce((s, p) => s + p.studiedCount, 0)
    const totalNotes = progress.reduce((s, p) => s + p.notesCount, 0)

    // Also read resource completions from srm_progress
    const resourceProgress = JSON.parse(localStorage.getItem('srm_progress') || '{}')
    const completedResources = Object.values(resourceProgress).filter((v: any) => v?.completed).length

    // Active skills (have any progress)
    const recentActivity = progress.filter(p => p.studiedCount > 0 || p.notesCount > 0)
      .sort((a, b) => (b.studiedCount + b.notesCount) - (a.studiedCount + a.notesCount))

    return { skillProgress: progress, totalStudied, totalNotes, completedResources, recentActivity }
  }, [])

  const activeSkillCount = skillProgress.filter(s => s.studiedCount > 0 || s.notesCount > 0).length

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Learning Progress</h1>
          <p className="text-slate-500 text-sm">Track topics you've studied and personal notes you've written.</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-emerald-600 mb-1">{totalStudied}</p>
            <p className="text-xs text-slate-500 font-medium">Topics Studied</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-violet-600 mb-1">{totalNotes}</p>
            <p className="text-xs text-slate-500 font-medium">Personal Notes</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-indigo-600 mb-1">{activeSkillCount}</p>
            <p className="text-xs text-slate-500 font-medium">Skills Active</p>
          </div>
          <div className="card p-5 text-center">
            <p className="text-3xl font-black text-amber-600 mb-1">
              {JSON.parse(localStorage.getItem('srm_progress') || '{}') &&
                Object.values(JSON.parse(localStorage.getItem('srm_progress') || '{}')).filter((v: any) => v?.completed).length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Resources Done</p>
          </div>
        </div>

        {totalStudied === 0 && totalNotes === 0 ? (
          /* Empty state */
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Start your study journey</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Open any skill from <strong>Careers & Skills</strong>, read the curated notes,
              check off topics you've studied, and add your own personal notes.
              Your progress will appear here.
            </p>
            <Link to="/careers" className="btn-primary">Browse Skills →</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Skills with progress */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                🎯 Skills in Progress
                <span className="badge bg-indigo-100 text-indigo-700">{activeSkillCount} active</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentActivity.map(skill => (
                  <SkillProgressCard key={skill.slug} skill={skill} />
                ))}
              </div>
            </div>

            {/* Suggestions: skills not yet started */}
            <div>
              <h2 className="font-semibold text-slate-900 mb-4">📋 Not Started Yet</h2>
              <div className="flex flex-wrap gap-2">
                {skillProgress
                  .filter(s => s.studiedCount === 0 && s.notesCount === 0)
                  .map(skill => (
                    <Link
                      key={skill.slug}
                      to={`/skills/${skill.slug}`}
                      className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all"
                    >
                      <span>{skill.emoji}</span>
                      <span>{skill.name}</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Tips */}
            <div className="card p-5 bg-indigo-50 border-indigo-100">
              <h3 className="font-semibold text-indigo-900 mb-3 text-sm">💡 Study Tips</h3>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">›</span> Click <strong>📖 Read</strong> on any topic in a skill to see curated study notes</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">›</span> Use <strong>✏️ Add note</strong> to write your own summary or examples — they appear in the <strong>My Notes</strong> tab</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">›</span> Check ○ on a topic to mark it as studied — track your week-by-week progress</li>
                <li className="flex items-start gap-2"><span className="text-indigo-400 font-bold mt-0.5">›</span> Use the Search bar in the curriculum to quickly find specific topics across all weeks</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}

export default ProgressPage
