import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { getHeroClassBySlug, getHeroImagesBySlug } from '../../services/siteContent.js';
import { useLocalizedContent } from '../../hooks/useLocalizedContent.js';
import { assetPath } from '../../utils/assetPath.js';

export function GuideCard({ entry }) {
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const heroClassBySlug = getHeroClassBySlug();
  const heroImagesBySlug = getHeroImagesBySlug();
  const heroClass = entry.type === 'hero' ? heroClassBySlug[entry.slug] : null;
  const heroImage = entry.type === 'hero' ? entry.image || heroImagesBySlug[entry.slug] : null;
  const cardImage = entry.type === 'hero' ? heroImage : entry.image;
  const typeLabel = t(`type${entry.type.slice(0, 1).toUpperCase()}${entry.type.slice(1)}`);

  return (
    <article className="guide-card">
      {cardImage?.src && (
        <div className={entry.type === 'hero' ? 'hero-card-portrait' : 'guide-card-media'}>
          {cardImage.src ? (
            <img src={assetPath(cardImage.src)} alt={localize(cardImage.alt) || localize(entry.title)} loading="lazy" />
          ) : (
            <span aria-hidden="true">{localize(entry.title)?.slice(0, 1)}</span>
          )}
        </div>
      )}
      <div className="card-kicker">
        <span>{typeLabel}</span>
        {entry.featured && <Star size={16} aria-label="Featured" />}
      </div>
      {heroClass && (
        <div className="hero-card-badges" aria-label={t('heroClass')}>
          <span>{localize(heroClass.classTitle).replace(' Heroes', '').replace('-Helden', '')}</span>
          <span>{heroClass.rarity}</span>
        </div>
      )}
      <h3 translate={entry.type === 'hero' ? 'no' : undefined}>{localize(entry.title)}</h3>
      <p>{localize(entry.summary)}</p>
      <Link className="text-link" to={entry.route}>
        {t('details')}
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}

