import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="page-shell page-top empty-state">
      <h1>404</h1>
      <p>{t('comingSoon')}</p>
      <Link className="button-link" to="/">
        {t('navHome')}
      </Link>
    </div>
  );
}

export default NotFoundPage;
