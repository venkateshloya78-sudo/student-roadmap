import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { speechService } from '../lib/speechService'

// ─── Types ────────────────────────────────────────────────────────────────────
type TopicItem = string | {
  title: string;
  notes?: string;
  why_learning?: string;
  meaning?: string;
  what_to_learn?: string;
  example?: string;
  how_to_practice?: string;
  what_to_build?: string;
  career_uses?: string;
  next_steps?: string;
}

function getItemTitle(item: TopicItem): string {
  return typeof item === 'string' ? item : item.title
}
function getItemNotes(item: TopicItem): string | null {
  return typeof item === 'object' && item.notes ? item.notes : null
}
function getItemPillars(item: TopicItem) {
  if (typeof item === 'object' && (item.why_learning || item.meaning || item.what_to_learn || item.how_to_practice)) {
    return item;
  }
  return null;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function getStudied(slug: string): Set<string> {
  try {
    const raw = localStorage.getItem(`srm_studied_${slug}`)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}
function setStudied(slug: string, set: Set<string>) {
  localStorage.setItem(`srm_studied_${slug}`, JSON.stringify([...set]))
}
function getMyNotes(slug: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(`srm_mynotes_${slug}`)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveMyNotesToStorage(slug: string, notes: Record<string, string>) {
  localStorage.setItem(`srm_mynotes_${slug}`, JSON.stringify(notes))
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function topicKey(weekIdx: number, itemIdx: number) {
  return `w${weekIdx}_i${itemIdx}`
}

// ─── Static Maps ─────────────────────────────────────────────────────────────
const difficultyColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
  expert: 'bg-purple-100 text-purple-700',
}
const typeIcon: Record<string, string> = {
  documentation: '📖', video: '🎬', course: '🎓',
  book: '📚', tutorial: '🛠️', other: '🔗',
}
const typeBadge: Record<string, string> = {
  documentation: 'bg-blue-50 text-blue-700 border-blue-100',
  video: 'bg-red-50 text-red-700 border-red-100',
  course: 'bg-purple-50 text-purple-700 border-purple-100',
  book: 'bg-amber-50 text-amber-700 border-amber-100',
  tutorial: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  other: 'bg-slate-50 text-slate-600 border-slate-100',
}
const weekColors = [
  'border-indigo-400',
  'border-violet-400',
  'border-blue-400',
  'border-cyan-400',
  'border-teal-400',
  'border-emerald-400',
  'border-amber-400',
  'border-rose-400',
]

// ─── TopicCard ────────────────────────────────────────────────────────────────
function TopicCard({
  item, index, weekIdx,
  studied, onToggleStudied,
  myNote, onSaveMyNote,
}: {
  item: TopicItem
  index: number
  weekIdx: number
  studied: boolean
  onToggleStudied: (key: string) => void
  myNote: string
  onSaveMyNote: (key: string, text: string) => void
}) {
  const [showNotes, setShowNotes] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showMyNoteEditor, setShowMyNoteEditor] = useState(false)
  const [draft, setDraft] = useState(myNote)
  const [copied, setCopied] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const title = getItemTitle(item)
  const notes = getItemNotes(item)
  const pillars = getItemPillars(item)
  const key = topicKey(weekIdx, index)

  useEffect(() => {
    return () => {
      if (isSpeaking) {
        speechService.stop()
      }
    }
  }, [isSpeaking])

  const handleSpeakTopic = () => {
    if (isSpeaking) {
      speechService.stop()
      setIsSpeaking(false)
      return
    }

    const parts: string[] = [`Topic: ${title}.`]
    if (notes) parts.push(`Notes: ${notes}.`)
    if (pillars) {
      if (pillars.meaning) parts.push(`Definition and meaning: ${pillars.meaning}.`)
      if (pillars.why_learning) parts.push(`Why learn this topic: ${pillars.why_learning}.`)
      if (pillars.what_to_learn) parts.push(`Key concepts to learn: ${pillars.what_to_learn}.`)
      if (pillars.example) parts.push(`Practical example: ${pillars.example}.`)
      if (pillars.how_to_practice) parts.push(`How to practice: ${pillars.how_to_practice}.`)
      if (pillars.what_to_build) parts.push(`Project to build: ${pillars.what_to_build}.`)
      if (pillars.career_uses) parts.push(`Career applications: ${pillars.career_uses}.`)
      if (pillars.next_steps) parts.push(`Next steps: ${pillars.next_steps}.`)
    }

    const fullText = parts.join(' ')
    setIsSpeaking(true)
    speechService.speak(fullText, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    })
  }

  const handleCopy = () => {
    if (notes) {
      navigator.clipboard.writeText(`${title}\n\n${notes}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSave = () => {
    onSaveMyNote(key, draft)
    setShowMyNoteEditor(false)
  }

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden
      ${studied ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-100 bg-white'}`}>

      {/* ── Top row ── */}
      <div className="flex items-start gap-2.5 p-3">
        {/* Studied checkbox */}
        <button
          onClick={() => onToggleStudied(key)}
          title={studied ? 'Mark as not studied' : 'Mark as studied'}
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
            ${studied
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 hover:border-emerald-400'}`}
        >
          {studied && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Number badge */}
        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
        </div>

        {/* Title */}
        <p className={`text-sm leading-snug flex-1 ${studied ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
          {title}
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {pillars && (
            <button
              onClick={() => setShowGuide(!showGuide)}
              title={showGuide ? 'Hide 7-Pillar Guide' : 'Show 7-Pillar Guide'}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-all border
                ${showGuide
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'}`}
            >
              💡 {showGuide ? 'Hide Guide' : '7-Pillar Guide'}
            </button>
          )}
          {/* Voice Assistant Loudspeaker */}
          <button
            onClick={handleSpeakTopic}
            title={isSpeaking ? 'Stop reading' : 'Voice Assistant: Read topic notes aloud'}
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-all border ${
              isSpeaking
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
            }`}
          >
            {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
          </button>
          {notes && (
            <>
              <button
                onClick={handleCopy}
                title="Copy notes"
                className="p-1 text-slate-300 hover:text-slate-600 transition-colors rounded"
              >
                {copied
                  ? <span className="text-xs text-emerald-600 font-medium">✓</span>
                  : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                }
              </button>
              <button
                onClick={() => setShowNotes(!showNotes)}
                title={showNotes ? 'Hide notes' : 'Show notes'}
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-all border
                  ${showNotes
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'}`}
              >
                📖 {showNotes ? 'Hide' : 'Read'}
              </button>
            </>
          )}
          <button
            onClick={() => { setShowMyNoteEditor(!showMyNoteEditor); setDraft(myNote) }}
            title={myNote ? 'Edit my note' : 'Add my note'}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full transition-all border
              ${myNote
                ? 'bg-violet-100 text-violet-700 border-violet-200'
                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200'}`}
          >
            ✏️ {myNote ? 'My note' : 'Add note'}
          </button>
        </div>
      </div>

      {/* ── 7-Pillar Educational Guide panel ── */}
      {pillars && showGuide && (
        <div className="mx-3 mb-3 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white overflow-hidden shadow-xs">
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-indigo-100 bg-white/70">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💡</span>
              <span className="text-xs font-bold text-indigo-900">7-Pillar Educational Mastery Guide</span>
            </div>
            <button
              onClick={() => {
                const text = `1. Why: ${pillars.why_learning}\n2. Meaning: ${pillars.meaning}\n3. What to learn: ${pillars.what_to_learn}\n4. Practice: ${pillars.how_to_practice}\n5. Build: ${pillars.what_to_build}\n6. Career: ${pillars.career_uses}\n7. Next: ${pillars.next_steps}`
                navigator.clipboard.writeText(text)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
            >
              {copied ? '✓ Copied' : 'Copy Guide'}
            </button>
          </div>

          <div className="p-3.5 space-y-3 text-xs text-slate-700">
            {/* 1. Why am I learning this? */}
            {pillars.why_learning && (
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
                <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                  <span>🎯</span> 1. Why am I learning this?
                </div>
                <p className="leading-relaxed">{pillars.why_learning}</p>
              </div>
            )}

            {/* 2. What does it mean? */}
            {pillars.meaning && (
              <div className="bg-white p-3 rounded-lg border border-sky-100 shadow-2xs">
                <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
                  <span>💡</span> 2. What does it mean?
                </div>
                <p className="leading-relaxed">{pillars.meaning}</p>
              </div>
            )}

            {/* 3. What should I learn? */}
            {pillars.what_to_learn && (
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
                <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                  <span>📘</span> 3. What should I learn?
                </div>
                <p className="leading-relaxed">{pillars.what_to_learn}</p>
              </div>
            )}

            {/* 4. How do I practice it? & Code */}
            {(pillars.how_to_practice || pillars.example) && (
              <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                  <span>✍️</span> 4. How do I practice it?
                </div>
                {pillars.how_to_practice && <p className="leading-relaxed mb-2">{pillars.how_to_practice}</p>}
                {pillars.example && (
                  <div className="bg-slate-900 text-emerald-300 p-2.5 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                    <code>{pillars.example}</code>
                  </div>
                )}
              </div>
            )}

            {/* 5. What can I build? */}
            {pillars.what_to_build && (
              <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
                <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span>🛠️</span> 5. What can I build?
                </div>
                <p className="leading-relaxed">{pillars.what_to_build}</p>
              </div>
            )}

            {/* 6. Which career uses it? */}
            {pillars.career_uses && (
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span>💼</span> 6. Which career uses it?
                </div>
                <p className="leading-relaxed font-medium text-slate-800">{pillars.career_uses}</p>
              </div>
            )}

            {/* 7. What should I learn next? */}
            {pillars.next_steps && (
              <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs">
                <div className="font-bold text-teal-900 mb-1 flex items-center gap-1.5">
                  <span>🚀</span> 7. What should I learn next?
                </div>
                <p className="leading-relaxed">{pillars.next_steps}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Curated Notes panel ── */}
      {notes && showNotes && (
        <div className="mx-3 mb-3 rounded-xl border border-amber-100 bg-amber-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-amber-100 bg-white/60">
            <span className="text-xs font-semibold text-amber-700">📖 Study Notes</span>
            <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-amber-700 transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed p-3 whitespace-pre-wrap">{notes}</p>
        </div>
      )}

      {/* ── My Note editor ── */}
      {showMyNoteEditor && (
        <div className="mx-3 mb-3 rounded-xl border border-violet-200 bg-violet-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-violet-100 bg-white/60">
            <span className="text-xs font-semibold text-violet-700">✏️ My Personal Note</span>
          </div>
          <div className="p-3">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Write your own summary, examples, or reminders here…"
              className="w-full text-xs text-slate-700 bg-white border border-violet-200 rounded-lg p-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-violet-300 min-h-[80px]"
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                onClick={() => setShowMyNoteEditor(false)}
                className="text-xs text-slate-400 hover:text-slate-600 px-3 py-1.5 rounded-lg"
              >Cancel</button>
              <button
                onClick={handleSave}
                className="text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors font-medium"
              >Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* ── My Note display (when editor closed) ── */}
      {myNote && !showMyNoteEditor && (
        <div
          onClick={() => { setShowMyNoteEditor(true); setDraft(myNote) }}
          className="mx-3 mb-3 px-3 py-2 rounded-lg border border-violet-100 bg-violet-50 cursor-pointer hover:bg-violet-100 transition-colors"
        >
          <p className="text-xs text-violet-700 leading-relaxed line-clamp-2">{myNote}</p>
          <span className="text-xs text-violet-400 mt-1 block">Click to edit</span>
        </div>
      )}
    </div>
  )
}

// ─── WeekCard ─────────────────────────────────────────────────────────────────
function WeekCard({
  week, idx, isOpen, onToggle, colorClass,
  slug, studied, onToggleStudied, myNotes, onSaveMyNote,
  searchQuery,
}: {
  week: any
  idx: number
  isOpen: boolean
  onToggle: () => void
  colorClass: string
  slug: string
  studied: Set<string>
  onToggleStudied: (key: string) => void
  myNotes: Record<string, string>
  onSaveMyNote: (key: string, text: string) => void
  searchQuery: string
}) {
  const items: TopicItem[] = week.items || []
  const hasNotes = items.some(it => getItemNotes(it))
  const studiedCount = items.filter((_, i) => studied.has(topicKey(idx, i))).length
  const pct = items.length > 0 ? Math.round((studiedCount / items.length) * 100) : 0

  // Filter items by search
  const filteredItems = searchQuery
    ? items.filter(it => getItemTitle(it).toLowerCase().includes(searchQuery.toLowerCase())
      || (getItemNotes(it) || '').toLowerCase().includes(searchQuery.toLowerCase()))
    : items

  if (searchQuery && filteredItems.length === 0) return null

  return (
    <div className={`card border-l-4 ${colorClass} overflow-hidden`}>
      {/* Week header button */}
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
            {pct === 100 ? '✓' : idx + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-900 truncate">Week {week.week || idx + 1}: {week.title}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-slate-400">{items.length} topics</span>
              {studiedCount > 0 && (
                <span className="text-xs text-emerald-600 font-medium">{studiedCount}/{items.length} studied</span>
              )}
              {hasNotes && (
                <span className="inline-flex items-center gap-0.5 text-xs text-amber-600 font-medium bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-full">
                  📖 has notes
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          {/* Mini progress ring */}
          {studiedCount > 0 && (
            <div className="hidden sm:flex items-center gap-1.5">
              <div className="w-16 bg-slate-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{pct}%</span>
            </div>
          )}
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Progress bar under header */}
      {studiedCount > 0 && (
        <div className="h-0.5 w-full bg-slate-100">
          <div
            className={`h-0.5 transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Items */}
      {isOpen && (
        <div className="px-5 pb-5 pt-3">
          {hasNotes && !searchQuery && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-base">📖</span>
              <p className="text-xs text-amber-700">
                Click <span className="font-semibold">📖 Read</span> on any topic to see study notes.
                Use <span className="font-semibold">✏️ Add note</span> to write your own.
                Check the circle ○ to mark a topic as studied.
              </p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-2">
            {(searchQuery ? filteredItems : items).map((item: TopicItem, i: number) => {
              const realIdx = searchQuery ? items.indexOf(item) : i
              return (
                <TopicCard
                  key={i}
                  item={item}
                  index={realIdx}
                  weekIdx={idx}
                  studied={studied.has(topicKey(idx, realIdx))}
                  onToggleStudied={onToggleStudied}
                  myNote={myNotes[topicKey(idx, realIdx)] || ''}
                  onSaveMyNote={onSaveMyNote}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SkillDoc() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources' | 'mynotes'>('curriculum')
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]))
  const [searchQuery, setSearchQuery] = useState('')
  const [studiedKeys, setStudiedKeys] = useState<Set<string>>(() => getStudied(slug || ''))
  const [myNotes, setMyNotes] = useState<Record<string, string>>(() => getMyNotes(slug || ''))

  // Queries
  const { data: topicData, isLoading: topicsLoading } = useQuery({
    queryKey: ['skill-topics', slug],
    queryFn: () => api.get(`/skills/${slug}/topics`).then(r => r.data),
    enabled: !!slug,
  })
  const { data: resourceData, isLoading: resLoading } = useQuery({
    queryKey: ['skill-resources', slug],
    queryFn: () => api.get(`/skills/${slug}/resources`).then(r => r.data),
    enabled: !!slug && activeTab === 'resources',
  })
  const { data: skillDetail } = useQuery({
    queryKey: ['skill-detail', slug],
    queryFn: () => api.get(`/skills/${slug}`).then(r => r.data),
    enabled: !!slug,
  })

  const toggleWeek = (idx: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }
  const expandAll = () => setExpandedWeeks(new Set(topicData?.curriculum?.map((_: any, i: number) => i) || []))
  const collapseAll = () => setExpandedWeeks(new Set())

  const handleToggleStudied = useCallback((key: string) => {
    setStudiedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      setStudied(slug || '', next)
      return next
    })
  }, [slug])

  const handleSaveMyNote = useCallback((key: string, text: string) => {
    setMyNotes(prev => {
      const next = { ...prev }
      if (text.trim()) next[key] = text.trim()
      else delete next[key]
      saveMyNotesToStorage(slug || '', next)
      return next
    })
  }, [slug])

  const skill = topicData?.skill
  const curriculum: any[] = topicData?.curriculum || []
  const resources = resourceData?.resources || []

  // Compute overall study progress
  const totalTopics = useMemo(() =>
    curriculum.reduce((s: number, w: any) => s + (w.items?.length || 0), 0), [curriculum])
  const studiedTotal = studiedKeys.size
  const studyPct = totalTopics > 0 ? Math.round((studiedTotal / totalTopics) * 100) : 0

  // My Notes collection
  const myNoteEntries = useMemo(() => {
    return Object.entries(myNotes).map(([key, text]) => {
      const [wi, ii] = key.replace('w', '').split('_i').map(Number)
      const week = curriculum[wi]
      const item = week?.items?.[ii]
      return { key, text, weekTitle: week?.title || `Week ${wi + 1}`, topicTitle: item ? getItemTitle(item) : 'Unknown topic' }
    })
  }, [myNotes, curriculum])

  // Group resources by type
  const resourceGroups = resources.reduce((acc: any, r: any) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})

  if (topicsLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/3 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-8" />
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-xl" />)}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-slate-600">← Back</button>
          <span>/</span>
          <Link to="/careers" className="hover:text-slate-600">Careers</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{skill?.name}</span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl font-bold flex-shrink-0">
              {skill?.name?.[0] || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{skill?.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {skill?.difficulty && (
                  <span className={`badge ${difficultyColor[skill.difficulty] || 'bg-slate-100 text-slate-600'}`}>
                    {skill.difficulty}
                  </span>
                )}
                {skillDetail?.category && (
                  <span className="badge bg-indigo-50 text-indigo-700">{skillDetail.category}</span>
                )}
                {topicData?.has_full_curriculum && (
                  <span className="badge bg-emerald-50 text-emerald-700">📋 Full curriculum</span>
                )}
                {totalTopics > 0 && studiedTotal > 0 && (
                  <span className="badge bg-emerald-50 text-emerald-700">
                    ✓ {studiedTotal}/{totalTopics} studied
                  </span>
                )}
                {Object.keys(myNotes).length > 0 && (
                  <span className="badge bg-violet-50 text-violet-700">
                    ✏️ {Object.keys(myNotes).length} personal notes
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall study progress */}
          {totalTopics > 0 && studiedTotal > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Study progress</span>
                <span className="font-semibold">{studyPct}% complete</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${studyPct === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                  style={{ width: `${studyPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {topicData?.description && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="text-slate-700 leading-relaxed">{topicData.description}</p>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {skillDetail?.prerequisites?.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ Learn these first (prerequisites)</p>
            <div className="flex flex-wrap gap-2">
              {skillDetail.prerequisites.map((p: any) => (
                <Link key={p.slug} to={`/skills/${p.slug}`}
                  className="badge bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer">
                  {p.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          {([
            { id: 'curriculum', label: `📋 Curriculum (${curriculum.length} weeks)` },
            { id: 'resources', label: `📚 Resources` },
            { id: 'mynotes', label: `✏️ My Notes${Object.keys(myNotes).length > 0 ? ` (${Object.keys(myNotes).length})` : ''}` },
          ] as const).map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CURRICULUM TAB ───────────────────────────────────────────── */}
        {activeTab === 'curriculum' && (
          <div>
            {curriculum.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">🚧</div>
                <h3 className="font-semibold text-slate-900 mb-2">Curriculum coming soon</h3>
                <p className="text-slate-500 text-sm mb-4">
                  We're building the full week-by-week curriculum for {skill?.name}.<br />
                  Switch to <strong>Resources</strong> to start learning now.
                </p>
                <button onClick={() => setActiveTab('resources')} className="btn-primary">
                  View Learning Resources →
                </button>
              </div>
            ) : (
              <>
                {/* Toolbar */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {/* Search */}
                  <div className="flex-1 min-w-[200px] relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search topics…"
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); if (e.target.value) expandAll() }}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">×</button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="hidden sm:inline">
                      {curriculum.reduce((t: number, w: any) => t + (w.items?.length || 0), 0)} topics
                      {searchQuery && ` · ${curriculum.reduce((t: number, w: any) =>
                        t + (w.items || []).filter((it: TopicItem) =>
                          getItemTitle(it).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (getItemNotes(it) || '').toLowerCase().includes(searchQuery.toLowerCase())
                        ).length, 0)} matches`}
                    </span>
                    <button onClick={expandAll} className="text-indigo-600 hover:underline">Expand all</button>
                    <span className="text-slate-300">·</span>
                    <button onClick={collapseAll} className="text-slate-400 hover:underline">Collapse</button>
                  </div>
                </div>

                {/* Study summary row */}
                {studiedTotal > 0 && (
                  <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm">
                    <span className="text-emerald-600 text-xl">🎯</span>
                    <div className="flex-1">
                      <p className="text-emerald-800 font-medium text-sm">
                        {studiedTotal} of {totalTopics} topics studied — keep going!
                      </p>
                    </div>
                    {studiedTotal === totalTopics && (
                      <span className="badge bg-emerald-500 text-white">🏆 Complete!</span>
                    )}
                  </div>
                )}

                {/* Week cards */}
                <div className="space-y-3">
                  {curriculum.map((week: any, idx: number) => (
                    <WeekCard
                      key={idx}
                      week={week}
                      idx={idx}
                      isOpen={expandedWeeks.has(idx)}
                      onToggle={() => toggleWeek(idx)}
                      colorClass={weekColors[idx % weekColors.length]}
                      slug={slug || ''}
                      studied={studiedKeys}
                      onToggleStudied={handleToggleStudied}
                      myNotes={myNotes}
                      onSaveMyNote={handleSaveMyNote}
                      searchQuery={searchQuery}
                    />
                  ))}
                </div>

                {/* CTA to resources */}
                <div className="mt-6 card p-5 bg-indigo-50 border-indigo-100 flex items-center gap-4">
                  <div className="text-3xl">🎓</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Ready to start learning?</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View free courses, Wikipedia articles, and PDFs for {skill?.name}.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('resources')} className="btn-primary text-sm whitespace-nowrap">
                    View Resources →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RESOURCES TAB ────────────────────────────────────────────── */}
        {activeTab === 'resources' && (
          <div>
            {resLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="h-3 bg-slate-100 rounded w-1/4 mb-3" />
                    <div className="h-10 bg-slate-50 rounded mb-2" />
                    <div className="h-10 bg-slate-50 rounded" />
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-slate-500">No resources found for this skill yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(resourceGroups).map(([type, items]: [string, any]) => (
                  <div key={type} className="card overflow-hidden">
                    <div className={`px-5 py-3 border-b border-slate-50 flex items-center gap-2 ${typeBadge[type] || typeBadge.other} border-0 rounded-none`}>
                      <span className="text-lg">{typeIcon[type] || '🔗'}</span>
                      <span className="text-sm font-semibold capitalize">{type}</span>
                      <span className="ml-auto text-xs opacity-70">{items.length} resource{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {items.map((r: any) => (
                        <div key={r.id} className="flex items-center group px-5 py-4 hover:bg-slate-50 transition-colors">
                          <Link to={`/learn/${r.id}`} className="flex-1 flex items-start gap-4 cursor-pointer min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                                {r.title}
                              </p>
                              <div className="flex items-center gap-2">
                                {r.is_free && (
                                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Free
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  {r.url.replace(/^https?:\/\//, '').split('/')[0]}
                                </span>
                              </div>
                            </div>
                          </Link>
                          <a href={r.url} target="_blank" rel="noopener noreferrer"
                            className="ml-4 p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50" title="Open in new tab">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-center text-xs text-slate-400 py-4">All resources above are free.</p>
              </div>
            )}
          </div>
        )}

        {/* ── MY NOTES TAB ─────────────────────────────────────────────── */}
        {activeTab === 'mynotes' && (
          <div>
            {myNoteEntries.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-5xl mb-4">✏️</div>
                <h3 className="font-semibold text-slate-900 mb-2">No personal notes yet</h3>
                <p className="text-slate-500 text-sm mb-5">
                  Go to the <strong>Curriculum</strong> tab and click <strong>✏️ Add note</strong> on any topic to write your own summary, examples, or reminders.
                </p>
                <button onClick={() => setActiveTab('curriculum')} className="btn-primary">
                  Go to Curriculum →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600 font-medium">{myNoteEntries.length} personal note{myNoteEntries.length > 1 ? 's' : ''}</p>
                  <button
                    onClick={() => {
                      const text = myNoteEntries.map(e => `## ${e.weekTitle} — ${e.topicTitle}\n\n${e.text}`).join('\n\n---\n\n')
                      navigator.clipboard.writeText(text)
                    }}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Copy all notes
                  </button>
                </div>

                {/* Group by week */}
                {curriculum.map((week: any, wi: number) => {
                  const weekNotes = myNoteEntries.filter(e => e.key.startsWith(`w${wi}_`))
                  if (weekNotes.length === 0) return null
                  return (
                    <div key={wi} className="card overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-50 bg-slate-50">
                        <p className="text-sm font-semibold text-slate-800">Week {week.week || wi + 1}: {week.title}</p>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {weekNotes.map(entry => (
                          <div key={entry.key} className="px-5 py-4">
                            <p className="text-xs font-semibold text-slate-500 mb-1.5">{entry.topicTitle}</p>
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
                            <button
                              onClick={() => {
                                setMyNotes(prev => {
                                  const next = { ...prev }
                                  delete next[entry.key]
                                  localStorage.setItem(`srm_mynotes_${slug}`, JSON.stringify(next))
                                  return next
                                })
                              }}
                              className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              Delete note
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </AppShell>
  )
}
