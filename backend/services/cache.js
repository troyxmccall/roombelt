const Redis = require("ioredis");
const config = require("../config");

const redis = config.redisUrl && new Redis(config.redisUrl);
const cache = new Map();

const redisCache = namespace => ({
  async get(key) {
    const value = await redis.get(`${namespace}//${key}`);
    return value && JSON.parse(value);
  },
  async set(key, value, ttl = null) {
    if (ttl) await redis.set(`${namespace}//${key}`, JSON.stringify(value), "EX", ttl);
    else await redis.set(`${namespace}//${key}`, JSON.stringify(value));
  },
  async delete(key) {
    await redis.del(`${namespace}//${key}`);
  }
});

const memoryCache = namespace => ({
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

module.exports = redis ? redisCache : memoryCache;
