export interface SafeStorage {
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
}

export function createStorage(namespace: string): SafeStorage {
  const prefix = `${namespace}:`;
  return {
    get<T>(key: string, fallback: T): T {
      if (typeof window === "undefined") return fallback;
      try {
        const raw = localStorage.getItem(prefix + key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },
    set<T>(key: string, value: T): void {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      } catch {
        /* quota or disabled */
      }
    },
  };
}
