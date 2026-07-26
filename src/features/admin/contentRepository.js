import { guideEntries, guideSections, faqItems } from '../../data/content.js';

export const contentRepository = {
  listSections() {
    return guideSections;
  },
  listEntries() {
    return guideEntries;
  },
  listFaqItems() {
    return faqItems;
  },
  findEntryBySlug(type, slug) {
    return guideEntries.find((entry) => entry.type === type && entry.slug === slug);
  },
};
