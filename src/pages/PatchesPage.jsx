import { ExternalLink, Newspaper, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getOfficialPatchFeedUrl, getPatchNotes, getSiteContentSnapshot, subscribeToSiteContent } from '../services/siteContent.js';
import { useLocalizedContent } from '../hooks/useLocalizedContent.js';

const normalizeDateLocale = (locale) => {
  if (!locale) {
    return null;
  }

  const lowerLocale = locale.toLowerCase();
  if (lowerLocale.startsWith('de')) {
    return 'de-DE';
  }
  if (lowerLocale.startsWith('en-gb') || lowerLocale.startsWith('en-au') || lowerLocale.startsWith('en-ca')) {
    return 'en-GB';
  }
  if (lowerLocale.startsWith('en')) {
    return 'en-US';
  }

  return locale;
};

const readCookie = (name) => {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(name + '='))
    ?.split('=')[1] || null;
};

const readGoogleTranslateLocale = () => {
  const rawCookie = readCookie('googtrans');
  if (!rawCookie) {
    return null;
  }

  const languageCode = decodeURIComponent(rawCookie).split('/').filter(Boolean).pop();
  return normalizeDateLocale(languageCode);
};

const readBrowserTranslationLocale = () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const translatedTo = document.querySelector('meta[http-equiv="X-Translated-To"]')?.content;
  const translatedHtmlLang = document.documentElement.getAttribute('lang');
  return normalizeDateLocale(translatedTo || translatedHtmlLang);
};

const getDateLocale = (language) => {
  const appLocale = normalizeDateLocale(language);
  if (appLocale && appLocale !== 'en-US') {
    return appLocale;
  }

  const googleTranslateLocale = readGoogleTranslateLocale();
  if (googleTranslateLocale && googleTranslateLocale !== 'en-US') {
    return googleTranslateLocale;
  }

  const translatedLocale = readBrowserTranslationLocale();
  if (translatedLocale && translatedLocale !== 'en-US') {
    return translatedLocale;
  }

  if (typeof navigator !== 'undefined') {
    const browserLocale = normalizeDateLocale(navigator.languages?.[0] || navigator.language);
    if (browserLocale) {
      return browserLocale;
    }
  }

  return 'en-US';
};

const formatPatchDate = (date, locale) => new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date(`${date}T12:00:00`));

export default function PatchesPage() {
  const { language, t } = useLanguage();
  const { localize } = useLocalizedContent();
  useSyncExternalStore(subscribeToSiteContent, getSiteContentSnapshot, () => '');
  const patchNotes = getPatchNotes();
  const officialPatchFeedUrl = getOfficialPatchFeedUrl();
  const [activeVersion, setActiveVersion] = useState(patchNotes[0]?.id);
  const [dateLocale, setDateLocale] = useState(() => getDateLocale(language));
  const detailRef = useRef(null);

  const activePatch = useMemo(() => patchNotes.find((patch) => patch.id === activeVersion) || patchNotes[0], [activeVersion, patchNotes]);

  useEffect(() => {
    if (!activeVersion && patchNotes[0]?.id) {
      setActiveVersion(patchNotes[0].id);
    }
  }, [activeVersion, patchNotes]);

  useEffect(() => {
    const syncDateLocale = () => setDateLocale(getDateLocale(language));
    syncDateLocale();

    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
      return undefined;
    }

    window.addEventListener('tiles-survive-translation-change', syncDateLocale);
    const intervalId = window.setInterval(syncDateLocale, 1000);

    const observer = new MutationObserver(syncDateLocale);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    observer.observe(document.head, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      window.clearInterval(intervalId);
      window.removeEventListener('tiles-survive-translation-change', syncDateLocale);
    };
  }, [language]);

  const showPatchDetails = (patchId) => {
    setActiveVersion(patchId);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      detailRef.current?.focus({ preventScroll: true });
    });
  };

  if (!patchNotes.length || !activePatch) {
    return (
      <div className="page-shell patch-page">
        <section className="patch-hero">
          <div>
            <p className="eyebrow">{t('patchesEyebrow')}</p>
            <h1>{t('patchesTitle')}</h1>
            <p>{t('comingSoon')}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell patch-page">
      <section className="patch-hero">
        <div>
          <p className="eyebrow">{t('patchesEyebrow')}</p>
          <h1>{t('patchesTitle')}</h1>
          <p>{t('patchesIntro')}</p>
        </div>
        <a className="patch-feed-link" href={officialPatchFeedUrl} target="_blank" rel="noreferrer">
          <RefreshCw size={18} aria-hidden="true" />
          <span>{t('patchesCheckLatest')}</span>
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </section>

      <section className="patch-latest-strip" aria-label={t('patchesLatest')}>
        <div>
          <span>{t('patchesLatest')}</span>
          <strong>{patchNotes[0].version}</strong>
        </div>
        <p>{formatPatchDate(patchNotes[0].date, dateLocale)} - {localize(patchNotes[0].title)}</p>
      </section>

      <section className="patch-layout">
        <aside className="patch-timeline" aria-label={t('patchesTimeline')}>
          {patchNotes.map((patch) => (
            <button
              className={patch.id === activePatch.id ? 'patch-timeline-item is-active' : 'patch-timeline-item'}
              key={patch.id}
              type="button"
              onClick={() => showPatchDetails(patch.id)}
            >
              <span>{patch.version}</span>
              <small>{formatPatchDate(patch.date, dateLocale)}</small>
            </button>
          ))}
        </aside>

        <article className="patch-detail-panel" ref={detailRef} tabIndex={-1}>
          <div className="patch-detail-heading">
            <div>
              <p className="eyebrow">{formatPatchDate(activePatch.date, dateLocale)}</p>
              <h2>{activePatch.version}: {localize(activePatch.title)}</h2>
            </div>
            <a className="icon-text-link" href={activePatch.url} target="_blank" rel="noreferrer">
              <ExternalLink size={17} aria-hidden="true" />
              {t('patchesOriginal')}
            </a>
          </div>

          <p className="patch-summary">{localize(activePatch.summary)}</p>

          <div className="patch-tags" aria-label={t('topics')}>
            {activePatch.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="patch-highlights">
            <h3>{t('patchesHighlights')}</h3>
            <ul>
              {localize(activePatch.highlights).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </article>
      </section>

      <section className="patch-list-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">{t('patchesArchive')}</p>
            <h2>{t('patchesAll')}</h2>
          </div>
        </div>
        <div className="patch-card-grid">
          {patchNotes.map((patch) => (
            <article className="patch-card" key={patch.id}>
              <div className="patch-card-top">
                <Newspaper size={18} aria-hidden="true" />
                <span>{patch.version}</span>
              </div>
              <h3>{localize(patch.title)}</h3>
              <p>{localize(patch.summary)}</p>
              <div className="patch-card-footer">
                <time dateTime={patch.date}>{formatPatchDate(patch.date, dateLocale)}</time>
                <button type="button" onClick={() => showPatchDetails(patch.id)}>{t('details')}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}





