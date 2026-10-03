import React, { useState } from 'react';
import { ContentBlock } from '../../types/course';
import {
  Lightbulb,
  AlertTriangle,
  Code,
  Terminal,
  CheckCircle2,
  ChevronDown,
  Target,
  BookOpen,
  Wrench,
  CheckSquare,
  Sparkles,
  Layers,
  ArrowRight,
  Briefcase,
  Compass,
  GraduationCap,
  Copy,
  Check,
  HelpCircle,
  TrendingUp,
  FolderGit2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function LessonContent({ blocks }: { blocks: ContentBlock[] }) {
  const [globalExpanded, setGlobalExpanded] = useState<boolean | null>(null);

  const toggleAll = () => {
    setGlobalExpanded(prev => (prev === true ? false : true));
  };

  return (
    <div className="space-y-8">
      {/* Top Toolbar: Expand/Collapse All */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <BookOpen size={15} className="text-indigo-600" />
          <span>Curriculum Blueprint • 12 Educational Modules</span>
        </div>
        <button
          onClick={toggleAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-2xs"
          title="Expand or collapse all solutions and project guides"
        >
          {globalExpanded ? (
            <>
              <Minimize2 size={13} />
              <span>Collapse All Solutions</span>
            </>
          ) : (
            <>
              <Maximize2 size={13} />
              <span>Expand All Solutions</span>
            </>
          )}
        </button>
      </div>

      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} globalExpanded={globalExpanded} />
      ))}
    </div>
  );
}

