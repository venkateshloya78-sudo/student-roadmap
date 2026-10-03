import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Send,
  Square,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  Trash2,
  Bot,
  User as UserIcon,
  Code,
  Compass,
  Briefcase,
  HelpCircle,
  ChevronDown,
  Key,
  Settings,
  BookOpen,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon,
  X,
  Radio,
  Eye,
  Pause,
  Play,
  Volume1
} from 'lucide-react'
import AppShell from '../components/Layout/AppShell'
import { ChatMarkdown } from '../components/Assistant/ChatMarkdown'
import { speechService } from '../lib/speechService'
import api from '../lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  imageUrl?: string
}

interface Persona {
  id: string
  name: string
  description: string
  badge: string
  suggested_model: string
}

interface PromptSuggestion {
  id: string
  title: string
  prompt: string
  category: string
  icon: string
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [personas, setPersonas] = useState<Persona[]>([])
  const [activePersona, setActivePersona] = useState<string>('mentor')
  const [prompts, setPrompts] = useState<PromptSuggestion[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [studentContext, setStudentContext] = useState<any>(null)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('custom_ai_key') || '')
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => localStorage.getItem('custom_ai_key') || '')

  // ─── Voice Assistant & Loudspeaker States ────────────────────────────────
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [isSpeakingPaused, setIsSpeakingPaused] = useState(false)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [currentSentenceProgress, setCurrentSentenceProgress] = useState<{
    current: number
    total: number
    text: string
  } | null>(null)
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(
    () => localStorage.getItem('srm_autospeak') === 'true'
  )

  // ─── Multimedia States (Mic, Camera & Images) ────────────────────────────
  const [isListening, setIsListening] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [attachedImage, setAttachedImage] = useState<string | null>(null)
  const [attachedImageName, setAttachedImageName] = useState<string | null>(null)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  // Load initial personas, prompts, and profile info
  useEffect(() => {
    api.get('/assistant/personas').then(r => setPersonas(r.data)).catch(() => {})
    api.get('/assistant/prompts').then(r => setPrompts(r.data)).catch(() => {})
    api.get('/profile').then(r => setStudentContext(r.data)).catch(() => {})

    // Load chat history from session storage if exists
    const saved = sessionStorage.getItem('sr_assistant_chat')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch {}
    }
  }, [])

  // Save to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('sr_assistant_chat', JSON.stringify(messages))
    }
  }, [messages])

  // Clean up audio & camera on unmount
  useEffect(() => {
    return () => {
      speechService.stop()
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop() } catch {}
      }
    }
  }, [cameraStream])

  // Auto resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }

  // ─── Robust Voice Assistant Loudspeaker Functions ─────────────────────────
  const handleToggleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      handleStopSpeaking()
      return
    }

    setSpeakingId(id)
    setIsSpeakingPaused(false)

    speechService.speak(text, {
      rate: speechRate,
      onStart: () => {
        setIsSpeakingPaused(false)
      },
      onSentenceChange: (current, total, sentenceText) => {
        setCurrentSentenceProgress({ current, total, text: sentenceText })
      },
      onEnd: () => {
        setSpeakingId(null)
        setCurrentSentenceProgress(null)
        setIsSpeakingPaused(false)
      },
      onError: () => {
        setSpeakingId(null)
        setCurrentSentenceProgress(null)
        setIsSpeakingPaused(false)
      }
    })
  }

  const handleStopSpeaking = () => {
    speechService.stop()
    setSpeakingId(null)
    setCurrentSentenceProgress(null)
    setIsSpeakingPaused(false)
  }

  const togglePauseResumeSpeech = () => {
    if (isSpeakingPaused) {
      speechService.resume()
      setIsSpeakingPaused(false)
    } else {
      speechService.pause()
      setIsSpeakingPaused(true)
    }
  }

  const cycleSpeechRate = () => {
    const rates = [0.85, 1.0, 1.25]
    const nextIdx = (rates.indexOf(speechRate) + 1) % rates.length
    const nextRate = rates[nextIdx]
    setSpeechRate(nextRate)

    // If currently speaking, restart current message with new rate
    if (speakingId) {
      const currentMsg = messages.find(m => m.id === speakingId)
      if (currentMsg) {
        handleToggleSpeak(speakingId, currentMsg.content)
      }
    }
  }

  const toggleAutoSpeak = () => {
    const next = !autoSpeakEnabled
    setAutoSpeakEnabled(next)
    localStorage.setItem('srm_autospeak', String(next))
  }

  // ─── Speech Recognition (Mic) ─────────────────────────────────────────────
  const toggleListening = () => {
    if (isListening) {
      stopListening()
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
      setTimeout(() => setSpeechError(null), 4000)
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript
        }
        if (transcript) {
          setInput(prev => (prev ? `${prev.trim()} ${transcript}` : transcript))
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
          }
        }
      }

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error)
        setIsListening(false)
        if (event.error !== 'no-speech') {
          setSpeechError(`Microphone notice: ${event.error}. Please grant permission.`)
          setTimeout(() => setSpeechError(null), 4000)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (err: any) {
      console.error("Speech recognition initialization error:", err)
      setIsListening(false)
      setSpeechError("Microphone initialization failed. Please check device permissions.")
      setTimeout(() => setSpeechError(null), 4000)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
      setIsListening(false)
    }
  }

  // ─── Camera Capture ───────────────────────────────────────────────────────
  const openCamera = async () => {
    setShowCameraModal(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Unable to access camera. Please allow camera permissions in your browser.")
      setShowCameraModal(false)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setShowCameraModal(false)
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataUri = canvas.toDataURL('image/jpeg', 0.85)
        setAttachedImage(dataUri)
        setAttachedImageName('Live Camera Photo')
      }
      stopCamera()
    }
  }

  // ─── Image File Upload ────────────────────────────────────────────────────
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setAttachedImage(reader.result as string)
      setAttachedImageName(file.name)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ─── Handle Send Message ──────────────────────────────────────────────────
  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt ?? input.trim()
    if ((!textToSend && !attachedImage) || isStreaming) return

    // Stop listening if currently dictating
    if (isListening) stopListening()

    const promptText = textToSend || "Please analyze and explain this attached image/photo."

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: attachedImage || undefined,
    }

    const assistantMsgId = `msg-${Date.now()}-assistant`
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages([...updatedMessages, initialAssistantMsg])
    setInput('')
    const currentAttachedImage = attachedImage
    setAttachedImage(null)
    setAttachedImageName(null)
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setIsStreaming(true)

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('http://localhost:8001/api/v1/assistant/chat/stream', {
        method: 'POST',
        headers,
        signal: abortController.signal,
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
            image_url: m.imageUrl || undefined,
          })),
          persona: activePersona,
          model: 'gemini-2.0-flash',
          include_student_context: true,
          api_key: customApiKey || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      if (reader) {
        let buffer = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim()
              try {
                const parsed = JSON.parse(dataStr)
                if (parsed.delta) {
                  accumulated += parsed.delta
                  setMessages(prev =>
                    prev.map(m => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
                  )
                }
              } catch {
                // Ignore heartbeats
              }
            }
          }
        }

        // Auto-read finished answer if enabled
        if (autoSpeakEnabled && accumulated.trim()) {
          setTimeout(() => {
            handleToggleSpeak(assistantMsgId, accumulated)
          }, 300)
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMsgId
              ? { ...m, content: '⚠️ Sorry, an error occurred while streaming the response. Please try again.' }
              : m
          )
        )
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsStreaming(false)
    }
  }

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation messages?')) {
      handleStopSpeaking()
      setMessages([])
      sessionStorage.removeItem('sr_assistant_chat')
    }
  }

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExport = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.timestamp}\n${m.content}\n`).join('\n---\n\n')
    const blob = new Blob([text], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chatgpt-gemini-transcript-${new Date().toISOString().slice(0, 10)}.md`
    a.click()
  }

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-slate-50">
        {/* Top Header bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  StudentRoadmap AI Voice Assistant
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini 2.0 & ChatGPT-4o
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Voice Assistant reads full explanations aloud • Speak with mic • Camera vision enabled
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Auto-Speak Toggle */}
            <button
              onClick={toggleAutoSpeak}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                autoSpeakEnabled
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              title="Automatically read answers aloud as soon as they arrive"
            >
              <Volume2 size={14} className={autoSpeakEnabled ? 'text-emerald-600' : 'text-slate-400'} />
              <span>Auto-Read: {autoSpeakEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setShowApiKeyModal(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-2xs"
              title="API Key Configuration"
            >
              <Key className="w-4 h-4" />
            </button>

            {messages.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shadow-2xs"
                  title="Export Chat"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 shadow-2xs"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Persona Selector Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none flex-shrink-0">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex-shrink-0">Mode:</span>
          {personas.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 flex-shrink-0 ${
                activePersona === p.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{p.badge === 'Technical' ? '💻' : p.badge === 'Career' ? '💼' : p.badge === 'Practice' ? '🎯' : '🎓'}</span>
              <span>{p.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {messages.length === 0 ? (
            /* Welcome Empty State */
            <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-100">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  What would you like to master today?
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto leading-relaxed">
                  Can't read text or prefer listening? Click the <strong>🔊 Loudspeaker</strong> on any message to hear the AI Voice Assistant teach you out loud!
                </p>
              </div>

              {/* Multimedia Capability Cards */}
              <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-left">
                <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 font-bold text-sm">
                    🔊
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Voice Assistant</h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Reads all matter sentence by sentence in clear voice.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-100 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-2 font-bold text-sm">
                    🎙️
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Voice Mic Input</h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Dictate prompts directly without typing.</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-purple-100 shadow-2xs">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2 font-bold text-sm">
                    📷
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Camera & Vision</h4>
                  <p className="text-[11px] text-slate-500 leading-snug mt-0.5">Upload photos of questions, diagrams & code.</p>
                </div>
              </div>

              {/* Quick Prompts */}
              <div className="text-left space-y-2 max-w-lg mx-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                  Try asking one of these:
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {prompts.slice(0, 4).map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSend(p.prompt)}
                      className="p-3 text-left bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all shadow-2xs group"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 group-hover:text-indigo-600">
                        <span>{p.icon}</span>
                        <span>{p.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{p.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Message list */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[80%] space-y-2 ${m.role === 'user' ? 'order-1' : ''}`}>
                    {/* User Attached Image (if present) */}
                    {m.imageUrl && (
                      <div className={`rounded-xl overflow-hidden border ${m.role === 'user' ? 'border-indigo-400 ml-auto' : 'border-slate-200'}`}>
                        <div className="relative group cursor-pointer" onClick={() => setLightboxImage(m.imageUrl!)}>
                          <img
                            src={m.imageUrl}
                            alt="Uploaded visual"
                            className="max-h-60 w-auto rounded-xl object-contain bg-slate-900/10"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity gap-1.5">
                            <Eye size={16} /> Click to enlarge
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        m.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {m.role === 'user' ? (
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                      ) : m.content ? (
                        <ChatMarkdown content={m.content} />
                      ) : (
                        <div className="flex items-center gap-1.5 py-1 text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>

                    {/* Footer metadata & Action Buttons for Assistant */}
                    {m.role === 'assistant' && m.content && (
                      <div className="flex flex-wrap items-center gap-3 mt-2 px-1 text-slate-400 text-xs">
                        <span>{m.timestamp}</span>
                        <span>•</span>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyMessage(m.id, m.content)}
                          className="hover:text-slate-700 flex items-center gap-1 transition-colors"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <span>•</span>

                        {/* 📢 PROMINENT VOICE ASSISTANT SPEAKER BUTTON */}
                        <button
                          onClick={() => handleToggleSpeak(m.id, m.content)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-all shadow-2xs border ${
                            speakingId === m.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 animate-pulse'
                              : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          }`}
                          title="Click to have AI Voice Assistant read all the matter aloud"
                        >
                          {speakingId === m.id ? (
                            <>
                              <VolumeX className="w-4 h-4 text-white" />
                              <span>Stop Voice</span>
                              {currentSentenceProgress && (
                                <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px] ml-1">
                                  {currentSentenceProgress.current}/{currentSentenceProgress.total}
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4 text-indigo-600" />
                              <span>🔊 Read All Matter Aloud</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white flex-shrink-0 shadow-sm mt-1 order-2">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar area */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* ACTIVE VOICE ASSISTANT AUDIO PLAYER BAR */}
            {speakingId && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3 rounded-2xl border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                        🔊 Voice Assistant Reading:
                      </span>
                      {currentSentenceProgress && (
                        <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                          Sentence {currentSentenceProgress.current} of {currentSentenceProgress.total}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-200 truncate max-w-sm sm:max-w-md font-medium mt-0.5">
                      "{currentSentenceProgress?.text || 'Speaking matter clearly...'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                  {/* Speed toggle */}
                  <button
                    onClick={cycleSpeechRate}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-indigo-200 border border-white/10"
                    title="Change voice speed"
                  >
                    {speechRate}x Speed
                  </button>

                  {/* Pause / Resume */}
                  <button
                    onClick={togglePauseResumeSpeech}
                    className="px-3 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1 transition-colors border border-white/10"
                  >
                    {isSpeakingPaused ? <><Play size={13} fill="white" /> Resume</> : <><Pause size={13} fill="white" /> Pause</>}
                  </button>

                  {/* Stop Button */}
                  <button
                    onClick={handleStopSpeaking}
                    className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-md shadow-rose-900/30"
                  >
                    <VolumeX size={14} />
                    <span>Stop Voice</span>
                  </button>
                </div>
              </div>
            )}

            {/* Stop Streaming indicator */}
            {isStreaming && (
              <div className="flex justify-center mb-1">
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-full shadow-sm transition-colors"
                >
                  <Square className="w-3 h-3 fill-slate-700 text-slate-700" />
                  Stop generating
                </button>
              </div>
            )}

            {/* Microphone Listening Status Banner */}
            {isListening && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <Mic size={15} />
                  <span>Microphone Listening... Speak your prompt now!</span>
                </div>
                <button
                  onClick={stopListening}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
                >
                  Done Speaking
                </button>
              </div>
            )}

            {/* Speech Error Banner */}
            {speechError && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 text-center">
                {speechError}
              </div>
            )}

            {/* Attached Image Preview Bar */}
            {attachedImage && (
              <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={attachedImage}
                    alt="Attached"
                    className="w-12 h-12 rounded-lg object-cover border border-indigo-200 shadow-2xs"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-indigo-950 block truncate">
                      📷 {attachedImageName || 'Attached Image'}
                    </span>
                    <span className="text-[11px] text-indigo-700">Ready to analyze with Gemini Vision</span>
                  </div>
                </div>
                <button
                  onClick={() => { setAttachedImage(null); setAttachedImageName(null); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Quick Prompt Starters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => handleSend("I need comprehensive Python notes with code examples, data structures, and best practices.")}
                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full flex-shrink-0 transition-colors flex items-center gap-1 font-medium"
              >
                <span>🐍</span> Python Notes
              </button>
              <button
                type="button"
                onClick={() => handleSend("Explain SQL JOINs (INNER, LEFT, RIGHT, FULL) with clear practical table examples.")}
                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full flex-shrink-0 transition-colors flex items-center gap-1 font-medium"
              >
                <span>🗄️</span> SQL Joins
              </button>
              <button
                type="button"
                onClick={() => handleSend("What is the difference between var, let, and const in JavaScript with code examples?")}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-full flex-shrink-0 transition-colors flex items-center gap-1 font-medium"
              >
                <span>🌐</span> JS Var vs Let
              </button>
              <button
                type="button"
                onClick={() => handleSend("Explain the Sliding Window and Two Pointers algorithm techniques for coding interviews.")}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full flex-shrink-0 transition-colors flex items-center gap-1 font-medium"
              >
                <span>💻</span> DSA Patterns
              </button>
              <button
                type="button"
                onClick={() => handleSend("Conduct a mock behavioral interview question for a software engineer role using the STAR method.")}
                className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-full flex-shrink-0 transition-colors flex items-center gap-1 font-medium"
              >
                <span>🎯</span> Mock Interview
              </button>
            </div>

            {/* Input Bar with Mic & Camera & Upload Buttons */}
            <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
              {/* Camera Trigger */}
              <button
                type="button"
                onClick={openCamera}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-xl transition-colors flex-shrink-0"
                title="Camera: Snap photo of code, book, or problem"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Image Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70 rounded-xl transition-colors flex-shrink-0"
                title="Upload Image from Files"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />

              {/* Microphone Trigger */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/70'
                }`}
                title={isListening ? "Stop Microphone" : "Microphone: Speak prompt aloud"}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                placeholder={
                  isListening
                    ? "Listening... speak now..."
                    : attachedImage
                    ? "Add a question about this image, or press Send to analyze..."
                    : "Ask Gemini Assistant anything! E.g. 'I need Python notes', 'Explain SQL JOIN'..."
                }
                className="w-full bg-transparent resize-none border-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 text-sm px-1 py-1.5 max-h-36 leading-relaxed"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={(!input.trim() && !attachedImage) || isStreaming}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all flex-shrink-0 shadow-sm disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-400">
              🎙️ Voice Mic • 🔊 Voice Assistant Reads All Matter • 📷 Camera & Vision Upload • Enter sends
            </p>
          </div>
        </div>
      </div>

      {/* ─── LIVE CAMERA MODAL ──────────────────────────────────────────────── */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">Live Camera Capture</h3>
              </div>
              <button
                onClick={stopCamera}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Viewfinder */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-2xl pointer-events-none" />
            </div>

            {/* Controls */}
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <button
                onClick={stopCamera}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={capturePhoto}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <Camera size={16} />
                <span>📸 Capture Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── IMAGE LIGHTBOX MODAL ───────────────────────────────────────────── */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={lightboxImage}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Custom API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Key Configuration</h3>
                <p className="text-xs text-slate-500">Optional: Connect your own Gemini or OpenAI API Key</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800 mb-1">✨ Automatic Live AI is Active</p>
              By default, StudentRoadmap AI provides free high-speed live streaming responses with full vision and voice support. If you wish to use your personal private Google AI Studio or OpenAI key, paste it below.
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Google Gemini (or OpenAI) API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy... or sk-..."
                  className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('custom_ai_key', apiKeyInput.trim())
                    setCustomApiKey(apiKeyInput.trim())
                    setShowApiKeyModal(false)
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}
