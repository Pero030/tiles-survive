export function assetPath(path) {
  if (!path || !path.startsWith('/') || path.startsWith(import.meta.env.BASE_URL)) {
    return path;
  }

  if (path.startsWith('/assets/') || path.startsWith('/src/')) {
    return path;
  }

  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}
