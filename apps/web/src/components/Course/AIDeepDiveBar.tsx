import React, { useState } from 'react';
import { Sparkles, Bot, Loader2, ChevronDown, Check, Lightbulb, Zap, HelpCircle } from 'lucide-react';
import api from '../../lib/api';

interface AIDeepDiveProps {
  lessonTitle: string;
  courseTitle: string;
}

export default function AIDeepDiveBar({ lessonTitle, courseTitle }: AIDeepDiveProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const prompts = [
    {
      label: "🧠 Explain Like I'm 10",
      query: `Explain ${lessonTitle} in ${courseTitle} using an ultra-simple real life analogy suitable for a beginner.`
    },
    {
      label: "⚡ Another Real-World Example",
      query: `Give me a realistic production engineering example of where ${lessonTitle} is used at tech companies like Netflix or Uber.`
    },
    {
      label: "🔍 Tricky Edge Cases",
      query: `What are 3 subtle edge cases or common performance bugs developers encounter with ${lessonTitle} and how to fix them?`
    },
    {
      label: "🎯 Practice Interview Problem",
      query: `Give me a FAANG-style interview question testing ${lessonTitle}, along with a step-by-step hint and optimal solution.`
    }
  ];

  const handleAskAI = async (promptLabel: string, queryText: string) => {
    if (activePrompt === promptLabel && response) {
      // toggle off
      setActivePrompt(null);
      setResponse(null);
      return;
    }

    setActivePrompt(promptLabel);
    setLoading(true);
    setResponse(null);

    try {
      const res = await api.post('/assistant/chat', {
        message: queryText,
        context: {
          current_page: `/courses/${courseTitle}/${lessonTitle}`,
          study_topic: `${courseTitle} — ${lessonTitle}`
        }
      });
      setResponse(res.data.reply || res.data.message || 'No response received.');
    } catch (err) {
      setResponse(`Could not connect to the AI Assistant. Please ensure your backend is active or try asking in the AI Assistant tab.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Sparkles size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              AI Deep-Dive & Concept Expander
              <span className="badge bg-indigo-100 text-indigo-700 text-[10px] font-bold">Interactive</span>
            </h4>
            <p className="text-xs text-slate-500">Need more clarity? Click any prompt below for instantaneous custom explanations</p>
          </div>
        </div>
      </div>

      {/* Quick Action Chips */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleAskAI(p.label, p.query)}
            disabled={loading}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activePrompt === p.label
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable AI Response Window */}
      {(loading || response) && (
        <div className="mt-5 p-5 rounded-2xl bg-white border border-indigo-200 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Bot size={15} className="text-indigo-600" />
              <span>AI Study Companion: {activePrompt}</span>
            </div>
            <button
              onClick={() => {
                setActivePrompt(null);
                setResponse(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Dismiss ✕
            </button>
          </div>

          {loading ? (
            <div className="flex items-center gap-3 py-6 justify-center text-slate-500 text-xs font-medium">
              <Loader2 size={18} className="animate-spin text-indigo-600" />
              Generating comprehensive study response for {lessonTitle}...
            </div>
          ) : (
            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {response}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
