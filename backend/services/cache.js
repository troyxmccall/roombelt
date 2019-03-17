const cache = new Map();

module.exports = namespace => ({
  get(key) {
    const entry = cache.get(`${namespace}//${key}`);
    const isValid = entry && entry.expiration > Date.now();
    return isValid ? entry.value : null;
  },
  set(key, value, ttl = null) {
    cache.set(`${namespace}//${key}`, { expiration: ttl ? Date.now() + ttl * 1000 : Number.POSITIVE_INFINITY, value });
  },
  delete(key) {
    cache.delete(`${namespace}//${key}`);
  }
});