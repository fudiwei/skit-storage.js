declare const qq: typeof wx;
declare const my: typeof wx;
declare const swan: typeof wx;
declare const tt: typeof wx;
declare const uni: typeof wx;

const provider = (function () {
    if ('object' === typeof wx && 'function' === typeof wx['getStorage']) {
        // 微信小程序
        return wx;
    } else if ('object' === typeof qq && 'function' === typeof qq['getStorage']) {
        // QQ 小程序
        return qq;
    } else if ('object' === typeof my && 'function' === typeof my['getStorage']) {
        // 支付宝小程序
        return my;
    } else if ('object' === typeof swan && 'function' === typeof swan['getStorage']) {
        // 百度小程序
        return swan;
    } else if ('object' === typeof tt && 'function' === typeof tt['getStorage']) {
        // 头条小程序
        return tt;
    } else if ('object' === typeof uni && 'function' === typeof uni['getStorage']) {
        // uni-app
        return uni;
    }

    throw new Error('"Storage" is not provided');
})();

const adaptor: SKIT.Storage.StorageAdapter = {
    keys() {
        return provider.getStorageInfoSync().keys;
    },

    keysAsync() {
        return new Promise((resolve, reject) => {
            provider.getStorageInfo({
                success: (res) => resolve(res.keys),
                fail: (err) => reject(err)
            });
        });
    },

    get(key) {
        return provider.getStorageSync(key);
    },

    getAsync(key) {
        return new Promise((resolve, reject) => {
            provider.getStorage({
                key: key,
                success: (res) => resolve(res.data),
                fail: (err) => reject(err)
            });
        });
    },

    set(key, val) {
        provider.setStorageSync(key, val);
    },

    setAsync(key, val) {
        return new Promise((resolve, reject) => {
            provider.setStorage({
                key: key,
                data: val,
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    },

    remove(key) {
        provider.removeStorageSync(key);
    },

    removeAsync(key) {
        return new Promise((resolve, reject) => {
            provider.removeStorage({
                key: key,
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    },

    clear() {
        provider.clearStorageSync();
    },

    clearAsync() {
        return new Promise((resolve, reject) => {
            provider.clearStorage({
                success: () => resolve(),
                fail: (err) => reject(err)
            });
        });
    }
};

export default adaptor;
