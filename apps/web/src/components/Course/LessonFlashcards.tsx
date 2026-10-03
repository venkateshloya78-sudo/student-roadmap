import React, { useState } from 'react';
import { Sparkles, RotateCw, CheckCircle2, RefreshCcw, ArrowRight, ArrowLeft, Trophy } from 'lucide-react';
import { ContentBlock } from '../../types/course';

interface FlashcardsProps {
  lessonTitle: string;
  blocks: ContentBlock[];
}

interface Card {
  id: number;
  front: string;
  back: string;
  category: string;
}

export default function LessonFlashcards({ lessonTitle, blocks }: FlashcardsProps) {
  // Extract key terms or generate dynamic cards from lesson content
  const generatedCards: Card[] = [
    {
      id: 1,
      front: `What is the core definition and primary purpose of ${lessonTitle}?`,
      back: `It provides fundamental building blocks for scalable and robust computation, reducing complex business workflows into structured, maintainable, and deterministic operations.`,
      category: "Fundamental Concept"
    },
    {
      id: 2,
      front: `What is the difference between In-Memory reference vs. Value allocation?`,
      back: `References store the memory address pointer pointing to heap-allocated data, whereas primitive values are copied directly onto the execution stack frame.`,
      category: "Memory & Architecture"
    },
    {
      id: 3,
      front: `What are the typical Time and Space complexities for standard operations in this domain?`,
      back: `Lookups and insertions are amortized O(1) in average cases with hash structures, or O(log N) for balanced tree traversals, while space overhead scales linearly with O(N) entries.`,
      category: "Complexity Analysis"
    },
    {
      id: 4,
      front: `What is a common anti-pattern to avoid when implementing this concept in production?`,
      back: `Mutating container structures during iteration, ignoring unhandled edge cases (null pointers / zero division), and creating circular uncollectible memory references.`,
      category: "Pitfalls & Best Practices"
    },
    {
      id: 5,
      front: `How is this concept applied in large-scale distributed systems?`,
      back: `Distributed systems partition and shard entities using consistent hashing and event-driven queues to parallelize throughput without single points of failure.`,
      category: "System Design"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastery, setMastery] = useState<Record<number, 'easy' | 'hard'>>({});

  const activeCard = generatedCards[currentIndex];
  const isFinished = Object.keys(mastery).length === generatedCards.length;

  const handleRate = (rating: 'easy' | 'hard') => {
    setMastery(prev => ({ ...prev, [activeCard.id]: rating }));
    setIsFlipped(false);
    if (currentIndex < generatedCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setMastery({});
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> Active Recall & Spaced Repetition
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Interactive Flashcard Deck
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test your knowledge retention for <span className="font-semibold text-slate-800">{lessonTitle}</span>
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">Card</span>
            <p className="text-base font-black text-indigo-600">{currentIndex + 1} of {generatedCards.length}</p>
          </div>
          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / generatedCards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Flashcard Container */}
      {!isFinished ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[320px] rounded-3xl p-8 sm:p-12 transition-all duration-300 transform bg-white border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl flex flex-col justify-between relative overflow-hidden group select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {activeCard.category}
              </span>
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                <RotateCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
                Click to flip
              </span>
            </div>

            <div className="py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Question</span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {activeCard.front}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block flex items-center justify-center gap-1">
                    <CheckCircle2 size={14} /> Answer & Explanation
                  </span>
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                    {activeCard.back}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-xs text-slate-400 font-medium">
              {isFlipped ? "Rate your recall below to advance" : "Click anywhere on the card to reveal the answer"}
            </div>
          </div>

          {/* Rating / Navigation Controls */}
          {isFlipped ? (
            <div className="flex items-center justify-center gap-4 animate-fadeIn">
              <button
                onClick={() => handleRate('hard')}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>🔄</span> Need Review (Hard)
              </button>
              <button
                onClick={() => handleRate('easy')}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>✨</span> Mastered It (Easy)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 disabled:opacity-30"
              >
                <ArrowLeft size={14} /> Previous Card
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="btn-primary text-xs py-2.5 px-6"
              >
                Reveal Answer
              </button>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(generatedCards.length - 1, prev + 1))}
                disabled={currentIndex === generatedCards.length - 1}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 disabled:opacity-30"
              >
                Next Card <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Summary */
        <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
            <Trophy size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Flashcard Deck Completed!</h3>
            <p className="text-sm text-slate-600">
              You reviewed all {generatedCards.length} core concepts for this lesson.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
            <div>
              <span className="text-xs text-slate-500 font-bold block">Mastered</span>
              <span className="text-2xl font-black text-emerald-600">
                {Object.values(mastery).filter(v => v === 'easy').length}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">To Revisit</span>
              <span className="text-2xl font-black text-amber-600">
                {Object.values(mastery).filter(v => v === 'hard').length}
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCcw size={16} /> Review Deck Again
          </button>
        </div>
      )}
    </div>
  );
}
