import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../data/translations.js';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'tiles-survive-guide-language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'en');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => translations[language]?.[key] || translations.en[key] || key;

    return {
      language,
      setLanguage,
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