function BlockRenderer({ block, globalExpanded }: { block: any; globalExpanded: boolean | null }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync with global expanded trigger if changed
  React.useEffect(() => {
    if (globalExpanded !== null) {
      setShowAnswer(globalExpanded);
    }
  }, [globalExpanded]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rawContent = block.content;
  const contentStr = Array.isArray(rawContent)
    ? rawContent.join('\n')
    : typeof rawContent === 'object' && rawContent !== null
    ? ''
    : String(rawContent || '');

  switch (block.type) {
    // ─── 1. TOPIC INTRODUCTION ───────────────────────────────────────────────
    case 'intro': {
      const data = typeof rawContent === 'object' && rawContent !== null
        ? rawContent
        : { definition: contentStr, meaning: '', importance: '' };

      return (
        <div className="my-6 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50/50 to-white border border-indigo-100 shadow-xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-indigo-100">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
              1
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {block.title || '1. Topic Introduction'}
              </h3>
              <p className="text-xs text-indigo-700/80">Conceptual definition, mental model, and engineering purpose</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Definition Box */}
            <div className="bg-white p-4.5 rounded-xl border border-indigo-100/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                <BookOpen size={14} />
                <span>Formal Definition</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {data.definition || 'Key fundamental building block in modern computing architecture.'}
              </p>
            </div>

            {/* Mental Model Box */}
            <div className="bg-white p-4.5 rounded-xl border border-sky-100/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Lightbulb size={14} />
                <span>What It Means</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.meaning || 'A practical abstraction that translates human problem-solving into deterministic runtime logic.'}
              </p>
            </div>

            {/* Importance Box */}
            <div className="bg-white p-4.5 rounded-xl border border-emerald-100/80 shadow-2xs">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                <TrendingUp size={14} />
                <span>Why It Matters</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {data.importance || 'Powers scalable applications across top tech companies worldwide.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ─── 2. DETAILED EXPLANATION ────────────────────────────────────────────
    case 'explanation': {
      const paragraphs = typeof rawContent === 'string'
        ? rawContent.split('\n\n').filter(Boolean)
        : Array.isArray(rawContent)
        ? rawContent
        : [];

      return (
        <div className="my-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              2
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {block.title || '2. Detailed Step-by-Step Explanation'}
            </h3>
          </div>
          <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
            {paragraphs.map((p: string, i: number) => (
              <p key={i} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      );
    }

    // ─── 3. KEY CONCEPTS BREAKDOWN ──────────────────────────────────────────
    case 'concepts': {
      const conceptsList: Array<{ concept: string; detail: string }> = Array.isArray(rawContent)
        ? rawContent
        : [];

      return (
        <div className="my-6 p-6 rounded-2xl bg-slate-50/70 border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-200">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              3
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {block.title || '3. Key Concepts Breakdown'}
              </h3>
              <p className="text-xs text-slate-500">Core architectural components broken down individually</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {conceptsList.map((c, i) => (
              <div key={i} className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{c.concept}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 4. CODE EXAMPLES ───────────────────────────────────────────────────
    case 'code': {
      return (
        <div className="my-6 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <Code size={13} className="text-slate-400 ml-2" />
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                {block.language || block.lang || 'code'}
              </span>
              {block.title && (
                <span className="text-xs text-slate-400 font-medium hidden sm:inline ml-2 border-l border-slate-700 pl-3">
                  {block.title}
                </span>
              )}
            </div>
            <button
              onClick={() => handleCopy(contentStr)}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg transition-all border border-slate-700"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <div className="p-5 overflow-x-auto">
            <pre className="text-sm font-mono text-emerald-300 leading-relaxed whitespace-pre-wrap">
              <code>{contentStr}</code>
            </pre>
          </div>
          {block.output && (
            <div className="border-t border-slate-800 bg-black/60 px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={12} className="text-slate-400" />
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Terminal Standard Output
                </span>
              </div>
              <pre className="text-xs sm:text-sm font-mono text-slate-200 whitespace-pre-wrap bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                {block.output}
              </pre>
            </div>
          )}
        </div>
      );
    }

    // ─── 4b. LINE-BY-LINE CODE BREAKDOWN ────────────────────────────────────
    case 'line_breakdown': {
      const lines: Array<{ line: string; explanation: string }> = Array.isArray(rawContent)
        ? rawContent
        : [];

      return (
        <div className="my-6 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
              4b
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {block.title || 'Line-by-Line Code Breakdown'}
              </h3>
              <p className="text-xs text-slate-500">Understand exactly what each line of syntax executes</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
            {lines.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 grid sm:grid-cols-12 gap-3 items-center hover:bg-white transition-colors">
                <div className="sm:col-span-5 font-mono text-xs sm:text-sm bg-slate-900 text-indigo-300 px-3 py-2 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                  <code>{item.line}</code>
                </div>
                <div className="sm:col-span-7 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <ArrowRight size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
                    <span>{item.explanation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 5. REAL-WORLD APPLICATIONS ─────────────────────────────────────────
    case 'real_world': {
      return (
        <div className="my-6 p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-sky-50/30 to-white shadow-xs">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-blue-100">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              5
            </span>
            <div>
              <h3 className="text-lg font-bold text-blue-950">
                {block.title || '5. Real-World Applications'}
              </h3>
              <p className="text-xs text-blue-700/80">Where this architecture is deployed in modern software</p>
            </div>
          </div>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
            {contentStr}
          </p>
        </div>
      );
    }

    // ─── 6. PREREQUISITES ───────────────────────────────────────────────────
    case 'prerequisites': {
      const prereqs: string[] = Array.isArray(rawContent)
        ? rawContent
        : typeof rawContent === 'string'
        ? rawContent.split('\n').filter(Boolean)
        : [];

      return (
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              6
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {block.title || '6. Prerequisites & Required Knowledge'}
            </h3>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5 mt-3">
            {prereqs.map((prereq, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                <CheckCircle2 size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{prereq}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // ─── 7. LEARNING PATH PROGRESSION ───────────────────────────────────────
    case 'learning_path': {
      const pathData = typeof rawContent === 'object' && rawContent !== null
        ? rawContent
        : { beginner: '', intermediate: '', advanced: '' };

      return (
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border border-indigo-100 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-indigo-100">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              7
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {block.title || '7. Learning Path Progression'}
              </h3>
              <p className="text-xs text-indigo-700/80">Beginner → Intermediate → Advanced progression milestones</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4.5 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                🌱 Beginner Level
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {pathData.beginner}
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-xl border border-blue-200 shadow-2xs">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
                🌿 Intermediate Level
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {pathData.intermediate}
              </p>
            </div>

            <div className="bg-white p-4.5 rounded-xl border border-purple-200 shadow-2xs">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 mb-2">
                🚀 Advanced / Production
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {pathData.advanced}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // ─── 8. PRACTICE EXERCISES ──────────────────────────────────────────────
    case 'practice': {
      // Check if content is array of structured practice exercises: [{ level, q, a }]
      const isStructuredArray = Array.isArray(rawContent) && rawContent.length > 0 && typeof rawContent[0] === 'object';

      if (isStructuredArray) {
        return (
          <div className="my-8 p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  8
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {block.title || '8. Interactive Practice Exercises'}
                  </h3>
                  <p className="text-xs text-indigo-700/80">3-tier self-check: Beginner, Intermediate & Challenge</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {rawContent.map((item: any, idx: number) => (
                <PracticeExerciseCard key={idx} exercise={item} defaultOpen={globalExpanded === true} />
              ))}
            </div>
          </div>
        );
      }

      // Fallback single practice question
      const parts = contentStr.split('|||');
      const question = parts[0]?.trim() || contentStr;
      const answer = parts.length > 1 ? parts[1]?.trim() : (block.output || '');

      return (
        <div className="my-8 p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={20} className="text-indigo-600 flex-shrink-0" />
            <h4 className="font-bold text-indigo-900 text-base">{block.title || '✍️ Practice Exercise & Self-Check'}</h4>
          </div>
          <p className="text-slate-800 font-medium mb-5 leading-relaxed text-sm sm:text-base">{question}</p>

          {answer && (
            <div>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-xl transition-all shadow-2xs"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${showAnswer ? 'rotate-180' : ''}`}
                />
                {showAnswer ? 'Hide Solution' : 'Reveal Solution & Explanation'}
              </button>

              {showAnswer && (
                <div className="mt-4 p-5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} /> Detailed Answer & Explanation
                  </div>
                  <pre className="text-slate-700 text-sm whitespace-pre-wrap font-mono leading-relaxed">{answer}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    // ─── 9. HANDS-ON MINI PROJECT ───────────────────────────────────────────
    case 'mini_project': {
      const proj = typeof rawContent === 'object' && rawContent !== null
        ? rawContent
        : { title: 'Hands-On Implementation', objective: contentStr, steps: [], deliverable: '' };

      const steps: string[] = Array.isArray(proj.steps) ? proj.steps : [];

      return (
        <div className="my-8 p-6 sm:p-7 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/40 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-purple-200">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
              9
            </span>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-950">
                {block.title || '9. Hands-On Mini Project'}
              </h3>
              <p className="text-xs text-purple-700">Project blueprint: design, build, and test your deliverable</p>
            </div>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-purple-200 mb-4 shadow-2xs">
            <h4 className="font-bold text-purple-900 text-base mb-1.5">{proj.title}</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              🎯 <strong>Objective:</strong> {proj.objective}
            </p>
          </div>

          {steps.length > 0 && (
            <div className="space-y-2 mb-4">
              <h5 className="text-xs font-bold uppercase tracking-wider text-purple-800">Step-by-Step Implementation:</h5>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-purple-100 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-800 leading-snug">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {proj.deliverable && (
            <div className="p-3.5 bg-purple-100/70 rounded-xl border border-purple-200 flex items-center gap-2 text-xs sm:text-sm text-purple-900 font-semibold">
              <FolderGit2 size={16} className="text-purple-700 flex-shrink-0" />
              <span>Deliverable: {proj.deliverable}</span>
            </div>
          )}
        </div>
      );
    }

    // ─── 10. COMMON MISTAKES ────────────────────────────────────────────────
    case 'common_mistakes': {
      const mistakesList: Array<{ mistake: string; why: string; fix: string }> = Array.isArray(rawContent)
        ? rawContent
        : [];

      return (
        <div className="my-8 p-6 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-amber-200">
            <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
              10
            </span>
            <div>
              <h3 className="text-lg font-bold text-amber-950">
                {block.title || '10. Common Mistakes & How to Avoid Them'}
              </h3>
              <p className="text-xs text-amber-800">Learn from typical beginner errors before they cause runtime bugs</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {mistakesList.map((m, i) => (
              <div key={i} className="bg-white p-4.5 rounded-xl border border-amber-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-bold text-rose-900 leading-snug">
                    {m.mistake}
                  </span>
                </div>
                <div className="text-xs text-slate-600 pl-6 leading-relaxed">
                  <span className="font-semibold text-slate-700">Why it happens:</span> {m.why}
                </div>
                <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 leading-relaxed font-medium">
                  <span className="font-bold text-emerald-900">✓ The Fix:</span> {m.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ─── 11. CAREER RELEVANCE ───────────────────────────────────────────────
    case 'career_relevance': {
      const career = typeof rawContent === 'object' && rawContent !== null
        ? rawContent
        : { roles: [], relevance: contentStr, skills_applied: [] };

      const roles: string[] = Array.isArray(career.roles) ? career.roles : [];
      const skills: string[] = Array.isArray(career.skills_applied) ? career.skills_applied : [];

      return (
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-700">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
              11
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {block.title || '11. Career Relevance & Industry Demand'}
              </h3>
              <p className="text-xs text-slate-300">How this knowledge maps directly to tech industry job roles</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                💼 Target Career Roles:
              </span>
              <div className="flex flex-wrap gap-2">
                {roles.map((r, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium transition-colors">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-3.5 rounded-xl border border-white/10">
              {career.relevance}
            </p>

            {skills.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  🛠️ Applied Competencies:
                </span>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 rounded-md text-xs">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ─── 12. NEXT STEPS & SUMMARY ───────────────────────────────────────────
    case 'next_steps': {
      const nextData = typeof rawContent === 'object' && rawContent !== null
        ? rawContent
        : { summary: contentStr, next_topic: 'Next Lesson', bridge: 'Proceed forward' };

      return (
        <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-200">
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              12
            </span>
            <div>
              <h3 className="text-lg font-bold text-emerald-950">
                {block.title || '12. Next Steps & Learning Bridge'}
              </h3>
              <p className="text-xs text-emerald-700">Consolidate your learning and prepare for subsequent concepts</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                ✓ What You Mastered:
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {nextData.summary}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-100/60 rounded-xl border border-emerald-300 flex items-start gap-3">
              <ArrowRight size={18} className="text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                  Next Topic: {nextData.next_topic}
                </span>
                <p className="text-xs sm:text-sm text-emerald-950 mt-0.5">
                  {nextData.bridge}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ─── LEGACY & SPECIAL BLOCKS ────────────────────────────────────────────
    case 'heading':
      return (
        <div className="mt-10 mb-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-600 rounded-full inline-block"></span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{contentStr}</h2>
          </div>
        </div>
      );

    case 'objectives':
    case 'objective': {
      const items: string[] = Array.isArray(rawContent)
        ? rawContent
        : typeof rawContent === 'string'
        ? rawContent.split('\n').filter(Boolean)
        : [];
      return (
        <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-100 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 text-indigo-900 font-bold text-base">
            <Target size={20} className="text-indigo-600" />
            <h3>{block.title || '🎯 Learning Objectives'}</h3>
          </div>
          <p className="text-xs text-indigo-700/80 mb-4">By the end of this lesson, you will be able to:</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800 bg-white/80 p-3 rounded-xl border border-indigo-50 shadow-2xs">
                <CheckCircle2 size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case 'terminology': {
      const terms: Array<{ term: string; definition: string }> = Array.isArray(rawContent)
        ? rawContent
        : [];
      return (
        <div className="my-6 p-6 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-base">
            <BookOpen size={18} className="text-indigo-600" />
            <h3>{block.title || '📌 Key Terminology'}</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {terms.map((t, i) => (
              <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-indigo-900 text-sm block mb-1">{t.term}</span>
                <span className="text-xs text-slate-600 leading-relaxed block">{t.definition}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'tip':
      return (
        <div className="my-6 p-5 rounded-2xl border-l-4 border-emerald-500 bg-emerald-50/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={18} className="text-emerald-600 flex-shrink-0" />
            <h4 className="font-bold text-emerald-900 text-sm sm:text-base">{block.title || '💡 Pro Tip & Best Practice'}</h4>
          </div>
          <div className="text-emerald-800 text-sm leading-relaxed">{contentStr}</div>
        </div>
      );

    case 'warning':
      return (
        <div className="my-6 p-5 rounded-2xl border-l-4 border-amber-500 bg-amber-50/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
            <h4 className="font-bold text-amber-900 text-sm sm:text-base">{block.title || '⚠️ Common Mistake / Watch Out'}</h4>
          </div>
          <div className="text-amber-800 text-sm leading-relaxed">{contentStr}</div>
        </div>
      );

    case 'list': {
      const items: string[] = Array.isArray(rawContent)
        ? rawContent
        : typeof rawContent === 'string'
        ? rawContent.split('\n').filter(Boolean)
        : [];
      return (
        <div className="my-5">
          {block.title && <h4 className="font-bold text-slate-900 text-base mb-3">{block.title}</h4>}
          <ul className="space-y-2.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 text-sm sm:text-base">
                <span className="mt-2 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case 'example':
      return (
        <div className="my-6 p-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-blue-100">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-2xs">
              Ex
            </div>
            <h4 className="font-bold text-blue-900 text-sm sm:text-base">{block.title || '🏢 Real-World Industry Application'}</h4>
          </div>
          <div className="text-slate-800 text-sm leading-relaxed">{contentStr}</div>
        </div>
      );

    case 'summary': {
      const summaryItems: string[] = Array.isArray(rawContent)
        ? rawContent
        : typeof rawContent === 'string'
        ? rawContent.split('\n').filter(Boolean)
        : [];
      return (
        <div className="my-8 p-6 rounded-2xl bg-slate-900 text-white shadow-lg">
          <div className="flex items-center gap-2.5 mb-3 text-emerald-400 font-bold text-base">
            <CheckSquare size={20} />
            <h3>{block.title || '📝 Lesson Summary & What You Learned'}</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Key takeaways to remember from this lesson:</p>
          <ul className="space-y-2.5">
            {summaryItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    case 'text':
    default:
      return (
        <div className="text-slate-700 leading-relaxed text-sm sm:text-base space-y-4">
          {Array.isArray(block.content)
            ? block.content.map((p: string, i: number) => <p key={i}>{p}</p>)
            : <p>{block.content as string}</p>}
        </div>
      );
  }
}

/**
 * Subcomponent for rendering individual practice exercises with collapsible solution
 */
function PracticeExerciseCard({ exercise, defaultOpen }: { exercise: { level: string; q: string; a: string }; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || false);

  React.useEffect(() => {
    if (defaultOpen !== undefined) {
      setOpen(defaultOpen);
    }
  }, [defaultOpen]);

  const levelBadge = {
    Beginner: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
    Challenge: 'bg-purple-100 text-purple-800 border-purple-200'
  }[exercise.level] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="bg-white rounded-xl border border-indigo-100 p-4 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${levelBadge}`}>
          {exercise.level} Level
        </span>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          {open ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>

      <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-3">
        {exercise.q}
      </p>

      {open && (
        <div className="mt-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 font-sans flex items-center gap-1">
            <CheckCircle2 size={13} /> Official Solution:
          </div>
          {exercise.a}
        </div>
      )}
    </div>
  );
}
