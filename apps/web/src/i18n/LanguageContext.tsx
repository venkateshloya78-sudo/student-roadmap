import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LanguageCode, LanguageInfo, SUPPORTED_LANGUAGES } from './types';
import { translations, en } from './translations';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  languageInfo: LanguageInfo;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallbackOrParams?: string | Record<string, any>, params?: Record<string, any>) => string;
  languages: LanguageInfo[];
}

const STORAGE_KEY = 'srm_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (saved && translations[saved]) {
        return saved;
      }
    } catch {}
    return 'en';
  });

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const setLanguage = useCallback((code: LanguageCode) => {
    if (translations[code]) {
      setCurrentLanguageState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
        document.documentElement.lang = code;
        window.dispatchEvent(new CustomEvent('srm_language_change', { detail: code }));
      } catch {}
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = useCallback((
    key: string,
    fallbackOrParams?: string | Record<string, any>,
    params?: Record<string, any>
  ): string => {
    let fallbackText: string | undefined;
    let interpolationParams: Record<string, any> | undefined;

    if (typeof fallbackOrParams === 'string') {
      fallbackText = fallbackOrParams;
      interpolationParams = params;
    } else if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      interpolationParams = fallbackOrParams;
    }

    // 1. Look in active language dictionary
    const dict = translations[currentLanguage];
    let template = dict?.[key];

    // 2. Fall back to English dictionary if missing
    if (!template) {
      template = en[key];
    }

    // 3. Fall back to custom fallback or key itself
    if (!template) {
      template = fallbackText || key;
    }

    // 4. Interpolate variables like {name}
    if (interpolationParams && typeof template === 'string') {
      return template.replace(/\{(\w+)\}/g, (_, placeholder) => {
        return interpolationParams?.[placeholder] !== undefined ? String(interpolationParams[placeholder]) : `{${placeholder}}`;
      });
    }

    return template;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        languageInfo,
        setLanguage,
        t,
        languages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
