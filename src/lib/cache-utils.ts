/* ==================================================================================
   CACHE UTILITIES - V18.2.20
   ==================================================================================
   localStorage/sessionStorage Helper mit Expiry + Error Handling
   ================================================================================== */

import { handleWarning } from './error-handler';

interface CacheItem<T> {
  value: T;
  expiry: number;
}

/**
 * Cache-Manager für Browser Storage
 */
export class CacheManager {
  private storage: Storage;

  constructor(storage: 'local' | 'session' = 'local') {
    this.storage = storage === 'local' ? localStorage : sessionStorage;
  }

  /**
   * Setze Cache-Eintrag mit optionaler Ablaufzeit
   * @param key - Cache-Key
   * @param value - Wert zum Cachen
   * @param ttl - Time-to-Live in Sekunden (Standard: 1h)
   */
  set<T>(key: string, value: T, ttl: number = 3600): void {
    const item: CacheItem<T> = {
      value,
      expiry: Date.now() + ttl * 1000,
    };

    try {
      this.storage.setItem(key, JSON.stringify(item));
    } catch (error) {
      handleWarning(`Cache set failed for ${key}`, 'Cache Warning');
    }
  }

  /**
   * Hole Cache-Eintrag
   * @param key - Cache-Key
   * @returns Cached Value oder null bei Fehler/Ablauf
   */
  get<T>(key: string): T | null {
    try {
      const itemStr = this.storage.getItem(key);
      if (!itemStr) return null;

      const item: CacheItem<T> = JSON.parse(itemStr);

      // Prüfe Ablauf
      if (Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.value;
    } catch (error) {
      handleWarning(`Cache get failed for ${key}`, 'Cache Warning');
      return null;
    }
  }

  /**
   * Entferne Cache-Eintrag
   */
  remove(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * Lösche alle abgelaufenen Einträge
   */
  cleanup(): void {
    const keys = Object.keys(this.storage);
    const now = Date.now();

    keys.forEach((key) => {
      try {
        const itemStr = this.storage.getItem(key);
        if (!itemStr) return;

        const item: CacheItem<unknown> = JSON.parse(itemStr);
        if (now > item.expiry) {
          this.remove(key);
        }
      } catch {
        // Ignore invalid entries
      }
    });
  }

  /**
   * Lösche gesamten Cache
   */
  clear(): void {
    this.storage.clear();
  }
}

// Singleton Instances
export const localCache = new CacheManager('local');
export const sessionCache = new CacheManager('session');
