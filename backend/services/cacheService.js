/**
 * Lightweight in-process TTL cache for read-heavy API responses.
 * Zero external dependencies — no Redis required.
 * Designed for Render Free tier (0.1 CPU / 512 MB RAM).
 *
 * Usage:
 *   import { cache } from './cacheService.js';
 *   const cached = cache.get('products:all');
 *   if (!cached) {
 *     const fresh = await expensiveQuery();
 *     cache.set('products:all', fresh, 60); // TTL in seconds
 *   }
 */

const DEFAULT_TTL_SECONDS = 60;
const MAX_ENTRIES = 500; // Strict upper bound to protect 512MB RAM ceiling

class TtlCache {
  constructor(maxEntries = MAX_ENTRIES) {
    /** @type {Map<string, { value: unknown; expiresAt: number }>} */
    this._store = new Map();
    this._maxEntries = maxEntries;
  }

  /**
   * Retrieve a cached value.
   * @param {string} key
   * @returns {unknown | null}
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return null;
    }
    // Refresh insertion order for LRU behavior
    this._store.delete(key);
    this._store.set(key, entry);
    return entry.value;
  }

  /**
   * Store a value with a TTL, enforcing bounded memory limits.
   * @param {string} key
   * @param {unknown} value
   * @param {number} [ttlSeconds]
   */
  set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
    // If key exists, delete first to refresh order
    if (this._store.has(key)) {
      this._store.delete(key);
    } else if (this._store.size >= this._maxEntries) {
      // First try evicting expired entries
      this._evictExpired();
      // If still at or over limit, evict oldest entry (FIFO / LRU)
      if (this._store.size >= this._maxEntries) {
        const oldestKey = this._store.keys().next().value;
        if (oldestKey) this._store.delete(oldestKey);
      }
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Invalidate one or all keys matching an optional prefix.
   * @param {string} [prefix] - if omitted, flushes everything
   */
  invalidate(prefix) {
    if (!prefix) {
      this._store.clear();
      return;
    }
    for (const key of this._store.keys()) {
      if (key.startsWith(prefix)) this._store.delete(key);
    }
  }

  /** Number of live (non-expired) entries. */
  get size() {
    this._evictExpired();
    return this._store.size;
  }

  _evictExpired() {
    const now = Date.now();
    for (const [k, v] of this._store) {
      if (now > v.expiresAt) this._store.delete(k);
    }
  }
}

export const cache = new TtlCache();

