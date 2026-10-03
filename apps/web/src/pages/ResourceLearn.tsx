import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AppShell from '../components/Layout/AppShell'
import api from '../lib/api'
import { getResourceContent, ResourceContent, ContentBlock } from '../data/resourceContent'

interface ResourceData {
  id: string
  title: string
  url: string
  type: string
  is_free: boolean
  youtube_id: string | null
  content_key: string
  skill: { name: string; slug: string } | null
  navigation: { prev_id: string | null; next_id: string | null; current: number; total: number }
}

// ── Progress helpers ──────────────────────────────────────────────────────────
const saveProgress = (resourceId: string, score: number) => {
  const data = JSON.parse(localStorage.getItem('srm_progress') || '{}')
  data[resourceId] = { completed: true, score, completedAt: new Date().toISOString() }
  localStorage.setItem('srm_progress', JSON.stringify(data))
}
export const isResourceCompleted = (resourceId: string): boolean => {
  const data = JSON.parse(localStorage.getItem('srm_progress') || '{}')
  return !!data[resourceId]?.completed
}

// ── Type badge ────────────────────────────────────────────────────────────────
const typeIcon: Record<string, string> = {
  video: '🎬', book: '📚', course: '🎓', documentation: '📖',
  tutorial: '🛠️', article: '📰', other: '📄'
}
const typeBg: Record<string, string> = {
  video: 'bg-red-50 text-red-700', book: 'bg-amber-50 text-amber-700',
  course: 'bg-purple-50 text-purple-700', documentation: 'bg-blue-50 text-blue-700',
  tutorial: 'bg-emerald-50 text-emerald-700', article: 'bg-sky-50 text-sky-700',
  other: 'bg-slate-50 text-slate-600'
}

