export function searchEntries(entries, query, localize) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return entries.filter((entry) => {
    const haystack = [
      localize(entry.title),
      localize(entry.summary),
      entry.type,
      entry.slug,
      ...(entry.tags || []),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
