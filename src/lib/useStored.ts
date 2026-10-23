import { useEffect, useState } from 'react';

const PREFIX = 'studysesh:v1:';

// useState that survives reloads. Storage can be unavailable (private
// windows, blocked site data), so every access falls back to memory.
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Not persisted; the app keeps working in memory.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
