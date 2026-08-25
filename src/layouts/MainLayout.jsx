import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const readSavedTranslationLanguage = () => {
  const storedLanguage = String(window.localStorage.getItem('tiles-survive-language') || '').toLowerCase();
  if (storedLanguage) return storedLanguage;
  const cookieMatch = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  return cookieMatch ? decodeURIComponent(cookieMatch[1]).split('/').filter(Boolean).pop()?.toLowerCase() || '' : '';
};

const setPendingForSavedTranslation = () => {
  const language = readSavedTranslationLanguage();
  const shouldWaitForTranslation = Boolean(language && language !== 'en');
  document.documentElement.classList.toggle('translation-pending', shouldWaitForTranslation);
  return shouldWaitForTranslation;
};

export function MainLayout() {
  const { t } = useLanguage();
  const location = useLocation();

  useLayoutEffect(() => {
    let timeoutId;
    try {
      const shouldWaitForTranslation = setPendingForSavedTranslation();
      if (shouldWaitForTranslation) {
        timeoutId = window.setTimeout(() => {
          document.documentElement.classList.remove('translation-pending');
        }, 2400);
      }
    } catch (error) {
      document.documentElement.classList.remove('translation-pending');
    }

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname]);


  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}





