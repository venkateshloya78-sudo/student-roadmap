import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, Sparkles, BookOpen, ShieldCheck, Printer, Check } from 'lucide-react';
import { ContentBlock } from '../../types/course';
import { generateAndDownloadLessonPDF } from '../../lib/pdfGenerator';

interface ExportNotesProps {
  lessonTitle: string;
  courseTitle: string;
  lessonNumber?: number;
  moduleTitle?: string;
  estimatedMinutes?: number;
  blocks: ContentBlock[];
}

export default function ExportNotesModal({
  lessonTitle,
  courseTitle,
  lessonNumber = 1,
  moduleTitle,
  estimatedMinutes,
  blocks
}: ExportNotesProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        generateAndDownloadLessonPDF({
          courseTitle,
          lessonTitle,
          lessonNumber,
          moduleTitle,
          estimatedMinutes,
          blocks
        });
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      } catch (err) {
        console.error("PDF generation error:", err);
      } finally {
        setIsGenerating(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Instant PDF Download */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 border border-indigo-500/30">
              <Sparkles size={12} /> Official PDF Notes Generator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Download Full Study Notes as PDF
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Export complete textbook-grade notes for <strong className="text-white font-semibold">{lessonTitle}</strong> as a multi-page, print-ready PDF with clean typography, code snippets, callout boxes, and running page numbers.
            </p>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className={`px-6 py-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Multi-Page PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 size={20} className="text-white" />
                  <span>✓ PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>📥 Download Notes as PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Features Specification Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-3">
            📑
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Multi-Page Pagination</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Content flows naturally across multiple pages without cutting off sentences or blocks.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-3">
            💻
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Formatted Code Blocks</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Monospace syntax styling with line numbers and output blocks formatted with dark backgrounds.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3">
            💡
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Visual Callout Boxes</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pro Tips, Common Pitfalls, and Real-World Examples formatted in distinct shaded callout containers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
            🔒
          </div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">100% In-Browser & Safe</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Directly saved as a native <code>.pdf</code> file to your device without opening in external text editors.
          </p>
        </div>
      </div>

      {/* Document Information & Quick Preview Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Document Summary & Metadata</h3>
            <p className="text-xs text-slate-500">The PDF will be generated with the following structured sections</p>
          </div>
          <span className="badge bg-emerald-50 text-emerald-700 font-bold text-xs">
            Ready to Download
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 font-bold block mb-0.5">COURSE / TRACK</span>
            <span className="font-bold text-slate-800">{courseTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block mb-0.5">LESSON TOPIC</span>
            <span className="font-bold text-slate-800">{lessonTitle}</span>
          </div>
          <div>
            <span className="text-slate-400 font-bold block mb-0.5">STRUCTURED BLOCKS</span>
            <span className="font-bold text-slate-800">{blocks.length} sections included</span>
          </div>
        </div>

        {/* Content Table of Contents */}
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Table of Contents in Downloaded PDF:
          </h4>
          <div className="space-y-2">
            {blocks.map((b, idx) => {
              const preview = Array.isArray(b.content) ? b.content[0] : String(b.content || '');
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {b.type === 'heading' ? 'Section: ' : b.type + ': '}
                    </span>
                    <span className="text-slate-600 truncate">{b.title || preview.substring(0, 60)}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px] uppercase flex-shrink-0 ml-2">
                    {b.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Download CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            Filename: <code className="text-indigo-600 font-bold">{(lessonTitle || 'notes').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notes.pdf</code>
          </p>
          <button
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="btn-primary text-xs py-3 px-6 bg-indigo-600 hover:bg-indigo-500 flex items-center gap-2 shadow-md shadow-indigo-600/20 w-full sm:w-auto justify-center"
          >
            <Download size={15} />
            <span>Download Notes as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
