import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  Image as ImageIcon,
  MessageSquare,
  Radio,
  RotateCcw,
  Square
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { ChatMarkdown } from './ChatMarkdown'
import { useVoiceToText } from '../../hooks/useVoiceToText'
import { useLanguage } from '../../i18n/LanguageContext'
import { speechService } from '../../lib/speechService'

interface FloatingMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  imageUrl?: string
}

export const FloatingAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'voice' | 'chat'>('voice')
  const [messages, setMessages] = useState<FloatingMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '👋 Hi! I am your AI Career & Learning Assistant. Ask me anything about tech careers, roadmaps, programming, or interview questions using Voice or Text!',
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [attachedImage, setAttachedImage] = useState<string | null>(null)

  // Voice AI Assistant specific states
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false)
  const [currentSpokenSentence, setCurrentSpokenSentence] = useState<string>('')
  const [voiceRate, setVoiceRate] = useState<number>(1.0)
  const [lastUserSpokenText, setLastUserSpokenText] = useState<string>('')
  const [lastAiSpokenText, setLastAiSpokenText] = useState<string>('')
  const [autoSpeakInChat, setAutoSpeakInChat] = useState<boolean>(true)

  const { currentLanguage } = useLanguage()

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const location = useLocation()

  // Forward ref for send handler to be accessible inside speech callbacks
  const sendPromptRef = useRef<(promptText: string) => Promise<void>>(async () => {})

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
      if (mode === 'voice') {
        setLastUserSpokenText(transcript)
      }
    },
    onFinalTranscript: (finalTranscript) => {
      setInput(finalTranscript)
      if (finalTranscript.trim()) {
        setLastUserSpokenText(finalTranscript)
        if (mode === 'voice') {
          // In Voice AI mode, automatically send the spoken question
          sendPromptRef.current(finalTranscript)
        }
      }
    }
  })

  // Hide the floating bubble if the user is already on the full /assistant page
  if (location.pathname === '/assistant' || location.pathname === '/login' || location.pathname === '/register') {
    return null
  }

  useEffect(() => {
    if (isOpen && mode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, mode])

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      speechService.stop()
    }
  }, [])

  const stopAllAudio = useCallback(() => {
    speechService.stop()
    setIsAiSpeaking(false)
    setCurrentSpokenSentence('')
    setSpeakingId(null)
  }, [])

  // Text-to-speech speaker handler
  const handleSpeakText = (id: string, text: string) => {
    if (speakingId === id || isAiSpeaking) {
      stopAllAudio()
      return
    }

    setSpeakingId(id)
    setIsAiSpeaking(true)

    speechService.speak(text, {
      rate: voiceRate,
      onStart: () => {
        setIsAiSpeaking(true)
      },
      onSentenceChange: (_idx, _total, sentence) => {
        setCurrentSpokenSentence(sentence)
      },
      onEnd: () => {
        setIsAiSpeaking(false)
        setSpeakingId(null)
        setCurrentSpokenSentence('')
      },
      onError: () => {
        setIsAiSpeaking(false)
        setSpeakingId(null)
        setCurrentSpokenSentence('')
      }
    })
  }

  // Core stream message sender
  const sendPrompt = async (promptOverride?: string) => {
    const textToSend = (promptOverride ?? input).trim()
    if ((!textToSend && !attachedImage) || isStreaming) return

    // If AI is currently speaking, stop it so user can talk
    stopAllAudio()

    if (isListening) {
      stopListening()
    }

    const promptText = textToSend || 'Please analyze this attached image.'
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
    setLastUserSpokenText(promptText)

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

      // Voice AI Assistant automatically speaks out the answer
      if (accumulated && (mode === 'voice' || autoSpeakInChat)) {
        setLastAiSpokenText(accumulated)
        handleSpeakText(assistantMsgId, accumulated)
      }
    } catch {
      const errorMsg = '⚠️ Error reaching assistant. Please verify connection and try again.'
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMsgId
            ? { ...m, content: errorMsg }
            : m
        )
      )
      if (mode === 'voice') {
        setLastAiSpokenText(errorMsg)
      }
    } finally {
      setIsStreaming(false)
    }
  }

  sendPromptRef.current = sendPrompt

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAttachedImage(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[360px] sm:w-[420px] h-[560px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-4 py-3 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-xs">
                {mode === 'voice' ? <Radio className="w-4 h-4 text-emerald-300 animate-pulse" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
              </div>
              <div>
                <h3 className="font-bold text-xs leading-none flex items-center gap-1.5">
                  <span>{mode === 'voice' ? 'Voice AI Assistant' : 'Gemini AI Assistant'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <span className="text-[10px] text-indigo-100 mt-0.5 block">
                  {mode === 'voice' ? 'Live Two-Way Voice Conversation' : 'Interactive Chat & Image Analysis'}
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
                  stopAllAudio()
                  setMessages([{ id: 'w', role: 'assistant', content: 'Chat cleared! What can I help you learn?' }])
                  setLastUserSpokenText('')
                  setLastAiSpokenText('')
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  stopAllAudio()
                  if (isListening) stopListening()
                  setIsOpen(false)
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ─── MODE SWITCHER TABS ─── */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl mx-3 mt-2 border border-slate-200 flex-shrink-0">
            <button
              onClick={() => {
                setMode('voice')
                stopAllAudio()
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'voice'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mic size={13} className={mode === 'voice' && isListening ? 'animate-pulse' : ''} />
              <span>Voice AI Assistant</span>
              {mode === 'voice' && isListening && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
              )}
            </button>
            <button
              onClick={() => {
                setMode('chat')
                stopAllAudio()
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'chat'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare size={13} />
              <span>Text & Vision Chat</span>
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════
              MODE 1: VOICE AI ASSISTANT (INTERACTIVE HANDS-FREE VOICE CONVERSATION)
             ═══════════════════════════════════════════════════════════════════════ */}
          {mode === 'voice' ? (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50">
              {/* Voice Status & Voice Speed Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Radio size={13} className={isAiSpeaking ? 'text-indigo-600 animate-spin' : isListening ? 'text-emerald-600 animate-pulse' : 'text-slate-400'} />
                  {isListening ? 'Listening to voice...' : isStreaming ? 'AI is thinking...' : isAiSpeaking ? 'AI is speaking aloud...' : 'Voice AI Ready'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400">Speed:</span>
                  <select
                    value={voiceRate}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      setVoiceRate(val)
                      speechService.setRate(val)
                    }}
                    className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] font-bold text-slate-700"
                  >
                    <option value={0.85}>0.8x</option>
                    <option value={1.0}>1.0x</option>
                    <option value={1.2}>1.2x</option>
                  </select>
                </div>
              </div>

              {/* Glowing Interactive Voice Orb */}
              <div className="my-auto flex flex-col items-center justify-center py-4">
                <div className="relative flex items-center justify-center">
                  {/* Outer pulsating wave rings */}
                  {(isListening || isAiSpeaking) && (
                    <div
                      className={`absolute w-36 h-36 rounded-full opacity-30 animate-ping ${
                        isAiSpeaking ? 'bg-indigo-400' : 'bg-emerald-400'
                      }`}
                    />
                  )}
                  {(isListening || isAiSpeaking) && (
                    <div
                      className={`absolute w-28 h-28 rounded-full opacity-40 animate-pulse ${
                        isAiSpeaking ? 'bg-purple-400' : 'bg-teal-400'
                      }`}
                    />
                  )}

                  {/* Central Interactive Orb Button */}
                  <button
                    onClick={() => {
                      if (isAiSpeaking) {
                        stopAllAudio()
                      } else {
                        toggleListening()
                      }
                    }}
                    disabled={isVoiceProcessing}
                    className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 ${
                      isAiSpeaking
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-300 scale-105'
                        : isListening
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-emerald-300 scale-105 ring-4 ring-emerald-200'
                        : isStreaming
                        ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white animate-pulse'
                        : 'bg-white hover:bg-slate-50 text-indigo-600 border-2 border-indigo-200 hover:border-indigo-400 shadow-md hover:scale-105'
                    }`}
                  >
                    {isAiSpeaking ? (
                      <>
                        <Square size={26} className="fill-white" />
                        <span className="text-[10px] font-extrabold mt-1">Tap to Mute</span>
                      </>
                    ) : isListening ? (
                      <>
                        <MicOff size={28} className="animate-bounce" />
                        <span className="text-[10px] font-extrabold mt-1">Done</span>
                      </>
                    ) : isStreaming ? (
                      <>
                        <Sparkles size={28} className="animate-spin text-yellow-300" />
                        <span className="text-[10px] font-extrabold mt-1">Thinking</span>
                      </>
                    ) : (
                      <>
                        <Mic size={30} className="text-indigo-600" />
                        <span className="text-[10px] font-extrabold text-slate-700 mt-1">Tap to Speak</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subtitle guidance */}
                <p className="mt-4 text-xs font-semibold text-center text-slate-600 max-w-xs leading-relaxed">
                  {isListening
                    ? '🎙️ Listening... Speak your prompt naturally.'
                    : isStreaming
                    ? '✨ Synthesizing best learning response...'
                    : isAiSpeaking
                    ? '🔊 Reading explanation aloud. Tap orb to interrupt.'
                    : 'Tap the microphone orb to ask a question out loud!'}
                </p>
              </div>

              {/* Spoken Transcription Card */}
              <div className="space-y-2 mt-auto">
                {lastUserSpokenText && (
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
                    <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">
                      You asked:
                    </span>
                    <p className="font-semibold text-slate-900 line-clamp-2">
                      "{lastUserSpokenText}"
                    </p>
                  </div>
                )}

                {lastAiSpokenText && (
                  <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs shadow-2xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-indigo-700 text-[10px] uppercase tracking-wider">
                        AI Voice Answer:
                      </span>
                      {isAiSpeaking && (
                        <button
                          onClick={stopAllAudio}
                          className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <VolumeX size={11} /> Stop Audio
                        </button>
                      )}
                    </div>
                    <p className="text-slate-800 line-clamp-3 leading-relaxed">
                      {currentSpokenSentence || lastAiSpokenText}
                    </p>
                  </div>
                )}

                {/* Quick Voice Prompt Suggestions */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                  <button
                    onClick={() => sendPrompt('What are the key responsibilities of a Data Analyst?')}
                    className="px-2 py-1 bg-white hover:bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold border border-slate-200 whitespace-nowrap"
                  >
                    💼 Data Analyst Role
                  </button>
                  <button
                    onClick={() => sendPrompt('Explain Python lists vs dictionaries with code example')}
                    className="px-2 py-1 bg-white hover:bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold border border-slate-200 whitespace-nowrap"
                  >
                    🐍 Python Data Types
                  </button>
                  <button
                    onClick={() => sendPrompt('Give me a 5-step roadmap to learn Cloud Computing')}
                    className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold border border-slate-200 whitespace-nowrap"
                  >
                    ☁️ Cloud Roadmap
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════════════════════════
               MODE 2: TEXT & VISION CHAT (STANDARD MESSAGING INTERFACE)
               ═══════════════════════════════════════════════════════════════════════ */
            <>
              {/* Messages Container */}
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
                          <div className="flex items-center gap-1.5 py-1 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        )}
                      </div>

                      {/* Message Actions */}
                      {m.role === 'assistant' && m.content && (
                        <div className="flex items-center gap-2 pl-1">
                          <button
                            onClick={() => handleSpeakText(m.id, m.content)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                            title="Listen to this message"
                          >
                            {speakingId === m.id ? (
                              <>
                                <VolumeX size={11} className="text-rose-500" />
                                <span className="text-rose-500 font-bold">Stop Audio</span>
                              </>
                            ) : (
                              <>
                                <Volume2 size={11} />
                                <span>Read Aloud</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
                {attachedImage && (
                  <div className="mb-2 p-1.5 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={attachedImage} alt="Attach" className="w-7 h-7 rounded object-cover" />
                      <span className="text-[11px] font-semibold text-indigo-900 truncate">Attached photo</span>
                    </div>
                    <button onClick={() => setAttachedImage(null)} className="text-slate-400 hover:text-rose-600">
                      <X size={13} />
                    </button>
                  </div>
                )}

                {isListening && (
                  <div className="px-2 py-1 mb-2 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-700 font-bold flex items-center justify-between animate-pulse">
                    <span>🎙️ Listening... speak now</span>
                    <button onClick={toggleListening} className="underline">Done</button>
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
                    title={isListening ? "Stop listening" : isVoiceProcessing ? "Initializing mic..." : "Mic voice dictation"}
                  >
                    {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  </button>

                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendPrompt()}
                    placeholder={isListening ? "Listening..." : "Ask Gemini Assistant..."}
                    className="w-full bg-transparent border-0 focus:outline-none text-xs text-slate-800 placeholder-slate-400"
                  />

                  <button
                    onClick={() => sendPrompt()}
                    disabled={(!input.trim() && !attachedImage) || isStreaming}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg transition-colors flex-shrink-0"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* ─── FLOATING TRIGGER PILL ─── */
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-700/60 hover:scale-105 transition-all">
          {/* Direct Voice AI Assistant Trigger */}
          <button
            onClick={() => {
              setIsOpen(true)
              setMode('voice')
              setTimeout(() => {
                if (!isListening) toggleListening()
              }, 200)
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold text-xs shadow-md shadow-emerald-500/20 transition-all group"
            title="Talk to Voice AI Assistant"
          >
            <Mic className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Voice AI</span>
          </button>

          {/* Standard Text/Image Chat Trigger */}
          <button
            onClick={() => {
              setIsOpen(true)
              setMode('chat')
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full font-bold text-xs shadow-md shadow-indigo-500/20 transition-all group"
            title="Open AI Chat"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
            <span>Chat AI</span>
          </button>
        </div>
      )}
    </div>
  )
}
