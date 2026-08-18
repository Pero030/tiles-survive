import { collection, doc, getDocs, onSnapshot, setDoc, writeBatch } from 'firebase/firestore';
import {
  faqItems,
  guideEntries,
  guideSections,
  heroClassBySlug,
  heroClasses,
  heroImagesBySlug,
  metaFormations,
} from '../data/content.js';
import { fallbackFlagImages } from '../data/flagImages.js';
import { officialPatchFeedUrl, patchNotes } from '../data/patchNotes.js';
import { translations } from '../data/translations.js';
import { db, isFirebaseConfigured } from './firebase.js';

const siteContentEventName = 'tiles-survive-site-content-change';
const useFirebaseOnlyContent = import.meta.env.VITE_FIREBASE_ONLY === 'true';

const appSettingsRef = doc(db, 'appSettings', 'main');
const heroImagesRef = doc(db, 'assets', 'heroImages');
const flagImagesRef = doc(db, 'assets', 'flagImages');
const guideSectionsCollectionRef = collection(db, 'guideSections');
const heroesCollectionRef = collection(db, 'heroes');
const eventsCollectionRef = collection(db, 'events');
const villagesCollectionRef = collection(db, 'villages');
const allianceCollectionRef = collection(db, 'alliance');
const buildingsCollectionRef = collection(db, 'buildings');
const worldMapCollectionRef = collection(db, 'worldMap');
const tipsCollectionRef = collection(db, 'tips');
const legacyGuidesCollectionRef = collection(db, 'guides');
const faqItemsCollectionRef = collection(db, 'faqItems');
const patchNotesCollectionRef = collection(db, 'patchNotes');
const heroClassesCollectionRef = collection(db, 'heroClasses');
const metaFormationsCollectionRef = collection(db, 'metaFormations');
const translationsCollectionRef = collection(db, 'translations');

const legacyAppContentRef = doc(db, 'siteContent', 'app');
const legacyGuideEntriesCollectionRef = collection(db, 'siteGuideEntries');
const legacyPatchNotesCollectionRef = collection(db, 'sitePatchNotes');

const isBrowser = () => typeof window !== 'undefined';
const cloneContent = (value) => JSON.parse(JSON.stringify(value || {}));
const sortByUpdatedAt = (items) => [...items].sort((first, second) => new Date(second.updatedAt || 0) - new Date(first.updatedAt || 0));
const sortPatches = (items) => [...items].sort((first, second) => new Date(second.date || 0) - new Date(first.date || 0));
const sortByOrder = (items) => [...items].sort((first, second) => (first.order ?? 999) - (second.order ?? 999));

const fallbackSiteContent = {
  faqItems,
  guideEntries,
  guideSections,
  heroClassBySlug,
  heroClasses,
  heroImagesBySlug,
  flagImages: fallbackFlagImages,
  metaFormations,
  officialPatchFeedUrl,
  patchNotes,
  translations,
};

const emptySiteContent = {
  faqItems: [],
  guideEntries: [],
  guideSections: [],
  heroClassBySlug: {},
  heroClasses: [],
  heroImagesBySlug: {},
  flagImages: fallbackFlagImages,
  metaFormations: [],
  officialPatchFeedUrl: '',
  patchNotes: [],
  translations: { en: {} },
};

let runtimeSiteContent = cloneContent(useFirebaseOnlyContent ? emptySiteContent : fallbackSiteContent);
let siteContentSnapshot = JSON.stringify(runtimeSiteContent);
let remoteSyncStarted = false;
let seedStarted = false;
let seedFinished = false;
const remoteEntriesByType = {
  hero: null,
  event: null,
  village: null,
  alliance: null,
  building: null,
  map: null,
  tip: null,
};
let newStructureHasContent = false;

const notifySiteContentChanged = () => {
  siteContentSnapshot = JSON.stringify(runtimeSiteContent);

  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(siteContentEventName));
  }
};

const mergeRuntimeContent = (partialContent) => {
  const cleanedContent = Object.fromEntries(
    Object.entries(cloneContent(partialContent)).filter(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (value && typeof value === 'object') return Object.keys(value).length > 0;
      return value !== undefined && value !== null && value !== '';
    }),
  );

  if (!Object.keys(cleanedContent).length) {
    return;
  }

  runtimeSiteContent = {
    ...runtimeSiteContent,
    ...cleanedContent,
  };
  notifySiteContentChanged();
};

const markNewStructureActive = () => {
  newStructureHasContent = true;
};

const publishSplitGuideEntries = () => {
  const knownCollections = Object.values(remoteEntriesByType).filter(Boolean);

  if (!knownCollections.length) {
    return;
  }

  const entries = sortByUpdatedAt(knownCollections.flat());
  if (!entries.length) {
    return;
  }

  mergeRuntimeContent({ guideEntries: entries });
};

const writeCollectionItems = async (batch, collectionName, items, getId = (item, index) => item.id || item.slug || item.version || String(index)) => {
  items.forEach((item, index) => {
    const id = getId(item, index);
    batch.set(doc(db, collectionName, id), cloneContent(item));
  });
};

