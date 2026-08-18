import { useLanguage } from '../context/LanguageContext.jsx';
import { contentRepository } from '../features/admin/contentRepository.js';
import { useLocalizedContent } from '../hooks/useLocalizedContent.js';

function FaqPage() {
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const items = contentRepository.listFaqItems();

  return (
    <div className="page-shell page-top">
      <div className="section-heading">
        <p className="eyebrow">Tiles Survive</p>
        <h1>{t('navFaq')}</h1>
      </div>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.id}>
            <summary>{localize(item.question)}</summary>
            <p>{localize(item.answer)}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export default FaqPage;
