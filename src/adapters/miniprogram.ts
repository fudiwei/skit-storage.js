declare const qq: typeof wx;
declare const my: typeof wx;
declare const swan: typeof wx;
declare const tt: typeof wx;

const getProvider = (function () {
    let provider: typeof wx;

    return function () {
        if (!provider) {
            if ('object' === typeof wx && 'function' === typeof wx['getStorage']) {
                provider = wx;
            } else if ('object' === typeof qq && 'function' === typeof qq['getStorage']) {
                // QQ 小程序
                provider = qq;
            } else if ('object' === typeof my && 'function' === typeof my['getStorage']) {
                // 支付宝小程序
                provider = my;
            } else if ('object' === typeof swan && 'function' === typeof swan['getStorage']) {
                // 百度小程序
                provider = swan;
            } else if ('object' === typeof tt && 'function' === typeof tt['getStorage']) {
                // 头条小程序
                provider = tt;
            } else {
                throw new Error('Unsupported hosting environment, may be not in a mini-program.');
            }
        }

        return provider;
    };
})();

const adaptor: SKIT.Storage.StorageAdapter = {
    keys() {
        return getProvider().getStorageInfoSync().keys;
    },

    keysAsync() {
        return new Promise((resolve, reject) => {
            getProvider().getStorageInfo({
                success: (res) => resolve(res.keys),
                fail: (err) => reject(err)
            });
        });
    },

    get(key) {
        return getProvider().getStorageSync(key);
    },

    getAsync(key) {
        return new Promise((resolve, reject) => {
            getProvider().getStorage({
                key: key,
                success: (res) => resolve(res.data),
                fail: (err) => reject(err)
            });
        });
    },

    set(key, val) {
        getProvider().setStorageSync(key, val);
    },

    setAsync(key, val) {
        return new Promise((resolve, reject) => {
            getProvider().setStorage({
                key: key,
                data: val,
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    },

    remove(key) {
        getProvider().removeStorageSync(key);
    },

    removeAsync(key) {
        return new Promise((resolve, reject) => {
            getProvider().removeStorage({
                key: key,
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    },

    clear() {
        getProvider().clearStorageSync();
    },

    clearAsync() {
        return new Promise((resolve, reject) => {
            getProvider().clearStorage({
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    }
};

export default adaptor;
