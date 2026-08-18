import { RotateCcw, Save, Search } from 'lucide-react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { getFaqItems, getGuideEntries, getGuideSections, getPatchNotes, getTranslations, getSiteContentSnapshot, subscribeToSiteContent } from '../../services/siteContent.js';
import {
  getContentOverride,
  getContentOverridesSnapshot,
  removeContentOverride,
  setContentOverride,
  subscribeToContentOverrides,
} from './contentOverrides.js';

const getEditableRoots = () => [
  { key: 'translations', label: 'UI Texts', data: getTranslations() },
  { key: 'guideSections', label: 'Guide Categories', data: getGuideSections() },
  { key: 'guideEntries', label: 'Guides', data: getGuideEntries() },
  { key: 'faqItems', label: 'FAQ', data: getFaqItems() },
  { key: 'patchNotes', label: 'Patch Notes', data: getPatchNotes() },
];

const contentFilters = [
  { value: 'all', label: 'All text areas' },
  { value: 'translations', label: 'UI Texts' },
  { value: 'guideSections', label: 'Guide Categories' },
  { value: 'guideEntries:hero', label: 'Heroes' },
  { value: 'guideEntries:event', label: 'Events' },
  { value: 'guideEntries:village', label: 'Villages' },
  { value: 'guideEntries:alliance', label: 'Alliance' },
  { value: 'guideEntries:building', label: 'Buildings' },
  { value: 'guideEntries:map', label: 'World Map' },
  { value: 'guideEntries:tip', label: 'Tips' },
  { value: 'faqItems', label: 'FAQ' },
  { value: 'patchNotes', label: 'Patch Notes' },
];

const blockedKeys = new Set([
  'id',
  'slug',
  'route',
  'url',
  'src',
  'image',
  'icon',
  'type',
  'date',
  'updatedAt',
  'status',
  'version',
]);

const languageKeys = new Set(['en', 'de']);
const editableLanguageKeys = new Set(['en']);

const getDisplayTitle = (value) => {
  if (!value || typeof value !== 'object') {
    return '';
  }

  if (typeof value.title === 'string') {
    return value.title;
  }

  if (value.title?.en) {
    return value.title.en;
  }

  if (value.question?.en) {
    return value.question.en;
  }

  if (value.version) {
    return value.version;
  }

  return value.slug || value.id || '';
};

const getFieldOwner = (parents) => [...parents]
  .reverse()
  .find((parent) => parent && typeof parent === 'object' && !Array.isArray(parent) && (parent.title || parent.question || parent.version || parent.slug || parent.id));

const getOwnerSearchText = (owner) => {
  if (!owner || typeof owner !== 'object') {
    return '';
  }

  return [
    owner.id,
    owner.slug,
    owner.type,
    owner.version,
    owner.title?.en,
    owner.title?.de,
    owner.question?.en,
    owner.question?.de,
  ].filter(Boolean).join(' ');
};

const describePath = (root, parts, parents) => {
  if (root.key === 'translations') {
    return `UI / ${parts.join(' / ')}`;
  }

  const owner = getDisplayTitle(getFieldOwner(parents));
  const cleanParts = parts.filter((part) => Number.isNaN(Number(part)) && !languageKeys.has(part));
  const section = cleanParts.at(-2) || cleanParts.at(-1) || root.label;
  const language = languageKeys.has(parts.at(-1)) ? parts.at(-1).toUpperCase() : '';

  return [root.label, owner, section, language].filter(Boolean).join(' / ');
};

const collectTextFields = (root, value, parts = [], parents = []) => {
  if (typeof value === 'string') {
    const lastPart = parts.at(-1);
    const previousPart = parts.at(-2);
    const owner = getFieldOwner(parents);

    if (blockedKeys.has(lastPart) || blockedKeys.has(previousPart)) {
      return [];
    }

    return [{
      root: root.key,
      entryType: owner?.type || '',
      group: root.label,
      label: describePath(root, parts, parents),
      ownerSearch: getOwnerSearchText(owner),
      path: [root.key, ...parts].join('.'),
      original: value,
    }];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectTextFields(root, item, [...parts, String(index)], parents));
  }

  if (value && typeof value === 'object') {
    const nextParents = value.id || value.slug || value.title || value.question || value.version ? [...parents, value] : parents;

    return Object.entries(value).flatMap(([key, nextValue]) => {
      if (blockedKeys.has(key)) {
        return [];
      }
      return collectTextFields(root, nextValue, [...parts, key], nextParents);
    });
  }

  return [];
};

