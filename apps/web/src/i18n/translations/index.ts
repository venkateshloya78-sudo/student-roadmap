import { LanguageCode, TranslationDictionary } from '../types';
import { en } from './en';
import { te } from './te';
import { hi } from './hi';
import { ta } from './ta';
import { kn } from './kn';
import { ml } from './ml';
import { mr } from './mr';
import { bn } from './bn';

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en,
  te,
  hi,
  ta,
  kn,
  ml,
  mr,
  bn,
};

export { en, te, hi, ta, kn, ml, mr, bn };
