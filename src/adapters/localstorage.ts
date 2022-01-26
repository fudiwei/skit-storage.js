const provider = (function () {
    if ('object' === typeof localStorage) {
        return localStorage;
    }

    throw new Error('"LocalStorage" is not provided');
})();

const adaptor: SKIT.Storage.StorageAdapter = {
    keys() {
        return Object.keys(provider);
    },

    keysAsync() {
        return Promise.resolve(adaptor.keys());
    },

    get(key) {
        return provider.getItem(key);
    },

    getAsync(key) {
        return Promise.resolve(adaptor.get(key));
    },

    set(key, val) {
        provider.setItem(key, val);
    },

    setAsync(key, val) {
        return Promise.resolve(adaptor.set(key, val));
    },

    remove(key) {
        provider.removeItem(key);
    },

    removeAsync(key) {
        return Promise.resolve(adaptor.remove(key));
    },

    clear() {
        provider.clear();
    },

    clearAsync() {
        return Promise.resolve(adaptor.clear());
    }
};

export default adaptor;
