module.exports = class Cache {
  constructor() {
    this.cache = new Map();
  }

  async get(token, getValue, watch) {
    const entry = this.getEntry(token);

    if (entry.channelExpiration > Date.now() && entry.isValueUpToDate) {
      return entry.value;
    }

    if (entry.channelExpiration > Date.now() && !entry.isValueUpToDate) {
      entry.value = await getValue(token);
      entry.isValueUpToDate = true;

      return entry.value;
    }

    entry.channelExpiration = Date.now() + 1000;

    watch().then(({ channelId, ttl }) => {
      entry.channelId = channelId;
      entry.channelExpiration = Date.now() + ttl * 1000;
    });

    entry.value = await getValue(token);
    entry.isValueUpToDate = true;

    return entry.value;
  }

  invalidate(token) {
    this.getEntry(token).isValueUpToDate = false;
  }

  getEntry(token) {
    if (!this.cache.has(token)) {
      this.cache.set(token, { value: undefined, isValueUpToDate: false, channelExpiration: 0, channelId: null });
    }

    return this.cache.get(token);
  }
};