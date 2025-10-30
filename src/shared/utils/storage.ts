export interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

const getStorage = (): StorageAdapter | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage;
};

export function loadJson<T>(key: string, fallback: T): T {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to load ${key} from storage`, error);
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save ${key} to storage`, error);
  }
}

export function loadString(key: string, fallback: string | null = null): string | null {
  const storage = getStorage();
  if (!storage) return fallback;
  try {
    const raw = storage.getItem(key);
    return raw !== null ? raw : fallback;
  } catch (error) {
    console.warn(`Failed to load ${key} from storage`, error);
    return fallback;
  }
}

export function saveString(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to storage`, error);
  }
}

export function removeItem(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from storage`, error);
  }
}