const buildHeroClassBySlug = (classes) => classes.reduce((lookup, heroClass) => {
  (heroClass.heroes || []).forEach((hero) => {
    lookup[hero.slug] = {
      id: heroClass.id,
      classTitle: heroClass.title,
      title: heroClass.title,
      rarity: hero.rarity,
      note: hero.note,
    };
  });
  return lookup;
}, {});

export const seedSiteContentToFirebase = async ({ overwrite = false } = {}) => {
  if (!isFirebaseConfigured()) {
    return false;
  }

  const existingContentSnapshots = await Promise.all([
    getDocs(heroesCollectionRef),
    getDocs(eventsCollectionRef),
    getDocs(villagesCollectionRef),
    getDocs(allianceCollectionRef),
    getDocs(buildingsCollectionRef),
    getDocs(worldMapCollectionRef),
    getDocs(tipsCollectionRef),
  ]);

  if (!overwrite && existingContentSnapshots.some((snapshot) => !snapshot.empty)) {
    return false;
  }

  const heroEntries = guideEntries.filter((entry) => entry.type === 'hero');
  const eventEntries = guideEntries.filter((entry) => entry.type === 'event');
  const villageEntries = guideEntries.filter((entry) => entry.type === 'village');
  const allianceEntries = guideEntries.filter((entry) => entry.type === 'alliance');
  const buildingEntries = guideEntries.filter((entry) => entry.type === 'building');
  const mapEntries = guideEntries.filter((entry) => entry.type === 'map');
  const tipEntries = guideEntries.filter((entry) => entry.type === 'tip');
  const batch = writeBatch(db);

  batch.set(appSettingsRef, cloneContent({
    officialPatchFeedUrl,
    contentVersion: 'firebase-v2',
    updatedAt: new Date().toISOString(),
  }), { merge: true });

  batch.set(heroImagesRef, cloneContent({
    heroImagesBySlug,
    updatedAt: new Date().toISOString(),
  }), { merge: true });

  await writeCollectionItems(batch, 'guideSections', guideSections, (item, index) => item.id || String(index));
  await writeCollectionItems(batch, 'heroes', heroEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'events', eventEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'villages', villageEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'alliance', allianceEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'buildings', buildingEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'worldMap', mapEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'tips', tipEntries, (item) => item.slug || item.id);
  await writeCollectionItems(batch, 'faqItems', faqItems, (item, index) => item.id || String(index));
  await writeCollectionItems(batch, 'patchNotes', patchNotes, (item, index) => item.id || item.version || String(index));
  await writeCollectionItems(batch, 'heroClasses', heroClasses, (item) => item.id);
  await writeCollectionItems(batch, 'metaFormations', metaFormations, (item) => item.id);

  Object.entries(translations).forEach(([language, messages]) => {
    batch.set(doc(db, 'translations', language), cloneContent({ language, messages }));
  });

  await batch.commit();
  return true;
};

const seedIfFirebaseIsEmpty = async () => {
  if (useFirebaseOnlyContent || seedStarted || seedFinished || !isBrowser() || !isFirebaseConfigured()) {
    return;
  }

  seedStarted = true;
  try {
    await seedSiteContentToFirebase({ overwrite: false });
    seedFinished = true;
  } catch (error) {
    console.error(error);
  } finally {
    seedStarted = false;
  }
};

const subscribeCollection = (collectionRef, onData) => onSnapshot(collectionRef, (snapshot) => {
  if (snapshot.empty) {
    return;
  }

  markNewStructureActive();
  onData(snapshot.docs.map((entryDoc) => ({ id: entryDoc.id, ...entryDoc.data() })));
}, (error) => {
  console.error(error);
});

