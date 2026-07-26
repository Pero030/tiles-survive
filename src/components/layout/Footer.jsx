import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <p>{t('footerCopy')}</p>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/heroes">{t('navHeroes')}</Link>
        <Link to="/events">{t('navEvents')}</Link>
        <Link to="/buildings">{t('navBuildings')}</Link>
        <Link to="/tips">{t('navTips')}</Link>
        <Link to="/faq">{t('navFaq')}</Link>
      </nav>
    </footer>
  );
}
