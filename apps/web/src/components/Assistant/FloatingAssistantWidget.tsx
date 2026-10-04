import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  X,
  Send,
  Maximize2,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Image as ImageIcon
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ChatMarkdown } from './ChatMarkdown'
import { VoiceAnswer } from '../Common/VoiceAnswer'
import { useVoiceToText } from '../../hooks/useVoiceToText'
import { useLanguage } from '../../i18n/LanguageContext'

interface FloatingMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
}

export const FloatingAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<FloatingMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hi! Need quick help understanding a skill, debugging code, or preparing for an interview? Ask me with text, voice mic, or upload photos!',
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [attachedImage, setAttachedImage] = useState<string | null>(null)

  const { currentLanguage } = useLanguage()

  const {
    isListening,
    isProcessing: isVoiceProcessing,
    toggleListening,
    stopListening
  } = useVoiceToText({
    lang: currentLanguage,
    clearOnStart: true,
    onTranscriptChange: (transcript) => {
      setInput(transcript)
    },
    onFinalTranscript: (finalTranscript) => {
      setInput(finalTranscript)
    }
  })

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const location = useLocation()

  // Hide the floating bubble if the user is already on the full /assistant page
  if (location.pathname === '/assistant' || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  // Loudspeaker text-to-speech
  const handleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return
    if (speakingId === id) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }

    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[#*`_~>[\]()]/g, ' ').replace(/\s+/g, ' ').trim()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)
    setSpeakingId(id)
    window.speechSynthesis.speak(utterance)
  }



  // File select
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAttachedImage(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSend = async () => {
    const text = input.trim()
    if ((!text && !attachedImage) || isStreaming) return

    if (isListening) {
      stopListening()
    }

    const promptText = text || 'Please analyze this attached image.'
    const userMsg: FloatingMessage = {
      id: `float-${Date.now()}-u`,
      role: 'user',
      content: promptText,
      imageUrl: attachedImage || undefined,
    }

    const assistantMsgId = `float-${Date.now()}-a`
    const assistantMsg: FloatingMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
    }

    const nextMessages = [...messages, userMsg]
    setMessages([...nextMessages, assistantMsg])
    setInput('')
    setAttachedImage(null)
    setIsStreaming(true)

    try {
      const token = localStorage.getItem('access_token')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const customKey = localStorage.getItem('custom_ai_key') || undefined
      const response = await fetch('http://localhost:8001/api/v1/assistant/chat/stream', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: nextMessages.map(m => ({
            role: m.role,
            content: m.content,
            image_url: m.imageUrl || undefined,
          })),
          persona: 'mentor',
          model: 'gemini-2.0-flash',
          include_student_context: true,
          api_key: customKey,
        }),
      })

      if (!response.ok) throw new Error('Network error')

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
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: '⚠️ Error reaching assistant. Please try again.' }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[360px] sm:w-[410px] h-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 py-3 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-xs leading-none">Gemini AI Assistant</h3>
                <span className="text-[10px] text-indigo-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Mic • Voice • Vision Ready
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/assistant"
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Expand to Full Page"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                  setSpeakingId(null)
                  setMessages([{ id: 'w', role: 'assistant', content: 'Chat cleared! What can I help with?' }])
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
                  setSpeakingId(null)
                  setIsOpen(false)
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 text-xs mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
                <div className="space-y-1 max-w-[85%]">
                  {m.imageUrl && (
                    <img
                      src={m.imageUrl}
                      alt="Uploaded"
                      className="max-h-36 rounded-lg object-contain border border-indigo-200"
                    />
                  )}
                  {m.role === 'assistant' && (
                    <div className="text-[10px] font-bold text-indigo-700 ml-0.5">
                      AI Answer
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {m.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : m.content ? (
                      <ChatMarkdown content={m.content} />
                    ) : (
                      <div className="flex items-center gap-1 py-1 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>

                  {m.role === 'assistant' && m.content && (
                    <div className="pt-0.5">
                      <VoiceAnswer
                        id={m.id}
                        text={m.content}
                        compact
                        autoPlay={m.id === messages[messages.length - 1]?.id}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2.5 bg-white border-t border-slate-200 space-y-2">
            {attachedImage && (
              <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={attachedImage} alt="Attach" className="w-7 h-7 rounded object-cover" />
                  <span className="text-[11px] font-semibold text-indigo-900 truncate">Attached photo</span>
                </div>
                <button onClick={() => setAttachedImage(null)} className="text-slate-400 hover:text-rose-600">
                  <X size={13} />
                </button>
              </div>
            )}

            {isListening && (
              <div className="px-2 py-1 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 font-bold flex items-center justify-between animate-pulse">
                <span>🎙️ Listening... speak now</span>
                <button onClick={toggleListening} className="underline">Stop</button>
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl px-2 py-1.5 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              {/* Image Picker */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Attach photo/image"
              >
                <ImageIcon size={15} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Mic Dictation */}
              <button
                type="button"
                onClick={toggleListening}
                disabled={isVoiceProcessing}
                className={`p-1 transition-colors ${
                  isListening
                    ? 'text-rose-600 animate-pulse'
                    : isVoiceProcessing
                    ? 'opacity-50 cursor-not-allowed text-slate-300'
                    : 'text-slate-400 hover:text-indigo-600'
                }`}
                title={isListening ? "Stop listening (Done)" : isVoiceProcessing ? "Initializing mic..." : "Mic voice dictation"}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask Gemini Assistant..."}
                className="w-full bg-transparent border-0 focus:outline-none text-xs text-slate-800 placeholder-slate-400"
              />

              <button
                onClick={handleSend}
                disabled={(!input.trim() && !attachedImage) || isStreaming}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors flex-shrink-0"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-105 transition-all group font-medium text-xs"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Gemini AI</span>
        </button>
      )}
    </div>
  )
}
