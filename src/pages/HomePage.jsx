import { CalendarDays, CircleHelp, Hammer, Handshake, Landmark, Map, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { assetPath } from '../utils/assetPath.js';
import { GuideCard } from '../components/ui/GuideCard.jsx';
import { SearchBar } from '../components/ui/SearchBar.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { contentRepository } from '../features/admin/contentRepository.js';

const icons = { CalendarDays, CircleHelp, Hammer, Handshake, Landmark, Map, Shield, Sparkles };

function sectionTitle(id) {
  const labels = {
    events: 'navEvents',
    heroes: 'navHeroes',
    villages: 'navVillages',
    alliance: 'navAlliance',
    buildings: 'navBuildings',
    'world-map': 'navWorldMap',
    tips: 'navTips',
    faq: 'navFaq',
  };
  return labels[id];
}

function HomePage() {
  const { t } = useLanguage();
  const entries = contentRepository.listEntries();
  const guideSections = contentRepository.listSections();
  const latest = [...entries]
    .sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt))
    .slice(0, 6);

  return (
    <>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(237, 249, 231, .96) 0%, rgba(237, 249, 231, .84) 38%, rgba(237, 249, 231, .1) 72%), url(${assetPath('r2://images/hero-guide.png')})` }}>
        <div className="hero-content">
          <p className="eyebrow">Tiles Survive Guide HQ</p>
          <h1>{t('heroTitle')}</h1>
          <p>{t('heroCopy')}</p>
        </div>
      </section>

      <div className="page-shell">
        <SearchBar />

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{t('categories')}</p>
            <h2>{t('categories')}</h2>
          </div>
          <div className="category-grid">
            {guideSections.map((section) => {
              const Icon = icons[section.icon];
              return (
                <Link className="category-tile" to={section.route} key={section.id}>
                  <Icon size={24} aria-hidden="true" />
                  <span>{t(sectionTitle(section.id))}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <p className="eyebrow">{t('latestContent')}</p>
            <h2>{t('latestContent')}</h2>
          </div>
          <div className="card-grid">
            {latest.map((entry) => (
              <GuideCard entry={entry} key={entry.id} />
            ))}
          </div>
        </section>

      </div>
    </>
  );
}

export default HomePage;
