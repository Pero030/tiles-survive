import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Flag,
  Gift,
  HelpCircle,
  Landmark,
  PackageCheck,
  Pencil,
  RotateCcw,
  Route,
  Save,
  Sparkles,
  Target,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { getHeroClassBySlug, getHeroImagesBySlug, getMetaFormations } from '../services/siteContent.js';
import { contentRepository } from '../features/admin/contentRepository.js';
import { getContentOverride, getContentOverridesSnapshot, removeContentOverride, setContentOverride, subscribeToContentOverrides } from '../features/admin/contentOverrides.js';
import { useLocalizedContent } from '../hooks/useLocalizedContent.js';
import { assetPath } from '../utils/assetPath.js';

const eventSections = [
  { key: 'beginnerBasics', icon: HelpCircle, tone: 'blue', wide: true },
  { key: 'beginnerSteps', icon: Route, tone: 'green', ordered: true, wide: true },
  { key: 'beginnerSpendPlan', icon: PackageCheck, tone: 'gold', wide: true },
  { key: 'beginnerMistakes', icon: AlertTriangle, tone: 'orange', wide: true },
  { key: 'participationRules', icon: CheckCircle2, tone: 'blue', wide: true },
  { key: 'eventMechanics', icon: HelpCircle, tone: 'green', wide: true },
  { key: 'dailyThemes', icon: CalendarDays, tone: 'blue', wide: true },
  { key: 'milestoneRewards', icon: Gift, tone: 'gold' },
  { key: 'dailyRankingRewards', icon: Gift, tone: 'gold', wide: true },
  { key: 'allianceRewards', icon: Gift, tone: 'green', wide: true },
  { key: 'leagueRewards', icon: Gift, tone: 'blue', wide: true },
  { key: 'weeklyResult', icon: Target, tone: 'blue', wide: true },
  { key: 'goals', icon: Target, tone: 'green' },
  { key: 'requirements', icon: CheckCircle2, tone: 'blue' },
  { key: 'neededItems', icon: PackageCheck, tone: 'gold' },
  { key: 'preparation', icon: ClipboardList, tone: 'green' },
  { key: 'walkthrough', icon: Route, tone: 'blue', ordered: true },
  { key: 'watchouts', icon: AlertTriangle, tone: 'orange' },
  { key: 'rewards', icon: Gift, tone: 'gold' },
  { key: 'exactRewards', icon: Sparkles, tone: 'green' },
  { key: 'strategy', icon: Flag, tone: 'blue', wide: true },
];

const heroSections = [
  { key: 'heroStory', icon: BookOpen, iconName: 'BookOpen', tone: 'blue', wide: true },
  { key: 'role', icon: Flag, iconName: 'Flag', tone: 'blue' },
  { key: 'combatTraits', icon: Target, iconName: 'Target', tone: 'green' },
  { key: 'skills', icon: Sparkles, iconName: 'Sparkles', tone: 'gold', wide: true },
  { key: 'signatureWeapon', icon: PackageCheck, iconName: 'PackageCheck', tone: 'blue', wide: true },
  { key: 'bestFor', icon: Target, iconName: 'Target', tone: 'green' },
  { key: 'positioning', icon: ClipboardList, iconName: 'ClipboardList', tone: 'green' },
  { key: 'strengths', icon: CheckCircle2, iconName: 'CheckCircle2', tone: 'green' },
  { key: 'weaknesses', icon: AlertTriangle, iconName: 'AlertTriangle', tone: 'orange' },
  { key: 'investment', icon: Sparkles, iconName: 'Sparkles', tone: 'gold' },
  { key: 'equipment', icon: PackageCheck, iconName: 'PackageCheck', tone: 'blue' },
  { key: 'heroStrategy', icon: ClipboardList, iconName: 'ClipboardList', tone: 'green', wide: true },
];

const editableSectionIcons = {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flag,
  Gift,
  HelpCircle,
  Landmark,
  PackageCheck,
  Route,
  Sparkles,
  Target,
};

const editableSectionIconOptions = Object.keys(editableSectionIcons);
const editableSectionToneOptions = ['blue', 'green', 'gold', 'orange'];

const villageSections = [
  { key: 'beginnerBasics', icon: HelpCircle, tone: 'blue', wide: true },
  { key: 'confidence', icon: CheckCircle2, tone: 'gold', wide: true },
  { key: 'goals', icon: Target, tone: 'green' },
  { key: 'holdingLimit', icon: Landmark, tone: 'blue' },
  { key: 'occupationBenefits', icon: Gift, tone: 'green' },
  { key: 'buffs', icon: Sparkles, tone: 'green' },
  { key: 'points', icon: Target, tone: 'gold' },
  { key: 'garrison', icon: Flag, tone: 'blue' },
  { key: 'coordinates', icon: Landmark, tone: 'blue' },
  { key: 'capturePlan', icon: Route, tone: 'blue' },
  { key: 'priorities', icon: Flag, tone: 'gold' },
  { key: 'requirements', icon: CheckCircle2, tone: 'green' },
  { key: 'watchouts', icon: AlertTriangle, tone: 'orange' },
  { key: 'strategy', icon: ClipboardList, tone: 'blue', wide: true },
];

