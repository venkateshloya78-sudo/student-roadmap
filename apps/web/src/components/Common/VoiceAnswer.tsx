import React, { useEffect, useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  Square,
  Sparkles
} from 'lucide-react';
import { speechService, SpeechState } from '../../lib/speechService';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAutoVoice } from '../../hooks/useAutoVoice';

export interface VoiceAnswerProps {
  /** Unique ID for this answer/response */
  id: string;
  /** The text or markdown content of the AI response to speak */
  text: string;
  /** Language code (defaults to currentLanguage from useLanguage context) */
  lang?: string;
  /** If true and Auto Voice is enabled in settings, speaks automatically when rendered */
  autoPlay?: boolean;
  /** Compact style for tighter layouts (e.g., quiz result cards or floating widget) */
  compact?: boolean;
  /** Optional custom CSS classes */
  className?: string;
  /** Optional label banner above controls */
  showBanner?: boolean;
}

const SPEED_OPTIONS = [0.75, 1.0, 1.25, 1.5];

export const VoiceAnswer: React.FC<VoiceAnswerProps> = ({
  id,
  text,
  lang,
  autoPlay = false,
  compact = false,
  className = '',
  showBanner = false,
}) => {
  const { currentLanguage } = useLanguage();
  const { autoVoice } = useAutoVoice();
  const effectiveLang = lang || currentLanguage || 'en';

  const [speechState, setSpeechState] = useState<SpeechState>(() => speechService.getState());
  const [selectedSpeed, setSelectedSpeed] = useState<number>(() => speechService.getRate() || 1.0);
  const autoPlayedRef = useRef<boolean>(false);

  // Subscribe to speechService updates
  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setSpeechState(state);
      if (state.rate) {
        setSelectedSpeed(state.rate);
      }
    });
    return unsubscribe;
  }, []);

  const isCurrentActive = speechState.activeId === id;
  const isPlaying = isCurrentActive && speechState.status === 'playing';
  const isPaused = isCurrentActive && speechState.status === 'paused';

  // Handle Auto Voice if enabled in settings
  useEffect(() => {
    if (autoPlay && autoVoice && text && !autoPlayedRef.current) {
      autoPlayedRef.current = true;
      // Slight delay to allow DOM transition / streaming completion
      const timer = setTimeout(() => {
        handleListen();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, autoVoice, text]);

  const handleListen = () => {
    if (!text.trim()) return;

    if (isPaused) {
      speechService.resume();
      return;
    }

    if (isPlaying) {
      // Already playing this answer
      return;
    }

    speechService.play(id, text, {
      rate: selectedSpeed,
      lang: effectiveLang,
    });
  };

  const handlePause = () => {
    if (isPlaying) {
      speechService.pause();
    }
  };

  const handleResume = () => {
    if (isPaused) {
      speechService.resume();
    } else {
      handleListen();
    }
  };

  const handleStop = () => {
    if (isCurrentActive) {
      speechService.stop();
    }
  };

  const handleReplay = () => {
    if (!text.trim()) return;
    speechService.replay(id, text, {
      rate: selectedSpeed,
      lang: effectiveLang,
    });
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    speechService.setRate(speed);
  };

  return (
    <div
      className={`rounded-xl transition-all duration-200 select-none ${
        compact
          ? 'py-2 px-2.5 bg-slate-50 border border-slate-200'
          : 'py-2.5 px-3.5 bg-slate-50/90 border border-slate-200/90 shadow-2xs'
      } ${
        isPlaying
          ? 'ring-2 ring-indigo-500/30 border-indigo-300 bg-indigo-50/30'
          : ''
      } ${className}`}
    >
      {showBanner && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/70 text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-slate-700">AI Voice Answer</span>
          </div>
          {isPlaying && (
            <span className="flex items-center gap-1 text-indigo-600 font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              Speaking...
            </span>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3">
        {/* Playback action controls: Listen | Pause | Stop | Replay */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* 🔊 Listen / Resume Button */}
          {!isPlaying && !isPaused && (
            <button
              type="button"
              onClick={handleListen}
              className={`inline-flex items-center gap-1.5 rounded-lg font-bold transition-all shadow-2xs ${
                compact
                  ? 'px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              }`}
              title="Listen to this AI answer aloud"
            >
              <Volume2 className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              <span>🔊 Listen</span>
            </button>
          )}

          {/* Playing state with visual speaking wave indicator */}
          {isPlaying && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-sm">
              {/* Sound wave visualizer animation */}
              <div className="flex items-center gap-0.5 h-3.5 px-0.5" title="Playing voice answer">
                <span className="w-0.5 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-0.5 h-4 bg-white rounded-full animate-pulse [animation-delay:0.15s]" />
                <span className="w-0.5 h-2 bg-white rounded-full animate-pulse [animation-delay:0.3s]" />
                <span className="w-0.5 h-3.5 bg-white rounded-full animate-pulse [animation-delay:0.45s]" />
              </div>
              <span>Speaking</span>
            </div>
          )}

          {/* ⏸ Pause Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={handlePause}
              className={`inline-flex items-center gap-1 rounded-lg font-medium transition-colors border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 ${
                compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
              }`}
              title="Pause voice playback"
            >
              <Pause className="w-3.5 h-3.5 text-slate-600" />
              <span>⏸ Pause</span>
            </button>
          )}

          {/* ▶ Resume Button when paused */}
          {isPaused && (
            <button
              type="button"
              onClick={handleResume}
              className={`inline-flex items-center gap-1 rounded-lg font-bold transition-colors bg-emerald-600 hover:bg-emerald-700 text-white ${
                compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
              }`}
              title="Resume voice playback"
            >
              <Play className="w-3.5 h-3.5 text-white" />
              <span>▶ Resume</span>
            </button>
          )}

          {/* ⏹ Stop Button (visible whenever active or paused) */}
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleStop}
              className={`inline-flex items-center gap-1 rounded-lg font-medium transition-colors border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 ${
                compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
              }`}
              title="Stop voice playback"
            >
              <Square className="w-3 h-3 text-rose-600 fill-current" />
              <span>⏹ Stop</span>
            </button>
          )}

          {/* 🔁 Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            className={`inline-flex items-center gap-1 rounded-lg font-medium transition-colors border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 ${
              compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs'
            }`}
            title="Replay this answer from start"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>🔁 Replay</span>
          </button>
        </div>

        {/* Speed Controls: 0.75x | 1x | 1.25x | 1.5x */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span className="font-semibold text-slate-600 mr-0.5">Speed:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            {SPEED_OPTIONS.map((speed) => {
              const isSelected = Math.abs(selectedSpeed - speed) < 0.05;
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                  }`}
                  title={`Play at ${speed}x speed`}
                >
                  {speed}x
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAnswer;
