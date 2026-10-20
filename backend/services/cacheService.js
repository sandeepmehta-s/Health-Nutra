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

class TtlCache {
  constructor() {
    /** @type {Map<string, { value: unknown; expiresAt: number }>} */
    this._store = new Map();
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
    return entry.value;
  }

  /**
   * Store a value with a TTL.
   * @param {string} key
   * @param {unknown} value
   * @param {number} [ttlSeconds]
   */
  set(key, value, ttlSeconds = DEFAULT_TTL_SECONDS) {
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

