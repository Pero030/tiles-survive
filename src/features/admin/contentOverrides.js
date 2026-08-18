import localFileContentOverrides from '../../data/contentOverrides.local.json';
import { isFirebaseConfigured, saveRemoteContentOverrides, subscribeToRemoteContentOverrides } from '../../services/firebase.js';

const contentOverridesStorageKey = 'tiles-survive-content-overrides';
const contentOverridesEventName = 'tiles-survive-content-overrides-change';
const contentOverridesApiPath = '/api/admin/content-overrides';

const isBrowser = () => typeof window !== 'undefined';

const cloneContent = (value) => JSON.parse(JSON.stringify(value || {}));

let runtimeContentOverrides = cloneContent(localFileContentOverrides);
let contentOverridesSnapshot = JSON.stringify(runtimeContentOverrides);
let remoteContentUnsubscribe = null;
let isSavingRemoteContent = false;

const notifyContentOverridesChanged = () => {
  contentOverridesSnapshot = JSON.stringify(runtimeContentOverrides);

  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(contentOverridesEventName));
  }
};

const isLocalDevServer = () => isBrowser()
  && ['localhost', '127.0.0.1'].includes(window.location.hostname)
  && window.location.port === '5173';

const saveLocalDevContentOverrides = async (overrides) => {
  if (!isLocalDevServer()) {
    window.localStorage.setItem(contentOverridesStorageKey, JSON.stringify(overrides));
    return;
  }

  const response = await fetch(contentOverridesApiPath, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(overrides),
  });

  if (!response.ok) {
    throw new Error(`Saving local content overrides failed with ${response.status}`);
  }
};

const persistContentOverrides = async (overrides) => {
  if (!isBrowser()) {
    return;
  }

  const results = await Promise.allSettled([
    saveLocalDevContentOverrides(overrides),
    isFirebaseConfigured() ? saveRemoteContentOverrides(overrides) : Promise.resolve(),
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.error(result.reason);
    }
  });
};

const startRemoteContentSync = () => {
  if (!isBrowser() || remoteContentUnsubscribe || !isFirebaseConfigured()) {
    return;
  }

  remoteContentUnsubscribe = subscribeToRemoteContentOverrides(
    (remoteOverrides) => {
      if (isSavingRemoteContent) {
        return;
      }

      runtimeContentOverrides = cloneContent(remoteOverrides);
      notifyContentOverridesChanged();
    },
    (error) => {
      console.error(error);
    },
  );
};

startRemoteContentSync();

export const readContentOverrides = () => runtimeContentOverrides;

export const writeContentOverrides = (overrides) => {
  runtimeContentOverrides = cloneContent(overrides);
  notifyContentOverridesChanged();

  isSavingRemoteContent = true;
  persistContentOverrides(runtimeContentOverrides).finally(() => {
    isSavingRemoteContent = false;
  });
};

const getPathParts = (path) => Array.isArray(path) ? path : String(path).split('.').filter(Boolean);

export const getContentOverride = (path) => {
  const parts = getPathParts(path);
  let current = readContentOverrides();

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }

  return current;
};

export const setContentOverride = (path, value) => {
  const parts = getPathParts(path);
  const overrides = cloneContent(readContentOverrides());
  let current = overrides;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }

    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part];
  });

  writeContentOverrides(overrides);
};

export const removeContentOverride = (path) => {
  const parts = getPathParts(path);
  const overrides = cloneContent(readContentOverrides());
  const stack = [];
  let current = overrides;

  for (const part of parts.slice(0, -1)) {
    if (!current?.[part] || typeof current[part] !== 'object') {
      return;
    }
    stack.push([current, part]);
    current = current[part];
  }

  delete current[parts.at(-1)];

  for (let index = stack.length - 1; index >= 0; index -= 1) {
    const [parent, key] = stack[index];
    if (Object.keys(parent[key]).length === 0) {
      delete parent[key];
    }
  }

  writeContentOverrides(overrides);
};

const cloneWithOverrides = (value, override) => {
  if (override !== undefined && (typeof override !== 'object' || override === null || Array.isArray(override))) {
    return override;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => cloneWithOverrides(item, override?.[index]));
  }

  if (value && typeof value === 'object') {
    const cloned = { ...value };
    Object.keys(cloned).forEach((key) => {
      cloned[key] = cloneWithOverrides(cloned[key], override?.[key]);
    });

    if (override && typeof override === 'object') {
      Object.keys(override).forEach((key) => {
        if (!(key in cloned)) {
          cloned[key] = override[key];
        }
      });
    }

    return cloned;
  }

  return override !== undefined ? override : value;
};

export const applyContentOverrides = (rootKey, data) => cloneWithOverrides(data, readContentOverrides()[rootKey]);

export const getContentOverridesSnapshot = () => contentOverridesSnapshot;

export const subscribeToContentOverrides = (callback) => {
  if (!isBrowser()) {
    return () => {};
  }

  const handleChange = () => callback();
  window.addEventListener(contentOverridesEventName, handleChange);
  window.addEventListener('storage', handleChange);

  return () => {
    window.removeEventListener(contentOverridesEventName, handleChange);
    window.removeEventListener('storage', handleChange);
  };
};