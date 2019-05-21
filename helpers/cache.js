class Cache {

  constructor() {

    this.storage = window.localStorage;
    this.prefix = 'hvbs-';

  }

  put(key, value, minutes) {

    if (!this.storage) {
      return false;
    }

    // Default cache is 15 mins
    minutes = parseInt(minutes);
    minutes = minutes ? minutes : 15;

    let cacheData = {
      data: value,
      expire: (new Date()).getTime() + 15*60*1000
    }

    // Save cache
    this.storage.setItem(this.prefix + key, JSON.stringify(cacheData));

    return true;

  }

  get(key, defaultValue) {

    if (!this.storage) {
      return defaultValue ? defaultValue : null;
    }

    // Load cache
    let cache = this.storage.getItem(this.prefix + key);

    if (!cache) {
      return defaultValue ? defaultValue : null;
    }

    cache = JSON.parse(cache);

    // Check expire
    if ((new Date()).getTime() > cache.expire) {
      this.remove(key);
      return defaultValue ? defaultValue : null;
    }

    return cache.data;

  }

  remove(key) {

    if (!this.storage) {
      return true;
    }

    this.storage.removeItem(this.prefix + key);
    return true;
  }

}

export default new Cache();