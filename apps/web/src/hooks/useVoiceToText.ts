import { useState, useRef, useCallback, useEffect } from 'react';

export const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

export interface UseVoiceToTextOptions {
  /**
   * Callback fired whenever the transcript updates (both interim and final).
   * Receives the complete, unified transcript for the active recording session.
   */
  onTranscriptChange?: (transcript: string) => void;
  /**
   * Callback fired once when the voice recording concludes and is finalized.
   */
  onFinalTranscript?: (finalTranscript: string) => void;
  /**
   * Whether to clear the text input when starting a new recording. Default: true.
   */
  clearOnStart?: boolean;
  /**
   * Language code (e.g. 'en-US', 'te-IN', 'hi-IN') or short language code ('en', 'te').
   */
  lang?: string;
}

export function useVoiceToText({
  onTranscriptChange,
  onFinalTranscript,
  clearOnStart = true,
  lang = 'en-US',
}: UseVoiceToTextOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const sessionIdRef = useRef<number>(0);
  const finalizedSessionRef = useRef<number | null>(null);
  const lastTranscriptRef = useRef<string>('');
  const isStartingRef = useRef<boolean>(false);

  // Keep callback refs fresh to prevent stale closures without re-subscribing
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  const cleanUpRecognition = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.onstart = null;
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.abort();
      } catch {}
      recognitionRef.current = null;
    }
  }, []);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    const currentSession = sessionIdRef.current;

    setIsListening(false);
    isStartingRef.current = false;

    if (rec) {
      try {
        rec.stop();
      } catch {
        try {
          rec.abort();
        } catch {}
      }
    }

    // Finalize transcript exactly once for this session
    if (currentSession && finalizedSessionRef.current !== currentSession) {
      finalizedSessionRef.current = currentSession;
      const cleanTranscript = lastTranscriptRef.current.trim();
      if (cleanTranscript && onFinalTranscriptRef.current) {
        onFinalTranscriptRef.current(cleanTranscript);
      }
    }

    setIsProcessing(false);
  }, []);

  const startListening = useCallback(() => {
    // Prevent overlapping instances when clicked repeatedly
    if (isStartingRef.current || isListening) {
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.'
      );
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    // Completely tear down any leftover recognition instance
    cleanUpRecognition();

    isStartingRef.current = true;
    setIsProcessing(true);
    setSpeechError(null);

    // Generate unique session ID for this recording
    const sessionId = Date.now();
    sessionIdRef.current = sessionId;
    finalizedSessionRef.current = null;
    lastTranscriptRef.current = '';

    // Clear previous transcript before starting new recording if requested
    if (clearOnStart && onTranscriptChangeRef.current) {
      onTranscriptChangeRef.current('');
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      const speechLang = SPEECH_LANG_MAP[lang] || lang || 'en-US';
      recognition.lang = speechLang;

      recognition.onstart = () => {
        if (sessionIdRef.current !== sessionId) return;
        isStartingRef.current = false;
        setIsListening(true);
        setIsProcessing(false);
      };

      recognition.onresult = (event: any) => {
        if (sessionIdRef.current !== sessionId) return;

        // Separate completed segments and active interim segments
        let finalPart = '';
        let interimPart = '';

        for (let i = 0; i < event.results.length; ++i) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalPart += text + ' ';
          } else {
            interimPart += text;
          }
        }

        // The unified transcript replaces the input — never repeatedly appends to previous state!
        const fullTranscript = (finalPart + interimPart).trim();
        lastTranscriptRef.current = fullTranscript;

        if (onTranscriptChangeRef.current) {
          onTranscriptChangeRef.current(fullTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        if (sessionIdRef.current !== sessionId) return;
        console.warn('Speech recognition notice:', event.error);
        isStartingRef.current = false;
        setIsListening(false);
        setIsProcessing(false);

        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setSpeechError(`Microphone notice: ${event.error}. Please check permissions.`);
          setTimeout(() => setSpeechError(null), 4000);
        }
      };

      recognition.onend = () => {
        if (sessionIdRef.current !== sessionId) return;
        isStartingRef.current = false;
        setIsListening(false);
        setIsProcessing(false);

        // Guarantee final transcript is inserted/finalized exactly once
        if (finalizedSessionRef.current !== sessionId) {
          finalizedSessionRef.current = sessionId;
          const cleanTranscript = lastTranscriptRef.current.trim();
          if (cleanTranscript && onFinalTranscriptRef.current) {
            onFinalTranscriptRef.current(cleanTranscript);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      isStartingRef.current = false;
      setIsListening(false);
      setIsProcessing(false);
      setSpeechError('Microphone initialization failed. Please check device permissions.');
      setTimeout(() => setSpeechError(null), 4000);
    }
  }, [cleanUpRecognition, clearOnStart, isListening, lang]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      sessionIdRef.current = 0;
      cleanUpRecognition();
    };
  }, [cleanUpRecognition]);

  return {
    isListening,
    isProcessing,
    speechError,
    toggleListening,
    startListening,
    stopListening,
  };
}
