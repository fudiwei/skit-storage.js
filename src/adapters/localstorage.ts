const getProvider = (function () {
    let provider: typeof localStorage;

    return function () {
        if (!provider) {
            if ('object' === typeof localStorage) {
                provider = localStorage;
            } else {
                throw new Error('Unsupported hosting environment, may be not in a browser.');
            }
        }

        return provider;
    };
})();

const adaptor: SKIT.Storage.StorageAdapter = {
    keys() {
        return Object.keys(getProvider());
    },

    keysAsync() {
        try {
            return Promise.resolve(this.keys());
        } catch (err) {
            return Promise.reject(err);
        }
    },

    get(key) {
        return getProvider().getItem(key);
    },

    getAsync(key) {
        try {
            return Promise.resolve(this.get(key));
        } catch (err) {
            return Promise.reject(err);
        }
    },

    set(key, val) {
        getProvider().setItem(key, val);
    },

    setAsync(key, val) {
        try {
            return Promise.resolve(this.set(key, val));
        } catch (err) {
            return Promise.reject(err);
        }
    },

    remove(key) {
        getProvider().removeItem(key);
    },

    removeAsync(key) {
        try {
            return Promise.resolve(this.remove(key));
        } catch (err) {
            return Promise.reject(err);
        }
    },

    clear() {
        getProvider().clear();
    },

    clearAsync() {
        try {
            return Promise.resolve(this.clear());
        } catch (err) {
            return Promise.reject(err);
        }
    }
};

export default adaptor;
