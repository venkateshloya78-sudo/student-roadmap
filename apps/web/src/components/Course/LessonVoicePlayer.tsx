import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, Square, FastForward, Sparkles, Headphones } from 'lucide-react';
import { ContentBlock } from '../../types/course';
import { speechService } from '../../lib/speechService';

interface LessonVoicePlayerProps {
  lessonTitle: string;
  courseTitle: string;
  moduleTitle?: string;
  lessonNumber?: number;
  estimatedMinutes?: number;
  blocks: ContentBlock[];
}

export default function LessonVoicePlayer({
  lessonTitle,
  courseTitle,
  moduleTitle,
  lessonNumber,
  estimatedMinutes,
  blocks
}: LessonVoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [totalSentences, setTotalSentences] = useState(0);
  const [currentSentenceText, setCurrentSentenceText] = useState('');
  const [speed, setSpeed] = useState<number>(1.0);

  // Stop playback when unmounting or switching lessons
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, [lessonTitle]);

  // Construct complete readable matter from all lesson blocks
  const compileFullLessonMatter = useCallback((): string => {
    const parts: string[] = [];

    // Introduction
    parts.push(
      `Welcome to this lesson on ${lessonTitle}. This is part of the course ${courseTitle}, ${
        moduleTitle ? 'under ' + moduleTitle : ''
      }. ${estimatedMinutes ? `Estimated reading time is ${estimatedMinutes} minutes.` : ''} Let us begin.`
    );

    // Iterate through all content blocks to extract complete matter
    for (const block of blocks) {
      if (!block) continue;

      if (block.type === 'heading') {
        const title = block.title || (typeof block.content === 'string' ? block.content : '');
        if (title) parts.push(`Section: ${title}.`);
      } else if (block.type === 'text') {
        if (typeof block.content === 'string' && block.content.trim()) {
          parts.push(block.content.trim());
        } else if (Array.isArray(block.content)) {
          parts.push(block.content.join(' '));
        }
      } else if (block.type === 'tip') {
        const text = typeof block.content === 'string' ? block.content : block.content?.join(' ');
        if (text) parts.push(`Important Tip: ${text}`);
      } else if (block.type === 'warning') {
        const text = typeof block.content === 'string' ? block.content : block.content?.join(' ');
        if (text) parts.push(`Common mistake to watch out for: ${text}`);
      } else if (block.type === 'list') {
        if (block.title) parts.push(`Key items for ${block.title}:`);
        if (Array.isArray(block.content)) {
          block.content.forEach((item, idx) => {
            parts.push(`Point ${idx + 1}: ${item}`);
          });
        } else if (typeof block.content === 'string') {
          parts.push(block.content);
        }
      } else if (block.type === 'example') {
        if (block.title) parts.push(`Real world application: ${block.title}.`);
        const text = typeof block.content === 'string' ? block.content : block.content?.join(' ');
        if (text) parts.push(text);
      } else if (block.type === 'practice') {
        if (block.title) parts.push(`Practice exercise: ${block.title}.`);
        const text = typeof block.content === 'string' ? block.content : block.content?.join(' ');
        if (text) parts.push(text);
      } else if (block.type === 'code') {
        const lang = block.language || 'code';
        parts.push(`Here is a code example written in ${lang}.`);
        if (typeof block.content === 'string') {
          parts.push(block.content);
        } else if (Array.isArray(block.content)) {
          parts.push(block.content.join('\n'));
        }
      }
    }

    // Conclusion
    parts.push(
      `You have reached the end of this lesson on ${lessonTitle}. Great job! You can now review the concepts, try the code playground, or proceed to the next lesson.`
    );

    return parts.join('\n\n');
  }, [lessonTitle, courseTitle, moduleTitle, estimatedMinutes, blocks]);

  const handleStartSpeaking = () => {
    const fullText = compileFullLessonMatter();
    if (!fullText.trim()) return;

    setIsPlaying(true);
    setIsPaused(false);

    speechService.speak(fullText, {
      rate: speed,
      onStart: () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      onSentenceChange: (idx, total, text) => {
        setCurrentSentenceIndex(idx);
        setTotalSentences(total);
        setCurrentSentenceText(text);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(0);
        setCurrentSentenceText('');
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      }
    });
  };

  const handleTogglePause = () => {
    if (isPaused) {
      speechService.resume();
      setIsPaused(false);
    } else {
      speechService.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(0);
    setCurrentSentenceText('');
  };

  const handleChangeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    speechService.setRate(newSpeed);
  };

  const progressPercent = totalSentences > 0 ? Math.round((currentSentenceIndex / totalSentences) * 100) : 0;

  return (
    <div className="w-full">
      {/* Launch / Trigger Bar */}
      {!isPlaying ? (
        <button
          onClick={handleStartSpeaking}
          className="w-full flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-indigo-500 transition-all border border-emerald-400/30 group"
          title="Voice Assistant: Read the entire lesson out loud without stopping"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <Headphones size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base tracking-tight">
                  🔊 Listen to Entire Lesson (Voice Assistant)
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  <Sparkles size={10} /> Full Audio
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                Reads all explanations, notes, key points, and examples aloud without cutoffs for easy listening.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl font-bold text-xs flex-shrink-0">
            <Volume2 size={16} />
            <span>Play Audio</span>
          </div>
        </button>
      ) : (
        /* Active Persistent Voice Player */
        <div className="rounded-2xl border-2 border-emerald-500 bg-white shadow-xl overflow-hidden animate-fadeIn">
          {/* Top Status Bar */}
          <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold truncate">
                {isPaused ? '⏸️ Voice Assistant Paused' : '🔊 Voice Assistant Speaking Lesson Aloud...'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-white/20 px-2 py-0.5 rounded-md">
                Sentence {currentSentenceIndex} of {totalSentences} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Current Sentence Caption Box */}
          <div className="p-4 bg-emerald-50/50 border-b border-emerald-100 min-h-[60px] flex items-center">
            <p className="text-sm font-medium text-slate-800 italic leading-relaxed">
              "{currentSentenceText || 'Preparing audio...'}"
            </p>
          </div>

          {/* Controls Bar */}
          <div className="p-3 bg-white flex flex-wrap items-center justify-between gap-3">
            {/* Play/Pause & Stop */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePause}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {isPaused ? (
                  <>
                    <Play size={14} className="fill-slate-700" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause size={14} />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                title="Stop reading aloud"
              >
                <Square size={13} className="fill-rose-700" />
                <span>Stop</span>
              </button>
            </div>

            {/* Speed Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <FastForward size={12} /> Speed:
              </span>
              {[0.85, 1.0, 1.25, 1.5].map((rateVal) => (
                <button
                  key={rateVal}
                  onClick={() => handleChangeSpeed(rateVal)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    speed === rateVal
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {rateVal}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
