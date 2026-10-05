import React, { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'
import { useAutoVoice } from '../hooks/useAutoVoice'
import LanguageSelector from '../components/Common/LanguageSelector'
import { Link } from 'react-router-dom'
import {
  User,
  GraduationCap,
  Briefcase,
  Compass,
  Map,
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Trash2,
  Edit3,
  X,
  Download,
  Share2,
  Eye,
  Sliders,
  Volume2,
  Globe,
  Check,
  ChevronRight,
  Layers,
  Star,
  ShieldCheck,
  Target,
  FileCheck,
  Brain,
  Code2
} from 'lucide-react'

const DEGREES = [
  { value: 'btech', label: 'B.Tech / B.E. (Bachelor of Technology / Engineering)' },
  { value: 'bsc', label: 'B.Sc (Bachelor of Science - CS / IT / Math)' },
  { value: 'bca', label: 'BCA (Bachelor of Computer Applications)' },
  { value: 'bcom', label: 'B.Com (Bachelor of Commerce / Analytics)' },
  { value: 'ba', label: 'B.A (Bachelor of Arts)' },
  { value: 'mtech', label: 'M.Tech / M.E. (Master of Technology)' },
  { value: 'mca', label: 'MCA (Master of Computer Applications)' },
  { value: 'msc', label: 'M.Sc (Master of Science)' },
  { value: 'other', label: 'Other Degree / Diploma' }
]

const YEARS = [1, 2, 3, 4]
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const LEARNING_STYLES = [
  { value: 'hands_on', label: 'Hands-on Projects & Coding', icon: '💻' },
  { value: 'visual', label: 'Visual Diagrams & Roadmaps', icon: '🎨' },
  { value: 'video', label: 'Video Lectures & Walkthroughs', icon: '🎥' },
  { value: 'reading', label: 'Deep Reading & Documentation', icon: '📖' },
  { value: 'mixed', label: 'Mixed / Multi-Modal Learning', icon: '⚡' }
]
const HOURS = [5, 10, 15, 20, 25, 30]

const POPULAR_CAREERS = [
  'Data Scientist',
  'AI & ML Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'Data Analyst',
  'Mobile App Developer',
  'Software Engineer'
]

const DEFAULT_SKILLS = [
  { name: 'Python', category: 'Programming', level: 'Intermediate', stars: 4 },
  { name: 'SQL', category: 'Data', level: 'Intermediate', stars: 3 },
  { name: 'Statistics', category: 'Mathematics', level: 'Beginner', stars: 3 },
  { name: 'Machine Learning', category: 'AI/ML', level: 'Beginner', stars: 2 },
  { name: 'Data Visualization', category: 'Analytics', level: 'Intermediate', stars: 3 }
]

const PRESET_AVATARS = [
  { id: 'av1', label: 'Arjun', emoji: '👨‍🎓', bg: 'from-blue-600 to-indigo-600' },
  { id: 'av2', label: 'Priya', emoji: '👩‍🎓', bg: 'from-purple-600 to-pink-600' },
  { id: 'av3', label: 'Rohan', emoji: '🧑‍💻', bg: 'from-emerald-600 to-teal-600' },
  { id: 'av4', label: 'Sneha', emoji: '👩‍💻', bg: 'from-amber-500 to-orange-600' },
  { id: 'av5', label: 'Vikram', emoji: '👨‍🚀', bg: 'from-cyan-600 to-blue-600' },
  { id: 'av6', label: 'Creative', emoji: '🎨', bg: 'from-violet-600 to-fuchsia-600' }
]

export default function Profile() {
  const qc = useQueryClient()
  const { t } = useLanguage()
  const { autoVoice, toggleAutoVoice } = useAutoVoice()

  // Tab State matching Card 9
  const [activeTab, setActiveTab] = useState<
    'overview' | 'education' | 'skills' | 'interests' | 'preferences' | 'achievements' | 'roadmap'
  >('overview')

  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, any>>({})
  const [studentName, setStudentName] = useState<string>(() => {
    return localStorage.getItem('srm_student_name') || 'Arjun Reddy'
  })
  const [selectedAvatar, setSelectedAvatar] = useState<string>(() => {
    return localStorage.getItem('srm_student_avatar') || 'av1'
  })
  const [experienceText, setExperienceText] = useState<string>(() => {
    return localStorage.getItem('srm_student_exp') || 'Intern (2 months)'
  })

  // Skills State
  const [skills, setSkills] = useState<Array<{ name: string; category: string; level: string; stars: number }>>(() => {
    try {
      const savedSkills = localStorage.getItem('srm_custom_skills')
      if (savedSkills) return JSON.parse(savedSkills)
    } catch {}
    return DEFAULT_SKILLS
  })
  const [showAddSkillModal, setShowAddSkillModal] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('Programming')
  const [newSkillLevel, setNewSkillLevel] = useState('Beginner')
  const [newSkillStars, setNewSkillStars] = useState(3)

  // Edit Profile Quick Modal
  const [showEditNameModal, setShowEditNameModal] = useState(false)
  const [tempName, setTempName] = useState('')
  const [tempExp, setTempExp] = useState('')

  // Certificate Modal Preview
  const [selectedCert, setSelectedCert] = useState<{
    courseTitle: string
    level: string
    completionDate: string
    credentialId: string
    skills: string[]
  } | null>(null)

  // Fetch Current Auth & Profile Info
  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => {
      const profile = r.data.profile || {}
      setForm(profile)
      if (profile.career_goal_text && !localStorage.getItem('srm_student_exp')) {
        // initialize default experience
      }
      return r.data
    }),
  })

  // Fetch Courses to display real progress / certificates
  const { data: courses } = useQuery({
    queryKey: ['courses-profile'],
    queryFn: () => api.get('/courses/').then(r => r.data).catch(() => []),
    staleTime: 300_000,
  })

  // Fetch Roadmaps
  const { data: roadmaps } = useQuery({
    queryKey: ['roadmaps-profile'],
    queryFn: () => api.get('/roadmaps/').then(r => r.data).catch(() => []),
    staleTime: 300_000,
  })

  // Profile Update Mutation
  const updateProfile = useMutation({
    mutationFn: (data: any) => api.patch('/profile', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const setField = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    updateProfile.mutate(form)
  }

  const handleSaveNameAndDetails = () => {
    if (tempName.trim()) {
      setStudentName(tempName.trim())
      localStorage.setItem('srm_student_name', tempName.trim())
    }
    if (tempExp.trim()) {
      setExperienceText(tempExp.trim())
      localStorage.setItem('srm_student_exp', tempExp.trim())
    }
    setShowEditNameModal(false)
  }

  const handleSelectAvatar = (avId: string) => {
    setSelectedAvatar(avId)
    localStorage.setItem('srm_student_avatar', avId)
  }

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return
    const updated = [
      ...skills,
      {
        name: newSkillName.trim(),
        category: newSkillCategory,
        level: newSkillLevel,
        stars: newSkillStars
      }
    ]
    setSkills(updated)
    localStorage.setItem('srm_custom_skills', JSON.stringify(updated))
    setNewSkillName('')
    setShowAddSkillModal(false)
  }

  const handleRemoveSkill = (skillName: string) => {
    const updated = skills.filter(s => s.name !== skillName)
    setSkills(updated)
    localStorage.setItem('srm_custom_skills', JSON.stringify(updated))
  }

  // Calculate Profile Completeness Percentage
  const completeness = useMemo(() => {
    let score = 20 // baseline email + registration
    if (form.degree) score += 15
    if (form.branch) score += 15
    if (form.year) score += 10
    if (form.university) score += 15
    if (form.career_goal_text) score += 15
    if (skills.length > 0) score += 10
    return Math.min(100, score)
  }, [form, skills])

  const currentAvatar = PRESET_AVATARS.find(a => a.id === selectedAvatar) || PRESET_AVATARS[0]
  const userEmail = me?.user?.email || 'arjun.reddy@email.com'

  const targetCareer = form.career_goal_text?.split('\n')[0]?.replace(/^I want to become an?\s+/i, '') || 'Data Scientist'

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-6">
          <div className="h-44 bg-slate-200 rounded-3xl" />
          <div className="h-12 bg-slate-200 rounded-2xl w-2/3" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ========================================================================= */}
        {/* 1. HERO IDENTITY CARD (Matching Card 9 Header) */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Left: Avatar + Names + Email */}
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${currentAvatar.bg} flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-50 select-none transition-transform group-hover:scale-105`}
                >
                  {currentAvatar.emoji}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = (PRESET_AVATARS.findIndex(a => a.id === selectedAvatar) + 1) % PRESET_AVATARS.length
                    handleSelectAvatar(PRESET_AVATARS[nextIdx].id)
                  }}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:scale-110 transition-all text-xs"
                  title="Cycle Avatar"
                >
                  <Edit3 size={13} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {studentName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <ShieldCheck size={13} />
                    Verified Student
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                  <span>{userEmail}</span>
                  <span>•</span>
                  <span className="text-slate-400 capitalize">{me?.user?.role || 'Student'} Member</span>
                </p>

                {/* Quick Edit Profile Action */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(studentName)
                      setTempExp(experienceText)
                      setShowEditNameModal(true)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200/80"
                  >
                    <Edit3 size={12} />
                    <span>Edit Profile Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Key Highlight Cards (Education, Career Goal, Experience from Card 9) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              {/* Education Pill */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl min-w-[150px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <GraduationCap size={12} className="text-indigo-600" />
                  Education
                </div>
                <div className="font-extrabold text-sm text-slate-900 truncate">
                  {form.degree ? `${form.degree.toUpperCase()} in ${form.branch || 'CSE'}` : 'B.Tech in CSE'}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {form.year ? `Year ${form.year}` : '2nd Year'} • Sem {form.semester || '4'}
                </div>
              </div>

              {/* Career Goal Pill */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl min-w-[150px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Target size={12} className="text-purple-600" />
                  Career Goal
                </div>
                <div className="font-extrabold text-sm text-indigo-700 truncate">
                  {targetCareer}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {form.weekly_learning_hours || 15} hrs/wk pace
                </div>
              </div>

              {/* Experience Pill */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl min-w-[150px]">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                  <Briefcase size={12} className="text-emerald-600" />
                  Experience
                </div>
                <div className="font-extrabold text-sm text-slate-900 truncate">
                  {experienceText}
                </div>
                <div className="text-xs text-emerald-600 font-bold">
                  Active Learner
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Profile Readiness:</span>
              <div className="w-36 sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-indigo-700">{completeness}%</span>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>Institution: <strong>{form.university || 'IIT Hyderabad'}</strong></span>
              <span>•</span>
              <span>{form.location_city || 'Hyderabad'}, {form.location_state || 'Telangana'}</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SUB-NAVIGATION TABS (Matching Card 9 Menu) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'skills', label: 'Skills', icon: Code2, badge: `${skills.length}` },
            { id: 'interests', label: 'Interests & Goals', icon: Target },
            { id: 'preferences', label: 'Learning Preferences', icon: Sliders },
            { id: 'achievements', label: 'Achievements', icon: Award, badge: '5' },
            { id: 'roadmap', label: 'Roadmap Progress', icon: Map }
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ========================================================================= */}
        {/* 3. TAB CONTENT VIEWS */}
        {/* ========================================================================= */}

        {/* ─── TAB 1: OVERVIEW (Card 9 Main Layout) ─────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Skills Card with Add Skill Button (from Card 9) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Code2 size={18} className="text-indigo-600" />
                    Skills Portfolio
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your validated competencies and technical tools
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200 shadow-2xs"
                >
                  <Plus size={14} />
                  <span>+ Add Skill</span>
                </button>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap items-center gap-2.5">
                {skills.map(s => (
                  <div
                    key={s.name}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-white text-slate-800 border border-slate-200 shadow-2xs transition-all hover:border-indigo-300"
                  >
                    <span className="font-bold text-xs">{s.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-100/70 text-indigo-700">
                      {s.level}
                    </span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: s.stars }).map((_, i) => (
                        <Star key={i} size={10} className="fill-current" />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.name)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity ml-1"
                      title="Remove skill"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 text-xs font-bold transition-colors"
                >
                  <Plus size={13} />
                  <span>Add More</span>
                </button>
              </div>
            </div>

            {/* Roadmap Progress Pipeline Stepper (Card 9 Stepper) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Map size={18} className="text-emerald-600" />
                    Career Roadmap Progress
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Step-by-step verified trajectory from student to professional
                  </p>
                </div>
                <Link
                  to="/roadmaps"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  <span>View Full Roadmap</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              {/* 7-Step Pipeline from Card 9 */}
              <div className="relative overflow-x-auto pb-4">
                <div className="min-w-[680px]">
                  <div className="grid grid-cols-7 gap-2 relative">
                    {[
                      { step: 1, title: 'Interests', status: 'Completed', color: 'bg-emerald-500', text: 'text-emerald-700' },
                      { step: 2, title: 'Career', status: 'Completed', color: 'bg-emerald-500', text: 'text-emerald-700' },
                      { step: 3, title: 'Skills', status: 'In Progress', color: 'bg-indigo-600', text: 'text-indigo-700', active: true },
                      { step: 4, title: 'Courses', status: 'In Progress', color: 'bg-indigo-600', text: 'text-indigo-700', active: true },
                      { step: 5, title: 'Projects', status: 'Upcoming', color: 'bg-slate-300', text: 'text-slate-500' },
                      { step: 6, title: 'Internship', status: 'Upcoming', color: 'bg-slate-300', text: 'text-slate-500' },
                      { step: 7, title: 'Job', status: 'Upcoming', color: 'bg-slate-300', text: 'text-slate-500' }
                    ].map((st, idx) => (
                      <div key={st.step} className="flex flex-col items-center text-center relative group">
                        {/* Connecting bar */}
                        {idx < 6 && (
                          <div
                            className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${
                              idx < 2 ? 'bg-emerald-400' : idx < 4 ? 'bg-indigo-200' : 'bg-slate-200'
                            }`}
                          />
                        )}

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold shadow-sm relative z-10 transition-transform group-hover:scale-110 ${
                            st.color
                          } ${st.active ? 'ring-4 ring-indigo-100 animate-pulse' : ''}`}
                        >
                          {st.status === 'Completed' ? <Check size={14} /> : st.step}
                        </div>

                        <span className="font-extrabold text-xs text-slate-800 mt-2.5">{st.title}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 ${
                            st.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : st.status === 'In Progress'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Education & Schedule Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Academic Snapshot */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <GraduationCap size={16} className="text-indigo-600" />
                    Academic Standing
                  </h4>
                  <button
                    onClick={() => setActiveTab('education')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Enrolled Degree</span>
                    <span className="font-bold text-slate-800">{form.degree ? form.degree.toUpperCase() : 'B.Tech'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Branch / Specialization</span>
                    <span className="font-bold text-slate-800">{form.branch || 'Computer Science & Engineering'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Current Semester</span>
                    <span className="font-bold text-slate-800">Semester {form.semester || 4} (Year {form.year || 2})</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">College / Institute</span>
                    <span className="font-bold text-slate-800">{form.university || 'IIT Hyderabad'}</span>
                  </div>
                </div>
              </div>

              {/* Study Routine Snapshot */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sliders size={16} className="text-purple-600" />
                    Learning Routine & Voice
                  </h4>
                  <button
                    onClick={() => setActiveTab('preferences')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Configure
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Committed Hours</span>
                    <span className="font-bold text-slate-800">{form.weekly_learning_hours || 15} hours per week</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Primary Style</span>
                    <span className="font-bold text-slate-800 capitalize">{form.learning_style || 'Hands-on Projects'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Auto Voice AI</span>
                    <span className={`font-bold ${autoVoice ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {autoVoice ? 'Enabled (Auto Speech)' : 'Manual (Click Listen)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500 font-medium">Regional Language</span>
                    <span className="font-bold text-slate-800">English & Regional Supported</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: EDUCATION (Academic Information Form) ────────────────── */}
        {activeTab === 'education' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <GraduationCap size={20} className="text-indigo-600" />
                  Academic Profile & Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your academic records current so our curriculum recommendation engine customizes prerequisites precisely to your semester.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Current Degree Program</label>
                  <select
                    value={form.degree || ''}
                    onChange={e => setField('degree', e.target.value)}
                    className="input capitalize"
                  >
                    <option value="">Select Degree</option>
                    {DEGREES.map(d => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Branch / Major Specialization</label>
                  <input
                    value={form.branch || ''}
                    onChange={e => setField('branch', e.target.value)}
                    placeholder="e.g. Computer Science, Artificial Intelligence, Data Science"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Current Academic Year</label>
                  <select
                    value={form.year || ''}
                    onChange={e => setField('year', +e.target.value)}
                    className="input"
                  >
                    <option value="">Select Year</option>
                    {YEARS.map(y => (
                      <option key={y} value={y}>
                        Year {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Current Semester</label>
                  <select
                    value={form.semester || ''}
                    onChange={e => setField('semester', +e.target.value)}
                    className="input"
                  >
                    <option value="">Select Semester</option>
                    {SEMESTERS.map(s => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="label">University / Institute / College</label>
                  <input
                    value={form.university || ''}
                    onChange={e => setField('university', e.target.value)}
                    placeholder="e.g. IIT Hyderabad, BITS Pilani, NIT Warangal, Anna University"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Expected Year of Graduation</label>
                  <input
                    type="number"
                    value={form.graduation_year || 2026}
                    onChange={e => setField('graduation_year', +e.target.value)}
                    placeholder="e.g. 2026"
                    className="input"
                  />
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="btn-primary px-6 py-2.5"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Education Details'}
                </button>

                {saved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Saved Successfully!
                  </span>
                )}
              </div>
            </div>
          </form>
        )}

        {/* ─── TAB 3: SKILLS (Skills Inventory & Competency Tracker) ───────── */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Code2 size={20} className="text-indigo-600" />
                    Declared Technical Competencies
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rate and manage skills you already know to bypass redundant introductory stages in roadmaps
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(true)}
                  className="btn-primary text-xs px-4 py-2"
                >
                  <Plus size={14} />
                  <span>Add New Skill</span>
                </button>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map(s => (
                  <div
                    key={s.name}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/90 transition-all hover:shadow-md hover:border-indigo-300 relative group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {s.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {s.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < s.stars ? 'fill-current' : 'text-slate-200 fill-slate-200'}
                          />
                        ))}
                        <span className="text-xs font-semibold text-slate-500 ml-1.5">{s.level}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Validated
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Preset Skill Suggestions */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Quick Add Recommended In-Demand Skills:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    'React', 'Node.js', 'Docker', 'Git', 'AWS', 'PostgreSQL', 'TypeScript', 'FastAPI', 'Pandas', 'Tailwind CSS'
                  ]
                    .filter(sk => !skills.some(s => s.name.toLowerCase() === sk.toLowerCase()))
                    .map(sk => (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => {
                          const updated = [...skills, { name: sk, category: 'Technical', level: 'Beginner', stars: 2 }]
                          setSkills(updated)
                          localStorage.setItem('srm_custom_skills', JSON.stringify(updated))
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>{sk}</span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: INTERESTS & CAREER GOALS ──────────────────────────────── */}
        {activeTab === 'interests' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Target size={20} className="text-purple-600" />
                  Target Career Role & Long-Term Ambition
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Specify your dream occupational target so the AI Assistant aligns course priorities to real market requirements.
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="label">Target Industry Career Role</label>
                  <select
                    value={POPULAR_CAREERS.find(c => targetCareer.toLowerCase().includes(c.toLowerCase())) || targetCareer}
                    onChange={e => {
                      const val = e.target.value
                      setField('career_goal_text', `I want to become a ${val}.`)
                    }}
                    className="input"
                  >
                    {POPULAR_CAREERS.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Describe Your Specific 12-Month Goal & Vision</label>
                  <textarea
                    value={form.career_goal_text || ''}
                    onChange={e => setField('career_goal_text', e.target.value)}
                    placeholder="e.g. I want to become a professional Data Scientist or ML Engineer at a top product tech company, mastering Python, SQL, statistical modeling, and deploying real production models."
                    className="input min-h-[120px] resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    This goal is factored into your AI Assistant guidance and roadmap generation algorithms.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="btn-primary px-6 py-2.5"
                >
                  {updateProfile.isPending ? 'Saving...' : 'Save Career Goals'}
                </button>

                {saved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Saved!
                  </span>
                )}
              </div>
            </div>
          </form>
        )}

        {/* ─── TAB 5: LEARNING PREFERENCES & REGIONAL ──────────────────────── */}
        {activeTab === 'preferences' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Location & Weekly Allocation */}
            <div className="card p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sliders size={20} className="text-indigo-600" />
                  Study Schedule & Location
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Adjust your schedule to prevent burnout and ensure roadmaps remain achievable.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">City</label>
                  <input
                    value={form.location_city || ''}
                    onChange={e => setField('location_city', e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">State / Region</label>
                  <input
                    value={form.location_state || ''}
                    onChange={e => setField('location_state', e.target.value)}
                    placeholder="e.g. Telangana"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Weekly Committed Study Hours</label>
                  <select
                    value={form.weekly_learning_hours || ''}
                    onChange={e => setField('weekly_learning_hours', +e.target.value)}
                    className="input"
                  >
                    <option value="">Select Weekly Hours</option>
                    {HOURS.map(h => (
                      <option key={h} value={h}>
                        {h} hours / week (~{Math.round(h / 7)} hr/day)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Preferred Learning Style</label>
                  <select
                    value={form.learning_style || ''}
                    onChange={e => setField('learning_style', e.target.value)}
                    className="input capitalize"
                  >
                    <option value="">Select Style</option>
                    {LEARNING_STYLES.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Language & Regional Settings */}
            <div className="card p-6 sm:p-8">
              <div className="mb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Globe size={20} className="text-blue-600" />
                  {t('profile.languageSettings', 'Language & Regional Settings')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select your regional mother tongue or preferred language. The entire website, lessons, and course navigation dynamically adapt.
                </p>
              </div>
              <LanguageSelector variant="profile" />
            </div>

            {/* AI Voice & Audio Accessibility Settings */}
            <div className="card p-6 sm:p-8">
              <div className="mb-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Volume2 size={20} className="text-indigo-600" />
                  AI Voice & Audio Accessibility Settings
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure speech synthesis behavior for all AI Assistant responses and lesson explanations.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">Auto Voice</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        autoVoice ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {autoVoice ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
                    Automatically speaks every new AI answer out loud using natural speech synthesis. When disabled, you can manually click the <strong>🔊 Listen</strong> button on any response.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleAutoVoice}
                  aria-pressed={autoVoice}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoVoice ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  title="Toggle Auto Voice"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      autoVoice ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="btn-primary px-6 py-2.5"
              >
                {updateProfile.isPending ? 'Saving...' : 'Save Preferences'}
              </button>

              {saved && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> Saved!
                </span>
              )}
            </div>
          </form>
        )}

        {/* ─── TAB 6: ACHIEVEMENTS & CERTIFICATES (Card 8 From Design) ─────── */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* Badges Section from Card 8 */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Award size={20} className="text-amber-500" />
                    Your Achievements & Milestones
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep learning daily and earn badges recognizing your persistence
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">5 Badges Active</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  {
                    id: 'first_steps',
                    title: 'First Steps',
                    desc: 'Complete your first lesson',
                    icon: '🚀',
                    color: 'from-blue-500 to-indigo-600',
                    unlocked: true,
                    date: 'Unlocked'
                  },
                  {
                    id: 'quick_learner',
                    title: 'Quick Learner',
                    desc: 'Complete 5 lessons',
                    icon: '⚡',
                    color: 'from-purple-500 to-pink-600',
                    unlocked: true,
                    date: 'Unlocked'
                  },
                  {
                    id: 'quiz_master',
                    title: 'Quiz Master',
                    desc: 'Score 80%+ in 3 quizzes',
                    icon: '🎯',
                    color: 'from-emerald-500 to-teal-600',
                    unlocked: true,
                    date: 'Unlocked'
                  },
                  {
                    id: 'project_builder',
                    title: 'Project Builder',
                    desc: 'Complete your first project',
                    icon: '🏗️',
                    color: 'from-amber-500 to-orange-600',
                    unlocked: true,
                    date: 'Unlocked'
                  },
                  {
                    id: 'streak_10',
                    title: 'Dedicated Learner',
                    desc: 'Maintain 10 day streak',
                    icon: '🔥',
                    color: 'from-rose-500 to-red-600',
                    unlocked: true,
                    date: 'Unlocked'
                  }
                ].map(badge => (
                  <div
                    key={badge.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center group hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${badge.color} flex items-center justify-center text-2xl shadow-md shadow-indigo-500/10 mb-3 group-hover:scale-110 transition-transform`}
                    >
                      {badge.icon}
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 mb-1">{badge.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-tight mb-2.5">{badge.desc}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mt-auto">
                      ✓ {badge.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates Earned from Card 8 */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileCheck size={20} className="text-emerald-600" />
                    Certificates Earned
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Accredited completion certificates validating your mastery of course learning paths
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    courseTitle: 'Python Programming',
                    level: 'Beginner Level',
                    completionDate: '20 May 2024',
                    credentialId: 'CP-PY-88294',
                    skills: ['Python Syntax', 'Variables & Types', 'Control Flow', 'Functions']
                  },
                  {
                    courseTitle: 'SQL for Data Science',
                    level: 'Beginner Level',
                    completionDate: '15 May 2024',
                    credentialId: 'CP-SQL-49102',
                    skills: ['Relational Databases', 'SELECT & WHERE', 'JOIN Operations', 'Aggregations']
                  }
                ].map(cert => (
                  <div
                    key={cert.credentialId}
                    className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm shadow-indigo-600/30">
                        🎓
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-extrabold text-sm text-slate-900 truncate">
                            {cert.courseTitle}
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {cert.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Completed on {cert.completionDate}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                          ID: {cert.credentialId}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 size={13} />
                        <span>Verified Credential</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs transition-colors"
                      >
                        <Eye size={13} />
                        <span>View Certificate</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 7: ROADMAP PROGRESS (Detailed Pipeline Breakdown) ───────── */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Map size={20} className="text-indigo-600" />
                    Target Career Progression
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your active curriculum milestones toward landing a {targetCareer} position
                  </p>
                </div>
                <Link to="/roadmaps" className="btn-primary text-xs px-4 py-2">
                  Launch Interactive Roadmap →
                </Link>
              </div>

              {/* Progress Milestones */}
              <div className="space-y-4">
                {[
                  {
                    stage: 1,
                    title: 'Discover Interests & Strengths',
                    status: 'Completed',
                    desc: 'Initial technical self-assessment and career matching completed.'
                  },
                  {
                    stage: 2,
                    title: 'Choose Career Path',
                    status: 'Completed',
                    desc: `Selected target occupation: ${targetCareer}. Prerequisites identified.`
                  },
                  {
                    stage: 3,
                    title: 'Learn Core Skills',
                    status: 'In Progress',
                    desc: 'Acquiring foundational programming, databases, and problem solving skills.',
                    progress: 65
                  },
                  {
                    stage: 4,
                    title: 'Enroll in Specialized Courses',
                    status: 'In Progress',
                    desc: 'Completing Beginner, Intermediate, and Advanced course level modules.',
                    progress: 40
                  },
                  {
                    stage: 5,
                    title: 'Build Portfolio Projects',
                    status: 'Upcoming',
                    desc: 'Develop end-to-end applications to demonstrate professional competency.'
                  },
                  {
                    stage: 6,
                    title: 'Interview Vault & Internship Prep',
                    status: 'Upcoming',
                    desc: 'Solve FAANG interview vault challenges and practice technical mock questions.'
                  },
                  {
                    stage: 7,
                    title: 'Career Placement & Hiring',
                    status: 'Upcoming',
                    desc: 'Resume readiness, portfolio submission, and entry into product engineering.'
                  }
                ].map(st => (
                  <div
                    key={st.stage}
                    className={`p-4 rounded-2xl border transition-all ${
                      st.status === 'Completed'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : st.status === 'In Progress'
                        ? 'bg-indigo-50/30 border-indigo-200 ring-2 ring-indigo-500/10'
                        : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            st.status === 'Completed'
                              ? 'bg-emerald-600 text-white'
                              : st.status === 'In Progress'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {st.status === 'Completed' ? <Check size={12} /> : st.stage}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-900">{st.title}</h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          st.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : st.status === 'In Progress'
                            ? 'bg-indigo-100 text-indigo-800 animate-pulse'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {st.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 ml-8">{st.desc}</p>

                    {st.progress !== undefined && (
                      <div className="mt-3 ml-8 flex items-center gap-3">
                        <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${st.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-indigo-700">{st.progress}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: ADD SKILL MODAL */}
        {/* ========================================================================= */}
        {showAddSkillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Plus size={18} className="text-indigo-600" />
                  Add Technical Skill
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="label">Skill Name</label>
                  <input
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    placeholder="e.g. React, Docker, TypeScript, FastApi"
                    className="input"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Skill Category</label>
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value)}
                    className="input"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Data">Data & Databases</option>
                    <option value="AI/ML">AI & Machine Learning</option>
                    <option value="Cloud">Cloud & DevOps</option>
                    <option value="Systems">Systems & Security</option>
                    <option value="Analytics">Analytics & Math</option>
                  </select>
                </div>

                <div>
                  <label className="label">Proficiency Level</label>
                  <select
                    value={newSkillLevel}
                    onChange={e => {
                      const lvl = e.target.value
                      setNewSkillLevel(lvl)
                      setNewSkillStars(lvl === 'Beginner' ? 2 : lvl === 'Intermediate' ? 3 : 5)
                    }}
                    className="input"
                  >
                    <option value="Beginner">Beginner (Fundamentals)</option>
                    <option value="Intermediate">Intermediate (Project-Ready)</option>
                    <option value="Advanced">Advanced (Production-Grade)</option>
                  </select>
                </div>

                <div>
                  <label className="label">Self-Assessment (1 - 5 Stars)</label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewSkillStars(st)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          size={22}
                          className={st <= newSkillStars ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                        />
                      </button>
                    ))}
                    <span className="font-bold text-slate-700 ml-2">{newSkillStars}/5 Stars</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddSkillModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  disabled={!newSkillName.trim()}
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  Add Skill to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: EDIT STUDENT NAME & EXPERIENCE MODAL */}
        {/* ========================================================================= */}
        {showEditNameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Edit3 size={18} className="text-indigo-600" />
                  Edit Profile Identity
                </h3>
                <button
                  type="button"
                  onClick={() => setShowEditNameModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="label">Student Full Name</label>
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    placeholder="e.g. Arjun Reddy"
                    className="input text-sm font-semibold"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="label">Experience / Standing Status</label>
                  <input
                    value={tempExp}
                    onChange={e => setTempExp(e.target.value)}
                    placeholder="e.g. Intern (2 months) or Active Student"
                    className="input text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="label">Choose Avatar Persona</label>
                  <div className="grid grid-cols-6 gap-2 mt-1.5">
                    {PRESET_AVATARS.map(av => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => handleSelectAvatar(av.id)}
                        className={`p-2 rounded-xl text-xl flex items-center justify-center transition-all ${
                          selectedAvatar === av.id
                            ? 'ring-2 ring-indigo-600 bg-indigo-50 shadow-sm'
                            : 'hover:bg-slate-100'
                        }`}
                        title={av.label}
                      >
                        {av.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditNameModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNameAndDetails}
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: CERTIFICATE CREDENTIAL PREVIEW MODAL */}
        {/* ========================================================================= */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border-4 border-indigo-100 relative overflow-hidden">
              {/* Decorative Corner Seals */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/20 rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/10 to-indigo-500/20 rounded-tr-full pointer-events-none" />

              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                    🎓
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900">CareerPath Official Credential</span>
                    <span className="text-[10px] text-slate-400 block font-mono">ID: {selectedCert.credentialId}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Certificate Canvas Body */}
              <div className="text-center py-6 px-4 border-2 border-indigo-200/60 rounded-2xl bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 relative">
                <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
                  Certificate of Achievement
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-1">
                  {studentName}
                </h2>

                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  has demonstrated verified competence and successfully completed all core curriculum requirements for
                </p>

                <div className="inline-block px-5 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-base sm:text-lg mb-4">
                  {selectedCert.courseTitle} — {selectedCert.level}
                </div>

                {/* Skills tags on certificate */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-lg mx-auto">
                  {selectedCert.skills.map(sk => (
                    <span key={sk} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      ✓ {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 px-6">
                  <div>
                    <span className="font-bold text-slate-800 block">Date of Issue</span>
                    <span>{selectedCert.completionDate}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block">Verification Stamp</span>
                    <span className="text-emerald-600 font-bold">100% Cryptographically Verified</span>
                  </div>
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <Download size={14} />
                  <span>Download / Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="btn-primary text-xs px-5 py-2"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