const allianceSections = [
  { key: 'beginnerBasics', icon: HelpCircle, tone: 'blue', wide: true },
  { key: 'allianceMenu', icon: ClipboardList, tone: 'blue', wide: true },
  { key: 'allianceCity', icon: Landmark, tone: 'green' },
  { key: 'memberRanks', icon: Flag, tone: 'blue', wide: true },
  { key: 'applicantList', icon: CheckCircle2, tone: 'green' },
  { key: 'allianceHelp', icon: CheckCircle2, tone: 'green' },
  { key: 'allianceTechnology', icon: Sparkles, tone: 'blue' },
  { key: 'allianceShop', icon: PackageCheck, tone: 'gold' },
  { key: 'allianceChests', icon: Gift, tone: 'gold', wide: true },
  { key: 'cooperationChest', icon: Gift, tone: 'green' },
  { key: 'allianceGift', icon: PackageCheck, tone: 'gold' },
  { key: 'allianceRankings', icon: Target, tone: 'blue' },
  { key: 'dailyRoutine', icon: CalendarDays, tone: 'green', wide: true },
  { key: 'watchouts', icon: AlertTriangle, tone: 'orange', wide: true },
  { key: 'strategy', icon: ClipboardList, tone: 'blue', wide: true },
  { key: 'confidence', icon: CheckCircle2, tone: 'gold', wide: true },
];

const eventSectionGroups = [
  {
    key: 'eventGroupStart',
    icon: HelpCircle,
    tone: 'blue',
    sections: ['beginnerBasics', 'beginnerSteps', 'participationRules', 'eventMechanics'],
  },
  {
    key: 'eventGroupPoints',
    icon: CalendarDays,
    tone: 'green',
    sections: ['dailyThemes', 'beginnerSpendPlan', 'neededItems', 'preparation'],
  },
  {
    key: 'eventGroupRewards',
    icon: Gift,
    tone: 'gold',
    sections: ['milestoneRewards', 'dailyRankingRewards', 'allianceRewards', 'leagueRewards', 'weeklyResult', 'rewards', 'exactRewards'],
  },
  {
    key: 'eventGroupStrategy',
    icon: Flag,
    tone: 'orange',
    sections: ['beginnerMistakes', 'goals', 'requirements', 'walkthrough', 'watchouts', 'strategy'],
  },
];



const hasAdminSession = () => false;

const getEditableEnglishValue = (value) => {
  const englishValue = value && typeof value === 'object' && !Array.isArray(value) && 'en' in value ? value.en : value;

  if (typeof englishValue === 'string') {
    return { kind: 'string', value: englishValue };
  }

  if (Array.isArray(englishValue) && englishValue.every((item) => typeof item === 'string')) {
    return { kind: 'list', value: englishValue };
  }

  return null;
};

const serializeEditableValue = (editable) => editable.kind === 'list' ? editable.value.join('\n') : editable.value;

const parseEditableValue = (kind, value) => kind === 'list'
  ? value.split('\n').map((item) => item.trim()).filter(Boolean)
  : value;

function InlineAdminEditor({ buttonLabel = 'Edit', path, value }) {
  const editable = getEditableEnglishValue(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => (editable ? serializeEditableValue(editable) : ''));

  useEffect(() => {
    if (!editing && editable) {
      setDraft(serializeEditableValue(editable));
    }
  }, [editing, editable?.value]);

  if (!hasAdminSession() || !editable || !path) {
    return null;
  }

  const saveInlineEdit = () => {
    setContentOverride(path, parseEditableValue(editable.kind, draft));
    setEditing(false);
  };

  const resetInlineEdit = () => {
    removeContentOverride(path);
    setEditing(false);
  };

  if (!editing) {
    return (
      <button className="inline-admin-edit-button" type="button" onClick={() => setEditing(true)}>
        <Pencil size={15} /> {buttonLabel}
      </button>
    );
  }

  return (
    <div className="inline-admin-editor" translate="no">
      <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
      <div className="inline-admin-editor-actions">
        <button type="button" onClick={saveInlineEdit}><Save size={15} /> Save</button>
        <button type="button" onClick={resetInlineEdit}><RotateCcw size={15} /> Reset</button>
        <button type="button" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
      </div>
    </div>
  );
}

