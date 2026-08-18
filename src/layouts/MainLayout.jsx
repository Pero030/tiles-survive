import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export function MainLayout() {
  const { t } = useLanguage();

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
