import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations } from '../data/translations.js';

const LanguageContext = createContext(null);

function getBrowserLanguage() {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function LanguageProvider({ children }) {
  const [language] = useState(getBrowserLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const t = (key) => translations[language]?.[key] || translations.en[key] || key;

    return {
      language,
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