function InlineAdminSectionEditor({ iconPath, iconValue, textPath, textValue, titlePath, titleValue, tonePath, toneValue }) {
  const editableText = getEditableEnglishValue(textValue);
  const editableStructuredText = useMemo(() => getEditableStructuredValue(textValue), [textValue]);
  const editableTitle = getEditableEnglishValue(titleValue);
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(() => (editableTitle ? serializeEditableValue(editableTitle) : ''));
  const [textDraft, setTextDraft] = useState(() => (editableText ? serializeEditableValue(editableText) : ''));
  const [structuredDraft, setStructuredDraft] = useState(() => editableStructuredText || []);
  const [iconDraft, setIconDraft] = useState(iconValue || 'BookOpen');
  const [toneDraft, setToneDraft] = useState(toneValue || 'blue');

  useEffect(() => {
    if (!editing) {
      if (editableTitle) {
        setTitleDraft(serializeEditableValue(editableTitle));
      }
      if (editableText) {
        setTextDraft(serializeEditableValue(editableText));
      }
      if (editableStructuredText) {
        setStructuredDraft(editableStructuredText);
      }
      setIconDraft(iconValue || 'BookOpen');
      setToneDraft(toneValue || 'blue');
    }
  }, [editing, editableTitle?.value, editableText?.value, editableStructuredText, iconValue, toneValue]);

  if (!hasAdminSession() || (!editableText && !editableStructuredText && !editableTitle && !iconPath && !tonePath)) {
    return null;
  }

  const updateStructuredItem = (itemIndex, key, value) => {
    setStructuredDraft((current) => current.map((item, index) => (
      index === itemIndex ? { ...item, [key]: value } : item
    )));
  };

  const addStructuredItem = () => {
    setStructuredDraft((current) => [...current, { title: '', level: '', description: '', icon: '' }]);
  };

  const removeStructuredItem = (itemIndex) => {
    setStructuredDraft((current) => current.filter((_, index) => index !== itemIndex));
  };

  const saveInlineEdit = () => {
    if (editableTitle && titlePath) {
      setContentOverride(titlePath, parseEditableValue(editableTitle.kind, titleDraft));
    }
    if (editableStructuredText && textPath) {
      setContentOverride(textPath, structuredDraftToValue(structuredDraft));
    } else if (editableText && textPath) {
      setContentOverride(textPath, parseEditableValue(editableText.kind, textDraft));
    }
    if (iconPath) {
      setContentOverride(iconPath, iconDraft);
    }
    if (tonePath) {
      setContentOverride(tonePath, toneDraft);
    }
    setEditing(false);
  };

  const resetInlineEdit = () => {
    if (titlePath) {
      removeContentOverride(titlePath);
    }
    if (textPath) {
      removeContentOverride(textPath);
    }
    if (iconPath) {
      removeContentOverride(iconPath);
    }
    if (tonePath) {
      removeContentOverride(tonePath);
    }
    setEditing(false);
  };

  if (!editing) {
    return (
      <button className="inline-admin-edit-button" type="button" onClick={() => setEditing(true)}>
        <Pencil size={15} /> Edit
      </button>
    );
  }

  return (
    <div className="inline-admin-editor inline-admin-section-editor" translate="no">
      {editableTitle ? (
        <label>
          <span>Title</span>
          <input value={titleDraft} onChange={(event) => setTitleDraft(event.target.value)} />
        </label>
      ) : null}
      {iconPath ? (
        <label>
          <span>Icon</span>
          <div className="inline-admin-icon-grid">
            {editableSectionIconOptions.map((iconName) => {
              const PreviewIcon = editableSectionIcons[iconName];

              return (
                <button
                  className={iconDraft === iconName ? 'is-active' : ''}
                  key={iconName}
                  type="button"
                  onClick={() => setIconDraft(iconName)}
                >
                  <PreviewIcon size={18} aria-hidden="true" />
                  <small>{iconName}</small>
                </button>
              );
            })}
          </div>
        </label>
      ) : null}
      {tonePath ? (
        <label>
          <span>Icon color</span>
          <div className="inline-admin-tone-grid">
            {editableSectionToneOptions.map((toneName) => (
              <button
                className={toneDraft === toneName ? `tone-${toneName} is-active` : `tone-${toneName}`}
                key={toneName}
                type="button"
                onClick={() => setToneDraft(toneName)}
              >
                {toneName}
              </button>
            ))}
          </div>
        </label>
      ) : null}
      {editableStructuredText ? (
        <div className="inline-admin-structured-editor">
          <span>Items</span>
          {structuredDraft.map((item, itemIndex) => (
            <article className="inline-admin-structured-item" key={`${itemIndex}-${item.title || 'item'}`}>
              <header>
                <strong>{item.title || `Item ${itemIndex + 1}`}</strong>
                <button type="button" onClick={() => removeStructuredItem(itemIndex)}><X size={14} /> Remove</button>
              </header>
              {getStructuredFieldOrder(item).map((fieldKey) => (
                <label key={fieldKey}>
                  <span>{getStructuredFieldLabel(fieldKey)}</span>
                  {fieldKey === 'description' ? (
                    <textarea value={item[fieldKey] || ''} onChange={(event) => updateStructuredItem(itemIndex, fieldKey, event.target.value)} />
                  ) : (
                    <input value={item[fieldKey] || ''} onChange={(event) => updateStructuredItem(itemIndex, fieldKey, event.target.value)} />
                  )}
                </label>
              ))}
            </article>
          ))}
          <button className="inline-admin-add-item-button" type="button" onClick={addStructuredItem}>Add item</button>
        </div>
      ) : editableText ? (
        <label>
          <span>Text</span>
          <textarea value={textDraft} onChange={(event) => setTextDraft(event.target.value)} />
        </label>
      ) : null}
      <div className="inline-admin-editor-actions">
        <button type="button" onClick={saveInlineEdit}><Save size={15} /> Save</button>
        <button type="button" onClick={resetInlineEdit}><RotateCcw size={15} /> Reset</button>
        <button type="button" onClick={() => setEditing(false)}><X size={15} /> Cancel</button>
      </div>
    </div>
  );
}
function splitDetailItem(item) {
  if (typeof item !== 'string') {
    return null;
  }

  const colonIndex = item.indexOf(':');
  if (colonIndex <= 0 || colonIndex > 92) {
    return null;
  }

  return {
    label: item.slice(0, colonIndex),
    body: item.slice(colonIndex + 1).trim(),
  };
}

