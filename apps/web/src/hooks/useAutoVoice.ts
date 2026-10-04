import { useState, useEffect } from 'react';

const AUTOVOICE_KEY = 'srm_autovoice';
const AUTOSPEAK_LEGACY_KEY = 'srm_autospeak';

export function useAutoVoice() {
  const [autoVoice, setAutoVoiceState] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(AUTOVOICE_KEY) ?? localStorage.getItem(AUTOSPEAK_LEGACY_KEY);
      return v === 'true';
    } catch {
      return false;
    }
  });

  const setAutoVoice = (enabled: boolean) => {
    setAutoVoiceState(enabled);
    try {
      localStorage.setItem(AUTOVOICE_KEY, String(enabled));
      localStorage.setItem(AUTOSPEAK_LEGACY_KEY, String(enabled));
      window.dispatchEvent(new CustomEvent('srm_autovoice_change', { detail: enabled }));
    } catch {}
  };

  const toggleAutoVoice = () => {
    setAutoVoice(!autoVoice);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<boolean>;
      if (typeof custom.detail === 'boolean') {
        setAutoVoiceState(custom.detail);
      }
    };
    window.addEventListener('srm_autovoice_change', handler);
    return () => window.removeEventListener('srm_autovoice_change', handler);
  }, []);

  return { autoVoice, setAutoVoice, toggleAutoVoice };
}