const getCurrentValue = (field) => {
  const override = getContentOverride(field.path);
  return typeof override === 'string' ? override : field.original;
};

const subscribeToBuilderContent = (callback) => {
  const unsubscribeOverrides = subscribeToContentOverrides(callback);
  const unsubscribeSiteContent = subscribeToSiteContent(callback);

  return () => {
    unsubscribeOverrides();
    unsubscribeSiteContent();
  };
};

const getBuilderSnapshot = () => getContentOverridesSnapshot() + '|' + getSiteContentSnapshot();

const matchesActiveFilter = (field, activeRoot) => {
  if (activeRoot === 'all') {
    return true;
  }

  const [rootKey, entryType] = activeRoot.split(':');
  return field.root === rootKey && (!entryType || field.entryType === entryType);
};

export function ContentBuilder() {
  const contentSnapshot = useSyncExternalStore(subscribeToBuilderContent, getBuilderSnapshot, () => '');
  const [activeRoot, setActiveRoot] = useState('guideEntries:hero');
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState({});

  const fields = useMemo(() => getEditableRoots().flatMap((root) => collectTextFields(root, root.data)), [contentSnapshot]);
  const visibleFields = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return fields
      .filter((field) => matchesActiveFilter(field, activeRoot))
      .filter((field) => {
        if (!normalizedQuery) {
          return true;
        }

        const currentValue = drafts[field.path] ?? getCurrentValue(field);
        return `${field.label} ${field.ownerSearch} ${currentValue}`.toLowerCase().includes(normalizedQuery);
      })
      .slice(0, 250);
  }, [activeRoot, drafts, fields, query, contentSnapshot]);

  const saveField = (field) => {
    const nextValue = drafts[field.path] ?? getCurrentValue(field);
    if (nextValue === field.original) {
      removeContentOverride(field.path);
    } else {
      setContentOverride(field.path, nextValue);
    }
    setDrafts((current) => {
      const next = { ...current };
      delete next[field.path];
      return next;
    });
  };

  const resetField = (field) => {
    removeContentOverride(field.path);
    setDrafts((current) => ({ ...current, [field.path]: field.original }));
  };

  return (
    <section className="content-builder" translate="no">
      <div className="content-builder-heading">
        <div>
          <span className="admin-status-pill">Builder Mode</span>
          <h2>Website Text Builder</h2>
          <p>Edit the English source text locally. Search for a guide or hero name to see every text field that belongs to it.</p>
        </div>
        <strong>{visibleFields.length} fields shown</strong>
      </div>

      <div className="content-builder-toolbar">
        <label className="content-builder-search">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search hero, guide, patch or text" />
        </label>
        <select value={activeRoot} onChange={(event) => setActiveRoot(event.target.value)}>
          {contentFilters.map((filter) => <option key={filter.value} value={filter.value}>{filter.label}</option>)}
        </select>
      </div>

      <div className="content-builder-list">
        {visibleFields.map((field) => {
          const currentValue = getCurrentValue(field);
          const draftValue = drafts[field.path] ?? currentValue;
          const isOverridden = currentValue !== field.original;
          const isDirty = draftValue !== currentValue;

          return (
            <article className={isOverridden ? 'content-builder-item is-overridden' : 'content-builder-item'} key={field.path}>
              <header>
                <div>
                  <strong>{field.label}</strong>
                  <small>{field.path}</small>
                </div>
                {isOverridden ? <span>Edited</span> : null}
              </header>
              <textarea value={draftValue} onChange={(event) => setDrafts((current) => ({ ...current, [field.path]: event.target.value }))} />
              <footer>
                <button type="button" onClick={() => saveField(field)} disabled={!isDirty && !isOverridden}>
                  <Save size={16} /> Save
                </button>
                <button type="button" onClick={() => resetField(field)} disabled={!isDirty && !isOverridden}>
                  <RotateCcw size={16} /> Reset
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}