function splitSubdetails(text) {
  if (!text || !text.includes(';')) {
    return null;
  }

  return text.split(';').map((part) => part.trim()).filter(Boolean);
}

function DetailValue({ value, ordered = false, detailKey }) {
  const { localize } = useLocalizedContent();
  const localizedValue = localize(value);

  if (Array.isArray(localizedValue)) {
    const List = ordered ? 'ol' : 'ul';
    return (
      <List className={`event-detail-list event-detail-list-${detailKey || 'default'}`}>
        {localizedValue.map((item) => {
          const splitItem = !ordered ? splitDetailItem(item) : null;
          const subdetails = splitItem ? splitSubdetails(splitItem.body) : null;

          return (
            <li key={item}>
              {splitItem ? (
                <>
                  <strong>{splitItem.label}</strong>
                  {subdetails ? (
                    <span className="event-detail-sublist">
                      {subdetails.map((detail) => (
                        <span key={detail}>{detail}</span>
                        ))}
                    </span>
                  ) : (
                    <span>{splitItem.body}</span>
                  )}
                </>
              ) : (
                item
              )}
            </li>
          );
        })}
      </List>
    );
  }

  return <p>{localizedValue}</p>;
}

function SourcesPanel({ entry, t, localize }) {
  const [openGallery, setOpenGallery] = useState(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const sources = entry.details?.sourceLinks || [];
  const note = entry.details?.sourceNote;

  if (!sources.length && !note) {
    return null;
  }

  return (
    <section className="event-sources-panel">
      <div className="event-section-heading">
        <span className="event-section-icon tone-blue">
          <BookOpen size={18} aria-hidden="true" />
        </span>
        <h2>{t('sourceLinks')}</h2>
      </div>
      {sources.length > 0 && (
        <div className="source-card-list">
          {sources.map((source) => {
            const isInternal = source.url?.startsWith('#');
            const hasScreenshots = source.screenshots?.length > 0;
            const isOpen = openGallery === source.url;
            const content = (
              <>
                <span>
                  <strong>{localize(source.title)}</strong>
                  {source.note && <small>{localize(source.note)}</small>}
                  {hasScreenshots && <em>{isOpen ? t('hideScreenshots') : t('showScreenshots')}</em>}
                </span>
                {!isInternal && <ExternalLink size={17} aria-hidden="true" />}
              </>
            );

            return (
              <div className="source-card-wrap" key={source.url}>
                {hasScreenshots ? (
                  <button
                    className="source-card"
                    id={isInternal ? source.url.slice(1) : undefined}
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGallery(isOpen ? null : source.url)}
                  >
                    {content}
                  </button>
                ) : isInternal ? (
                  <div className="source-card" id={source.url.slice(1)}>
                    {content}
                  </div>
                ) : (
                  <a className="source-card" href={source.url} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                )}

                {hasScreenshots && isOpen && (
                  <div className="source-gallery">
                    {source.screenshots.map((screenshot) => (
                      <figure key={screenshot.src}>
                        <button
                          className="source-gallery-preview"
                          type="button"
                          onClick={() => setSelectedScreenshot(screenshot)}
                        >
                          <img src={assetPath(screenshot.src)} alt={localize(screenshot.title)} loading="lazy" />
                        </button>
                        <figcaption>{localize(screenshot.title)}</figcaption>
                      </figure>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {note && <p className="source-note">{localize(note)}</p>}
      {selectedScreenshot && (
        <div className="screenshot-lightbox" role="dialog" aria-modal="true" aria-label={localize(selectedScreenshot.title)}>
          <button className="screenshot-lightbox-backdrop" type="button" onClick={() => setSelectedScreenshot(null)}>
            <span className="sr-only">{t('closePreview')}</span>
          </button>
          <figure className="screenshot-lightbox-content">
            <button className="screenshot-lightbox-close" type="button" onClick={() => setSelectedScreenshot(null)} aria-label={t('closePreview')}>
              <X size={22} aria-hidden="true" />
            </button>
            <div className="screenshot-lightbox-image">
              <img src={assetPath(selectedScreenshot.src)} alt={localize(selectedScreenshot.title)} />
            </div>
            <figcaption className="screenshot-lightbox-info">
              <span>{t('screenshotShows')}</span>
              <strong>{localize(selectedScreenshot.title)}</strong>
              {selectedScreenshot.description && <p>{localize(selectedScreenshot.description)}</p>}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}

function EventDetail({ entry, entryIndex, t, localize }) {
  const visibleSections = useMemo(() => eventSections.filter((section) => entry.details?.[section.key]), [entry.details]);
  const sectionsByKey = useMemo(() => new Map(visibleSections.map((section) => [section.key, section])), [visibleSections]);
  const groupedSections = useMemo(
    () => eventSectionGroups
      .map((group) => ({
        ...group,
        sections: group.sections.map((key) => sectionsByKey.get(key)).filter(Boolean),
      }))
      .filter((group) => group.sections.length > 0),
    [sectionsByKey],
  );
  const [activeSection, setActiveSection] = useState(visibleSections[0]?.key || null);
  const statusLabel = entry.status === 'draft' ? t('draft') : t('verified');
  const sourceCount = entry.details?.sourceLinks?.length || 0;
  const sectionKeys = useMemo(() => visibleSections.map((section) => section.key), [visibleSections]);
  const activeSectionLabel = t(activeSection) || activeSection;

  useEffect(() => {
    if (!sectionKeys.length) {
      return undefined;
    }

    const updateActiveSection = () => {
      const probeY = 220;
      const sections = sectionKeys.map((key) => {
        const element = document.getElementById(`event-section-${key}`);
        const rect = element?.getBoundingClientRect();
        return rect ? { key, top: rect.top, bottom: rect.bottom, left: rect.left } : null;
      }).filter(Boolean);
      const sortByReadingPosition = (a, b) => b.top - a.top || a.left - b.left;
      const visible = sections
        .filter((section) => section.top <= probeY && section.bottom > probeY)
        .sort(sortByReadingPosition)[0];
      const above = sections
        .filter((section) => section.top <= probeY)
        .sort(sortByReadingPosition)[0];
      const current = visible?.key || above?.key || sectionKeys[0];

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [sectionKeys]);

  return (
    <>
      <section className="event-hero-panel">
        <div>
          <p className="eyebrow">
            <CalendarDays size={16} aria-hidden="true" />
            {t('eventGuide')}
          </p>
          <h1>{localize(entry.title)}</h1>
          <p className="lead">{localize(entry.summary)}</p>
          <InlineAdminEditor buttonLabel="Edit summary" path={entryIndex >= 0 ? `guideEntries.${entryIndex}.summary.en` : ''} value={entry.summary} />
          {entry.tags?.length > 0 && (
            <div className="detail-tag-row detail-tag-row-inset" aria-label="Tags">
              {entry.tags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
                ))}
            </div>
          )}
        </div>
        <div className="event-status-card">
          <span>{statusLabel}</span>
          <dl>
            <div>
              <dt>{t('updated')}</dt>
              <dd>{entry.updatedAt}</dd>
            </div>
            <div>
              <dt>{t('sourceLinks')}</dt>
              <dd>{sourceCount}</dd>
            </div>
            <div>
              <dt>{t('topics')}</dt>
              <dd>{entry.tags?.length || 0}</dd>
            </div>
          </dl>
        </div>
      </section>

      {visibleSections.length > 0 && (
        <nav className="event-quick-nav" aria-label={t('quickJump')}>
          <span className="event-quick-nav-label">{t('currentSection')}</span>
          <strong className="event-current-section">{activeSectionLabel}</strong>
          <details className="event-section-menu">
            <summary>
              <span>{t('allSections')}</span>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div>
              {visibleSections.map(({ key }) => (
                <a aria-current={activeSection === key ? 'true' : undefined} href={`#event-section-${key}`} key={key}>
                  {t(key) || key}
                </a>
                ))}
            </div>
          </details>
        </nav>
      )}

      <section className="event-playbook">
        <div className="event-section-heading">
          <span className="event-section-icon tone-green">
            <ClipboardList size={18} aria-hidden="true" />
          </span>
          <div>
            <h2>{t('guideOverview')}</h2>
            <p>{t('guideOverviewCopy')}</p>
          </div>
        </div>

        <div className="event-chapter-stack">
          {groupedSections.map(({ key: groupKey, icon: GroupIcon, tone: groupTone, sections }) => (
            <section className="event-chapter" key={groupKey}>
              <header className="event-chapter-header">
                <span className={`event-section-icon tone-${groupTone}`}>
                  <GroupIcon size={18} aria-hidden="true" />
                </span>
                <h3>{t(groupKey) || groupKey}</h3>
              </header>

              <div className="event-info-grid">
                {sections.map(({ key, icon: Icon, tone, ordered, wide }) => (
                  <section className={`event-info-card event-info-card-${key} ${wide ? 'wide' : ''}`} id={`event-section-${key}`} key={key}>
                    <header>
                      <span className={`event-section-icon tone-${selectedTone}`}>
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <h3>{t(key) || key}</h3>
                    </header>
                    <DetailValue value={entry.details[key]} ordered={ordered} detailKey={key} />
                  </section>
                  ))}
              </div>
            </section>
            ))}
        </div>
      </section>

      <SourcesPanel entry={entry} t={t} localize={localize} />
    </>
  );
}

function HeroDetailValue({ value, detailKey }) {
  const { localize } = useLocalizedContent();
  const localizedValue = localize(value);

  if (detailKey === 'heroStory' && Array.isArray(localizedValue)) {
    return (
      <div className="hero-story-text">
        {localizedValue.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (Array.isArray(localizedValue)) {
    const hasVisualItems = localizedValue.some((item) => item && typeof item === 'object' && item.icon);

    if (hasVisualItems) {
      return (
        <div className="hero-skill-list">
          {localizedValue.map((item) => {
            const title = localize(item.title);
            return (
              <article className="hero-skill-item" key={title}>
                <img src={assetPath(item.icon)} alt={title} loading="lazy" />
                <div>
                  <h4>{title}</h4>
                  <p>{localize(item.description)}</p>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    return (
      <ul className="hero-detail-points">
        {localizedValue.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p>{localizedValue}</p>;
}

function HeroDetail({ entry, entryIndex, heroClass, heroImage, t, localize }) {
  const visibleSections = heroSections.filter((section) => entry.details?.[section.key]);
  const metaFormations = getMetaFormations();
  const metaHeroSlugs = new Set(metaFormations.flatMap((formation) => [
    ...formation.formation.frontline.map((slot) => slot.slug),
    ...formation.formation.backline.map((slot) => slot.slug),
  ]));
  const isMeta = metaHeroSlugs.has(entry.slug);
  const classTitle = heroClass ? localize(heroClass.classTitle).replace(' Heroes', '').replace('-Helden', '') : null;
  const tier = localize(entry.details?.tier);
  const role = localize(entry.details?.role);
  const rarity = heroClass?.rarity || localize(entry.details?.rarity);

  return (
    <>
      <section className="hero-detail-hero">
        <div className="hero-detail-media">
          <div className="hero-detail-portrait hero-detail-portrait-large">
            {heroImage?.src ? (
              <img src={assetPath(heroImage.src)} alt={localize(heroImage.alt) || localize(entry.title)} loading="lazy" />
            ) : (
              <span aria-hidden="true">{localize(entry.title)?.slice(0, 1)}</span>
            )}
          </div>
          <div className="hero-detail-badges">
            {classTitle && <span>{classTitle}</span>}
            {rarity && <span className={`rarity-badge rarity-${String(rarity).toLowerCase()}`}>{rarity}</span>}
            {isMeta && <span className="meta-badge">{t('meta')}</span>}
          </div>
        </div>

        <div className="hero-detail-intro">
          <p className="eyebrow">{t('heroProfile')}</p>
          <h1 translate="no">{localize(entry.title)}</h1>
          <p className="lead">{localize(entry.summary)}</p>
          <InlineAdminEditor buttonLabel="Edit summary" path={entryIndex >= 0 ? `guideEntries.${entryIndex}.summary.en` : ''} value={entry.summary} />
          <dl className="hero-detail-facts">
            {tier && (
              <div>
                <dt>{t('tier')}</dt>
                <dd>{tier}</dd>
              </div>
            )}
            {role && (
              <div>
                <dt>{t('role')}</dt>
                <dd>{role}</dd>
              </div>
            )}
            <div>
              <dt>{t('updated')}</dt>
              <dd>{entry.updatedAt}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="hero-guide-panel">
        <div className="event-section-heading">
          <span className="event-section-icon tone-green">
            <BookOpen size={18} aria-hidden="true" />
          </span>
          <div>
            <h2>{t('details')}</h2>
            <p>{heroClass?.note ? localize(heroClass.note) : localize(entry.summary)}</p>
          </div>
        </div>

        <div className="hero-detail-grid">
          {visibleSections.map(({ key, icon: DefaultIcon, iconName, tone }) => {
            const selectedIconName = getContentOverride(`sectionIcons.hero.${key}`) || iconName;
            const selectedTone = getContentOverride(`sectionTones.hero.${key}`) || tone;
            const Icon = editableSectionIcons[selectedIconName] || DefaultIcon;
            const detailValue = entry.details[key];
            const detailTextPath = entryIndex >= 0
              ? `guideEntries.${entryIndex}.details.${key}${detailValue && typeof detailValue === 'object' && !Array.isArray(detailValue) && 'en' in detailValue ? '.en' : ''}`
              : '';

            return (
            <section className={`hero-detail-card hero-detail-card-${key}`} key={key}>
              <header>
                <span className={`event-section-icon tone-${selectedTone}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3>{t(key) || key}</h3>
                <InlineAdminSectionEditor iconPath={`sectionIcons.hero.${key}`} iconValue={selectedIconName} tonePath={`sectionTones.hero.${key}`} toneValue={selectedTone} titlePath={`translations.en.${key}`} titleValue={t(key) || key} textPath={detailTextPath} textValue={detailValue} />
              </header>
              <HeroDetailValue value={entry.details[key]} detailKey={key} />
            </section>
            );
          })}
        </div>
      </section>

    </>
  );
}

function VillageDetailValue({ value }) {
  const { localize } = useLocalizedContent();
  const localizedValue = localize(value);

  if (Array.isArray(localizedValue)) {
    return (
      <ul className="village-detail-list">
        {localizedValue.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p>{localizedValue}</p>;
}

function VillageDetail({ entry, entryIndex, t, localize }) {
  const visibleSections = villageSections.filter((section) => entry.details?.[section.key]);
  const statusLabel = entry.status === 'draft' ? t('draft') : t('verified');
  const sourceCount = entry.details?.sourceLinks?.length || 0;
  const primarySections = visibleSections.filter((section) => ['beginnerBasics', 'confidence', 'goals', 'holdingLimit'].includes(section.key));
  const guideSections = visibleSections.filter((section) => !['beginnerBasics', 'confidence', 'goals', 'holdingLimit'].includes(section.key));
  const territoryLevels = entry.details?.territoryLevels || [];

  return (
    <>
      <section className="village-hero-panel">
        <div className="village-hero-copy">
          <p className="eyebrow">
            <Landmark size={16} aria-hidden="true" />
            {t('territoryGuide')}
          </p>
          <h1>{localize(entry.title)}</h1>
          <p className="lead">{localize(entry.summary)}</p>
          <InlineAdminEditor buttonLabel="Edit summary" path={entryIndex >= 0 ? `guideEntries.${entryIndex}.summary.en` : ''} value={entry.summary} />
          {entry.tags?.length > 0 && (
            <div className="detail-tag-row detail-tag-row-inset" aria-label="Tags">
              {entry.tags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
                ))}
            </div>
          )}
        </div>
        <aside className="village-status-card" aria-label={t('sourceQuality')}>
          <span>{statusLabel}</span>
          <dl>
            <div>
              <dt>{t('updated')}</dt>
              <dd>{entry.updatedAt}</dd>
            </div>
            <div>
              <dt>{t('sourceLinks')}</dt>
              <dd>{sourceCount}</dd>
            </div>
            <div>
              <dt>{t('topics')}</dt>
              <dd>{entry.tags?.length || 0}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {entry.image?.src && !territoryLevels.length && (
        <section className="village-single-preview-panel">
          <div className="village-single-preview-image">
            <img src={assetPath(entry.image.src)} alt={localize(entry.image.alt) || localize(entry.title)} loading="lazy" />
          </div>
          <div className="village-single-preview-copy">
            <span>{t('territoryGuide')}</span>
            <h2>{localize(entry.title)}</h2>
            <p>{localize(entry.summary)}</p>
          </div>
        </section>
      )}

      {territoryLevels.length > 0 && (
        <section className="village-level-panel">
          <div className="event-section-heading">
            <span className="event-section-icon tone-blue">
              <Landmark size={18} aria-hidden="true" />
            </span>
            <h2>{t('territoryLevels')}</h2>
          </div>
          <div className="village-level-grid">
            {territoryLevels.map((territory) => (
              <article className="village-level-card" key={territory.level}>
                <img src={assetPath(territory.image)} alt={localize(territory.name)} loading="lazy" />
                <div>
                  <span>{territory.level}</span>
                  <h3>{localize(territory.name)}</h3>
                  <p>{localize(territory.summary)}</p>
                </div>
              </article>
              ))}
          </div>
        </section>
      )}

      {primarySections.length > 0 && (
        <section className="village-overview-panel">
          <div className="village-card-grid village-card-grid-primary">
            {primarySections.map(({ key, icon: Icon, tone, wide }) => (
              <section className={`village-info-card village-info-card-${key} ${wide ? 'wide' : ''}`} key={key}>
                <header>
                  <span className={`event-section-icon tone-${selectedTone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h2>{t(key) || key}</h2>
                </header>
                <VillageDetailValue value={entry.details[key]} />
              </section>
              ))}
          </div>
        </section>
      )}

      {guideSections.length > 0 && (
        <section className="village-guide-panel">
          <div className="event-section-heading">
            <span className="event-section-icon tone-green">
              <ClipboardList size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>{t('details')}</h2>
              <p>{t('territoryGuideCopy')}</p>
            </div>
          </div>
          <div className="village-card-grid">
            {guideSections.map(({ key, icon: Icon, tone, wide }) => (
              <section className={`village-info-card village-info-card-${key} ${wide ? 'wide' : ''}`} key={key}>
                <header>
                  <span className={`event-section-icon tone-${selectedTone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h2>{t(key) || key}</h2>
                </header>
                <VillageDetailValue value={entry.details[key]} />
              </section>
              ))}
          </div>
        </section>
      )}

      <SourcesPanel entry={entry} t={t} localize={localize} />
    </>
  );
}

function AllianceDetail({ entry, entryIndex, t, localize }) {
  const visibleSections = allianceSections.filter((section) => entry.details?.[section.key]);
  const statusLabel = entry.status === 'draft' ? t('draft') : t('verified');
  const sourceCount = entry.details?.sourceLinks?.length || 0;

  return (
    <>
      <section className="village-hero-panel alliance-hero-panel">
        <div className="village-hero-copy">
          <p className="eyebrow">
            <Flag size={16} aria-hidden="true" />
            {t('allianceGuide')}
          </p>
          <h1>{localize(entry.title)}</h1>
          <p className="lead">{localize(entry.summary)}</p>
          <InlineAdminEditor buttonLabel="Edit summary" path={entryIndex >= 0 ? `guideEntries.${entryIndex}.summary.en` : ''} value={entry.summary} />
          {entry.tags?.length > 0 && (
            <div className="detail-tag-row detail-tag-row-inset" aria-label="Tags">
              {entry.tags.slice(0, 6).map((tag) => (
                <span key={tag}>{tag}</span>
                ))}
            </div>
          )}
        </div>
        <aside className="village-status-card" aria-label={t('sourceQuality')}>
          <span>{statusLabel}</span>
          <dl>
            <div>
              <dt>{t('updated')}</dt>
              <dd>{entry.updatedAt}</dd>
            </div>
            <div>
              <dt>{t('sourceLinks')}</dt>
              <dd>{sourceCount}</dd>
            </div>
            <div>
              <dt>{t('topics')}</dt>
              <dd>{entry.tags?.length || 0}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {entry.image?.src && (
        <section className="village-single-preview-panel alliance-preview-panel">
          <div className="village-single-preview-image">
            <img src={assetPath(entry.image.src)} alt={localize(entry.image.alt) || localize(entry.title)} loading="lazy" />
          </div>
          <div className="village-single-preview-copy">
            <span>{t('allianceGuide')}</span>
            <h2>{localize(entry.title)}</h2>
            <p>{localize(entry.summary)}</p>
          </div>
        </section>
      )}

      {visibleSections.length > 0 && (
        <section className="village-guide-panel alliance-guide-panel">
          <div className="event-section-heading">
            <span className="event-section-icon tone-green">
              <ClipboardList size={18} aria-hidden="true" />
            </span>
            <div>
              <h2>{t('details')}</h2>
              <p>{t('allianceGuideCopy')}</p>
            </div>
          </div>
          <div className="village-card-grid alliance-card-grid">
            {visibleSections.map(({ key, icon: Icon, tone, wide }) => (
              <section className={`village-info-card alliance-info-card village-info-card-${key} ${wide ? 'wide' : ''}`} key={key}>
                <header>
                  <span className={`event-section-icon tone-${selectedTone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <h2>{t(key) || key}</h2>
                </header>
                <VillageDetailValue value={entry.details[key]} />
              </section>
              ))}
          </div>
        </section>
      )}

      <SourcesPanel entry={entry} t={t} localize={localize} />
    </>
  );
}

function DetailPage({ type }) {
  const { slug } = useParams();
  const { t } = useLanguage();
  const { localize } = useLocalizedContent();
  const overridesSnapshot = useSyncExternalStore(subscribeToContentOverrides, getContentOverridesSnapshot, () => '');
  const entry = useMemo(() => contentRepository.findEntryBySlug(type, slug), [type, slug, overridesSnapshot]);
  const entryIndex = useMemo(() => contentRepository.findEntryIndexBySlug(type, slug), [type, slug]);
  const heroClassBySlug = getHeroClassBySlug();
  const heroImagesBySlug = getHeroImagesBySlug();
  const heroClass = entry?.type === 'hero' ? heroClassBySlug[entry.slug] : null;
  const heroImage = entry?.type === 'hero' ? entry.image || heroImagesBySlug[entry.slug] : null;

  if (!entry) {
    return <Navigate to="/404" replace />;
  }

  if (entry.type === 'event') {
    return (
      <article className="page-shell page-top detail-page event-detail-page">
        <EventDetail entry={entry} entryIndex={entryIndex} t={t} localize={localize} />
      </article>
    );
  }

  if (entry.type === 'hero') {
    return (
      <article className="page-shell page-top detail-page hero-detail-page">
        <HeroDetail entry={entry} entryIndex={entryIndex} heroClass={heroClass} heroImage={heroImage} t={t} localize={localize} />
      </article>
    );
  }

  if (entry.type === 'village') {
    return (
      <article className="page-shell page-top detail-page village-detail-page">
        <VillageDetail entry={entry} entryIndex={entryIndex} t={t} localize={localize} />
      </article>
    );
  }

  if (entry.type === 'alliance') {
    return (
      <article className="page-shell page-top detail-page village-detail-page alliance-detail-page">
        <AllianceDetail entry={entry} entryIndex={entryIndex} t={t} localize={localize} />
      </article>
    );
  }

  return (
    <article className="page-shell page-top detail-page">
      <p className="eyebrow">{entry.type}</p>
      <h1>{localize(entry.title)}</h1>
      <p className="lead">{localize(entry.summary)}</p>

      <dl className="meta-list">
        {heroClass && (
          <>
            <div>
              <dt>{t('heroClass')}</dt>
              <dd>{localize(heroClass.classTitle).replace(' Heroes', '').replace('-Helden', '')}</dd>
            </div>
            <div>
              <dt>{t('rarity')}</dt>
              <dd>{heroClass.rarity}</dd>
            </div>
          </>
        )}
        <div>
          <dt>ID</dt>
          <dd>{entry.id}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{entry.status}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>{entry.updatedAt}</dd>
        </div>
      </dl>

      <section className="content-panel">
        <h2>{t('details')}</h2>
        {entry.details ? (
          <div className="detail-grid">
            {Object.entries(entry.details).map(([key, value]) => (
              <section key={key}>
                <h3>{t(key) || key}</h3>
                {key === 'sourceLinks' ? (
                  <ul>
                    {value.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} target="_blank" rel="noreferrer">
                          {localize(source.title)}
                        </a>
                        {source.note && <p>{localize(source.note)}</p>}
                      </li>
                      ))}
                  </ul>
                ) : Array.isArray(localize(value)) ? (
                  <ul>
                    {localize(value).map((item) => (
                      <li key={item}>{item}</li>
                      ))}
                  </ul>
                ) : (
                  <p>{localize(value)}</p>
                )}
              </section>
              ))}
          </div>
        ) : (
          <p>{t('comingSoon')}</p>
        )}
      </section>
    </article>
  );
}

export default DetailPage;