// ── Block renderer ────────────────────────────────────────────────────────────
function BlockRenderer({ block }: { block: ContentBlock }) {
  const cn = block.content as string
  const list = block.content as string[]
  switch (block.type) {
    case 'heading':
      return <h3 className="mt-8 mb-3 text-xl font-bold text-slate-900 border-b pb-2">{cn}</h3>
    case 'text':
      return <p className="mb-4 text-slate-700 leading-relaxed">{cn}</p>
    case 'code':
      return (
        <div className="mb-4 rounded-xl overflow-hidden border border-slate-200">
          {block.language && (
            <div className="bg-slate-700 px-4 py-1.5 text-xs text-slate-300 font-mono">
              {block.language}
            </div>
          )}
          <pre className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-sm leading-relaxed">
            <code>{cn}</code>
          </pre>
        </div>
      )
    case 'tip':
      return (
        <div className="mb-4 p-4 bg-emerald-50 rounded-xl border-l-4 border-emerald-500">
          <p className="text-emerald-800 leading-relaxed">{cn}</p>
        </div>
      )
    case 'warning':
      return (
        <div className="mb-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
          <p className="text-amber-800 leading-relaxed">{cn}</p>
        </div>
      )
    case 'list':
      return (
        <ul className="mb-4 space-y-2 pl-2">
          {list.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="text-indigo-500 font-bold mt-0.5 flex-shrink-0">›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'example':
      return (
        <div className="mb-4 rounded-xl border border-indigo-100 overflow-hidden">
          {block.title && (
            <div className="px-4 py-2.5 bg-indigo-50 border-b border-indigo-100">
              <p className="font-semibold text-indigo-800 text-sm">💡 {block.title}</p>
            </div>
          )}
          <pre className="p-4 bg-indigo-950 text-indigo-100 overflow-x-auto text-sm leading-relaxed">
            <code>{cn}</code>
          </pre>
        </div>
      )
    default:
      return null
  }
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResourceLearn() {
  const { resourceId } = useParams<{ resourceId: string }>()
  const [data, setData] = useState<ResourceData | null>(null)
  const [content, setContent] = useState<ResourceContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [openPractice, setOpenPractice] = useState<number | null>(null)

  useEffect(() => {
    if (!resourceId) return
    setLoading(true)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(0)
    api.get(`/resources/${resourceId}`)
      .then(res => {
        setData(res.data)
        setContent(getResourceContent(res.data.content_key))
        setCompleted(isResourceCompleted(resourceId))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [resourceId])

  const handleQuizSubmit = () => {
    if (!content) return
    let score = 0
    content.quiz.forEach((q, idx) => { if (quizAnswers[idx] === q.correct) score++ })
    setQuizScore(score)
    setQuizSubmitted(true)
  }

  const markComplete = () => {
    saveProgress(resourceId!, quizScore)
    setCompleted(true)
  }

  if (loading) return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-8 bg-slate-100 rounded w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="aspect-video bg-slate-100 rounded-xl" />
      </div>
    </AppShell>
  )

  if (!data) return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-3">😕</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Resource not found</h2>
        <Link to="/careers" className="btn-primary">Browse careers</Link>
      </div>
    </AppShell>
  )

  const canMarkComplete = !content || quizSubmitted

  return (
    <AppShell>
      <div className="bg-white min-h-screen pb-28">

        {/* ── Top breadcrumb bar ── */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
            {data.skill && (
              <>
                <Link to={`/skills/${data.skill.slug}`} className="hover:text-indigo-600 transition-colors font-medium whitespace-nowrap">
                  {data.skill.name}
                </Link>
                <span className="text-slate-300">/</span>
              </>
            )}
            <span className="truncate text-slate-700">{data.title}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {completed && (
              <span className="badge bg-emerald-100 text-emerald-700 text-xs">✓ Done</span>
            )}
            <span className="badge bg-slate-100 text-slate-600 text-xs">
              {data.navigation.current} / {data.navigation.total}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">

          {/* ── YouTube / Video Embed ── */}
          {data.youtube_id && (
            <div className="w-full bg-black" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={
                  data.youtube_id.startsWith('playlist:')
                    ? `https://www.youtube.com/embed/videoseries?list=${data.youtube_id.split(':')[1]}&rel=0&modestbranding=1`
                    : `https://www.youtube.com/embed/${data.youtube_id}?rel=0&modestbranding=1&controls=1&showinfo=0`
                }
                className="w-full h-full"
                style={{ minHeight: '300px' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                frameBorder="0"
                title={data.title}
              />
            </div>
          )}

          <div className="px-4 sm:px-8 py-8">

            {/* ── Resource header ── */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`badge ${typeBg[data.type] || typeBg.other}`}>
                  {typeIcon[data.type] || '📄'} {data.type}
                </span>
                {data.is_free && <span className="badge bg-emerald-50 text-emerald-700">Free</span>}
                {content && (
                  <span className="text-xs text-slate-400">⏱ {content.estimatedMinutes} min</span>
                )}
                {completed && (
                  <span className="badge bg-emerald-100 text-emerald-700">✓ Completed</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                {content?.title || data.title}
              </h1>
              {content?.subtitle && (
                <p className="text-lg text-slate-500 mb-4">{content.subtitle}</p>
              )}
              {content?.intro && (
                <p className="text-slate-700 leading-relaxed text-base">{content.intro}</p>
              )}
            </div>

            {/* ── No in-built content fallback ── */}
            {!content ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-5xl mb-4">📖</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">In-built content coming soon</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  We're building detailed interactive content for this resource.
                  You can still mark it as completed after reviewing the material.
                </p>
                {data.youtube_id && (
                  <p className="text-sm text-slate-400 mb-6">
                    📺 The video above is embedded for you — watch it here without leaving the app.
                  </p>
                )}
                <button onClick={markComplete} className="btn-primary">
                  {completed ? '✓ Already Completed' : 'Mark as Completed'}
                </button>
              </div>
            ) : (
              <div className="space-y-10">

                {/* ── What You'll Learn ── */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                  <h3 className="text-base font-bold text-indigo-900 mb-4">🎯 What You'll Learn</h3>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {content.whatYoullLearn.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-indigo-800 text-sm">
                        <span className="text-indigo-400 font-bold mt-0.5 flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Key Concepts ── */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">📌 Key Concepts</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {content.keyConcepts.map((kc, i) => (
                      <div key={i} className="card p-4 hover:shadow-md transition-shadow">
                        <div className="text-2xl mb-2">{kc.emoji || '📌'}</div>
                        <h4 className="font-bold text-slate-900 mb-1 text-sm">{kc.term}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{kc.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Content blocks ── */}
                <div className="bg-white">
                  {content.blocks.map((block, i) => <BlockRenderer key={i} block={block} />)}
                </div>

                {/* ── Practice Questions ── */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">💪 Practice Questions</h3>
                  <div className="space-y-3">
                    {content.practiceQuestions.map((pq, i) => (
                      <div key={i} className="card overflow-hidden">
                        <button
                          className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                          onClick={() => setOpenPractice(openPractice === i ? null : i)}
                        >
                          <span className="font-medium text-slate-800 text-sm pr-4">Q{i + 1}: {pq.q}</span>
                          <span className="text-slate-400 font-bold flex-shrink-0 text-lg">
                            {openPractice === i ? '−' : '+'}
                          </span>
                        </button>
                        {openPractice === i && (
                          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Answer</p>
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                              {pq.a}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Quiz ── */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-slate-900">🎯 Knowledge Quiz</h3>
                    {quizSubmitted && (
                      <span className={`text-lg font-black ${quizScore >= 3 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {quizScore}/{content.quiz.length}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm mb-8">
                    Answer all {content.quiz.length} questions to unlock Mark as Completed.
                  </p>

                  <div className="space-y-6">
                    {content.quiz.map((q, qIdx) => {
                      const answered = quizAnswers[qIdx] !== undefined
                      const isCorrect = quizAnswers[qIdx] === q.correct
                      return (
                        <div key={qIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          <div className="px-5 py-4 border-b border-slate-100">
                            <p className="font-semibold text-slate-900 text-sm">
                              {qIdx + 1}. {q.question}
                            </p>
                          </div>
                          <div className="p-4 space-y-2">
                            {q.options.map((opt, oIdx) => {
                              const selected = quizAnswers[qIdx] === oIdx
                              let bg = 'hover:bg-slate-50 border-slate-200'
                              if (selected && !quizSubmitted) bg = 'bg-indigo-50 border-indigo-400'
                              if (quizSubmitted) {
                                if (oIdx === q.correct) bg = 'bg-emerald-50 border-emerald-400'
                                else if (selected) bg = 'bg-red-50 border-red-400'
                                else bg = 'border-slate-100 opacity-60'
                              }
                              return (
                                <label
                                  key={oIdx}
                                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${bg} ${quizSubmitted ? 'cursor-default' : ''}`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${qIdx}`}
                                    checked={selected}
                                    disabled={quizSubmitted}
                                    onChange={() => !quizSubmitted && setQuizAnswers(p => ({ ...p, [qIdx]: oIdx }))}
                                    className="accent-indigo-600 flex-shrink-0"
                                  />
                                  <span className="text-sm text-slate-700">{opt}</span>
                                  {quizSubmitted && oIdx === q.correct && (
                                    <span className="ml-auto text-emerald-600 text-sm font-bold flex-shrink-0">✓</span>
                                  )}
                                </label>
                              )
                            })}
                          </div>
                          {quizSubmitted && (
                            <div className={`px-5 py-3 text-sm border-t ${isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
                              <span className="font-bold">{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</span>
                              {' '}{q.explanation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < content.quiz.length}
                      className="mt-8 w-full py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Submit Quiz ({Object.keys(quizAnswers).length}/{content.quiz.length} answered)
                    </button>
                  ) : (
                    <div className="mt-8 text-center p-6 rounded-xl bg-white border border-slate-200">
                      <div className={`text-4xl font-black mb-2 ${quizScore >= 3 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {quizScore}/{content.quiz.length}
                      </div>
                      <p className={`font-semibold mb-1 ${quizScore >= 3 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {quizScore >= 3 ? '🎉 Passed! You can now mark this as completed.' : '📚 Review the material and try again.'}
                      </p>
                      {quizScore < 3 && (
                        <button
                          onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }}
                          className="mt-3 text-sm text-indigo-600 hover:underline"
                        >
                          Reset & Retry Quiz
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Summary ── */}
                {content.summary && (
                  <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                    <h3 className="text-lg font-bold mb-2">✅ Key Takeaway</h3>
                    <p className="text-slate-300 leading-relaxed">{content.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky bottom bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg px-4 py-3 sm:left-64">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            {/* Prev */}
            {data.navigation.prev_id ? (
              <Link
                to={`/learn/${data.navigation.prev_id}`}
                className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                ← <span className="hidden sm:inline">Previous</span>
              </Link>
            ) : <div className="w-16" />}

            {/* Mark Complete */}
            <button
              onClick={markComplete}
              disabled={completed || !canMarkComplete}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                completed
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : canMarkComplete
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {completed ? '✓ Completed' : canMarkComplete ? 'Mark Complete ✓' : 'Complete Quiz First'}
            </button>

            {/* Next */}
            {data.navigation.next_id ? (
              <Link
                to={`/learn/${data.navigation.next_id}`}
                className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-medium text-sm transition-colors"
              >
                <span className="hidden sm:inline">Next</span> →
              </Link>
            ) : <div className="w-16 text-right text-xs text-slate-400">End</div>}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
