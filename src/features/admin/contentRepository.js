import { applyContentOverrides } from './contentOverrides.js';
import { getFaqItems, getGuideEntries, getGuideSections } from '../../services/siteContent.js';

export const contentRepository = {
  listSections() {
    return applyContentOverrides('guideSections', getGuideSections());
  },
  listEntries() {
    return applyContentOverrides('guideEntries', getGuideEntries());
  },
  listFaqItems() {
    return applyContentOverrides('faqItems', getFaqItems());
  },
  findEntryBySlug(type, slug) {
    return this.listEntries().find((entry) => entry.type === type && entry.slug === slug);
  },
  findEntryIndexBySlug(type, slug) {
    return getGuideEntries().findIndex((entry) => entry.type === type && entry.slug === slug);
  },
};