export const startSiteContentSync = () => {
  if (!isBrowser() || remoteSyncStarted || !isFirebaseConfigured()) {
    return;
  }

  remoteSyncStarted = true;
  seedIfFirebaseIsEmpty();

  onSnapshot(appSettingsRef, (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    markNewStructureActive();
    const data = snapshot.data();
    if (data.officialPatchFeedUrl) {
      mergeRuntimeContent({ officialPatchFeedUrl: data.officialPatchFeedUrl });
    }
  }, (error) => {
    console.error(error);
  });

  onSnapshot(heroImagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    markNewStructureActive();
    const images = snapshot.data().heroImagesBySlug || {};
    if (Object.keys(images).length) {
      mergeRuntimeContent({ heroImagesBySlug: images });
    }
  }, (error) => {
    console.error(error);
  });
  onSnapshot(flagImagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      return;
    }

    markNewStructureActive();
    const data = snapshot.data();
    const imagesByLanguage = data.imagesByLanguage || {};
    if (Object.keys(imagesByLanguage).length) {
      mergeRuntimeContent({
        flagImages: {
          defaultLanguage: data.defaultLanguage || fallbackFlagImages.defaultLanguage,
          fallbackImage: data.fallbackImage || fallbackFlagImages.fallbackImage,
          imagesByLanguage,
        },
      });
    }
  }, (error) => {
    console.error(error);
  });

  subscribeCollection(guideSectionsCollectionRef, (items) => {
    mergeRuntimeContent({ guideSections: sortByOrder(items) });
  });

  subscribeCollection(heroesCollectionRef, (items) => {
    remoteEntriesByType.hero = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(eventsCollectionRef, (items) => {
    remoteEntriesByType.event = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(villagesCollectionRef, (items) => {
    remoteEntriesByType.village = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(allianceCollectionRef, (items) => {
    remoteEntriesByType.alliance = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(buildingsCollectionRef, (items) => {
    remoteEntriesByType.building = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(worldMapCollectionRef, (items) => {
    remoteEntriesByType.map = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(tipsCollectionRef, (items) => {
    remoteEntriesByType.tip = items;
    publishSplitGuideEntries();
  });

  subscribeCollection(legacyGuidesCollectionRef, (items) => {
    if (Object.values(remoteEntriesByType).some(Boolean)) {
      return;
    }

    remoteEntriesByType.event = items.filter((entry) => entry.type === 'event');
    remoteEntriesByType.village = items.filter((entry) => entry.type === 'village');
    remoteEntriesByType.alliance = items.filter((entry) => entry.type === 'alliance');
    remoteEntriesByType.building = items.filter((entry) => entry.type === 'building');
    remoteEntriesByType.map = items.filter((entry) => entry.type === 'map');
    remoteEntriesByType.tip = items.filter((entry) => entry.type === 'tip');
    publishSplitGuideEntries();
  });

  subscribeCollection(faqItemsCollectionRef, (items) => {
    mergeRuntimeContent({ faqItems: sortByOrder(items) });
  });

  subscribeCollection(patchNotesCollectionRef, (items) => {
    mergeRuntimeContent({ patchNotes: sortPatches(items) });
  });

  subscribeCollection(heroClassesCollectionRef, (items) => {
    const classes = sortByOrder(items);
    mergeRuntimeContent({
      heroClasses: classes,
      heroClassBySlug: buildHeroClassBySlug(classes),
    });
  });

  subscribeCollection(metaFormationsCollectionRef, (items) => {
    mergeRuntimeContent({ metaFormations: sortByOrder(items) });
  });

  subscribeCollection(translationsCollectionRef, (items) => {
    const remoteTranslations = items.reduce((lookup, item) => {
      lookup[item.language || item.id] = item.messages || item;
      delete lookup[item.language || item.id].id;
      delete lookup[item.language || item.id].language;
      return lookup;
    }, {});

    if (Object.keys(remoteTranslations).length) {
      mergeRuntimeContent({ translations: remoteTranslations });
    }
  });

  onSnapshot(legacyAppContentRef, (snapshot) => {
    if (!snapshot.exists() || newStructureHasContent) {
      return;
    }

    mergeRuntimeContent(snapshot.data());
  }, (error) => {
    console.error(error);
  });

  onSnapshot(legacyGuideEntriesCollectionRef, (snapshot) => {
    if (snapshot.empty || newStructureHasContent) {
      return;
    }

    mergeRuntimeContent({
      guideEntries: sortByUpdatedAt(snapshot.docs.map((entryDoc) => entryDoc.data())),
    });
  }, (error) => {
    console.error(error);
  });

  onSnapshot(legacyPatchNotesCollectionRef, (snapshot) => {
    if (snapshot.empty || newStructureHasContent) {
      return;
    }

    mergeRuntimeContent({
      patchNotes: sortPatches(snapshot.docs.map((patchDoc) => patchDoc.data())),
    });
  }, (error) => {
    console.error(error);
  });
};

startSiteContentSync();

export const getSiteContent = () => runtimeSiteContent;
export const getSiteContentSnapshot = () => siteContentSnapshot;

export const subscribeToSiteContent = (callback) => {
  if (!isBrowser()) {
    return () => {};
  }

  const handleChange = () => callback();
  window.addEventListener(siteContentEventName, handleChange);

  return () => {
    window.removeEventListener(siteContentEventName, handleChange);
  };
};

export const getGuideSections = () => getSiteContent().guideSections;
export const getGuideEntries = () => getSiteContent().guideEntries;
export const getFaqItems = () => getSiteContent().faqItems;
export const getPatchNotes = () => getSiteContent().patchNotes;
export const getOfficialPatchFeedUrl = () => getSiteContent().officialPatchFeedUrl;
export const getTranslations = () => getSiteContent().translations;
export const getHeroClasses = () => getSiteContent().heroClasses;
export const getHeroClassBySlug = () => getSiteContent().heroClassBySlug;
export const getHeroImagesBySlug = () => getSiteContent().heroImagesBySlug;
export const getFlagImages = () => getSiteContent().flagImages || fallbackFlagImages;
export const getMetaFormations = () => getSiteContent().metaFormations;