const STORAGE_KEY = 'tiles-survive-guide-favorites';

export function getFavoriteIds() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

export function toggleFavorite(entryId) {
  const current = new Set(getFavoriteIds());
  if (current.has(entryId)) {
    current.delete(entryId);
  } else {
    current.add(entryId);
  }
  const next = [...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
