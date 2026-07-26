import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { contentRepository } from '../../features/admin/contentRepository.js';
import { useLocalizedContent } from '../../hooks/useLocalizedContent.js';
import { searchEntries } from '../../utils/search.js';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const entries = contentRepository.listEntries();
  const results = useMemo(() => searchEntries(entries, query, localize), [entries, query, localize]);

  return (
    <section className="search-panel" aria-label={t('searchResults')}>
      <div className="search-input-wrap">
        <Search size={21} aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} />
      </div>
      {query && (
        <div className="search-results">
          <h2>{t('searchResults')}</h2>
          {results.length ? (
            <ul>
              {results.map((entry) => (
                <li key={entry.id}>
                  <Link to={entry.route}>{localize(entry.title)}</Link>
                  <span>{entry.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>{t('noResults')}</p>
          )}
        </div>
      )}
    </section>
  );
}
