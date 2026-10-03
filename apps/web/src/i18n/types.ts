/**
 * types.ts - Multi-Language i18n Type Definitions
 */

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr' | 'bn';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;        // English name, e.g. "Telugu"
  nativeName: string;  // Native script, e.g. "తెలుగు"
  flagEmoji: string;   // Visual indicator
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English', flagEmoji: '🇬🇧' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagEmoji: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagEmoji: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flagEmoji: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flagEmoji: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flagEmoji: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flagEmoji: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flagEmoji: '🇮🇳' },
];

export type TranslationDictionary = Record<string, string>;
