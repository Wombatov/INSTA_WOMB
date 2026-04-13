import { createMMKV } from 'react-native-mmkv';
import { createJSONStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'captioncraft-storage' });

/** MMKV-backed JSON storage for `persist()` — raw strings, same instance as getItem/setItem helpers. */
export const zustandPersistStorage = createJSONStorage(() => ({
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => {
    storage.set(name, value);
  },
  removeItem: (name) => {
    storage.remove(name);
  },
}));

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? (JSON.parse(value) as T) : null;
}

export function setItem<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  storage.remove(key);
}
