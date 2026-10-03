import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'header' | 'sidebar' | 'profile' | 'compact';
  className?: string;
}

export default function LanguageSelector({ variant = 'header', className = '' }: LanguageSelectorProps) {
  const { currentLanguage, languageInfo, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  // Profile Card Variant
  if (variant === 'profile') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Globe size={18} className="text-indigo-600" />
          <span>{t('profile.languageLabel', 'Interface Language')}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{lang.nativeName}</span>
                  {isSelected && <Check size={14} className="text-indigo-600" />}
                </div>
                <span className="text-xs text-slate-500">{lang.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">
          {t('profile.languageHelp', 'Select your preferred language. The entire website interface, lessons, and roadmap will adapt automatically.')}
        </p>
      </div>
    );
  }

  // Sidebar Variant
  if (variant === 'sidebar') {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 transition-all"
          title={t('nav.selectLanguage', 'Select Language')}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Globe size={15} className="text-indigo-600 flex-shrink-0" />
            <span className="truncate">{languageInfo.nativeName} ({languageInfo.name})</span>
          </div>
          <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 mb-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t('nav.selectLanguage', 'Select Language')}
            </div>
            <div className="max-h-60 overflow-y-auto py-1">
              {languages.map((lang) => {
                const isSelected = currentLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-slate-400 text-[11px]">({lang.name})</span>
                    </div>
                    {isSelected && <Check size={14} className="text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Header / Topbar / Compact Variant
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all hover:border-slate-300"
        title={t('nav.selectLanguage', 'Select Language')}
        aria-label="Select Language"
      >
        <Globe size={14} className="text-indigo-600 flex-shrink-0" />
        <span className="hidden sm:inline font-bold">{languageInfo.nativeName}</span>
        <span className="sm:hidden font-bold uppercase">{languageInfo.code}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>{t('nav.selectLanguage', 'Select Language')}</span>
            <span className="text-[10px] lowercase text-indigo-600 font-normal">8 languages</span>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{lang.nativeName}</span>
                    <span className="text-slate-400 text-[11px]">({lang.name})</span>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
