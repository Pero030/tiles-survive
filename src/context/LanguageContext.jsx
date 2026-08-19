import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { applyContentOverrides, getContentOverridesSnapshot, subscribeToContentOverrides } from '../features/admin/contentOverrides.js';
import { getSiteContentSnapshot, getTranslations, subscribeToSiteContent } from '../services/siteContent.js';

const LanguageContext = createContext(null);
const defaultLanguage = 'en';

const subscribeToLanguageContent = (callback) => {
  const unsubscribeOverrides = subscribeToContentOverrides(callback);
  const unsubscribeSiteContent = subscribeToSiteContent(callback);

  return () => {
    unsubscribeOverrides();
    unsubscribeSiteContent();
  };
};

const getLanguageSnapshot = () => `${getSiteContentSnapshot()}|${getContentOverridesSnapshot()}`;

export function LanguageProvider({ children }) {
  const contentSnapshot = useSyncExternalStore(subscribeToLanguageContent, getLanguageSnapshot, () => '');

  useEffect(() => {
    document.documentElement.lang = defaultLanguage;
  }, []);

  const value = useMemo(() => {
    const activeTranslations = applyContentOverrides('translations', getTranslations());
    const t = (key) => activeTranslations[defaultLanguage]?.[key] || key;

    return {
      language: defaultLanguage,
      t,
    };
  }, [contentSnapshot]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}
