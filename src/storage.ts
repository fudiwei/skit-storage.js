import LocalStorageAdapter from './adapters/localstorage';
import { deserialize, serialize, StorageEntry } from './transform';

function _getNsPrefix(namespace: string): string {
    let n = String(namespace ?? '').trim();
    if (n) {
        n = n + '/';
    }

    return n;
}

function _getNsKey(namespace: string, key: string): string {
    return _getNsPrefix(namespace) + key;
}

function _readEntry<T>(adapter: SKIT.Storage.StorageAdapter, namespace: string, key: string): StorageEntry<T> | null {
    const text = adapter.get(_getNsKey(namespace, key));
    if (!text) {
        return null;
    }

    const entry = deserialize<T>(text);
    if (!entry) {
        return null;
    }

    if (entry.exp != null && entry.exp < new Date().getTime()) {
        adapter.remove(_getNsKey(namespace, key));
        return null;
    }

    return entry;
}

function _readEntryAsync<T>(adapter: SKIT.Storage.StorageAdapter, namespace: string, key: string): Promise<StorageEntry<T> | null> {
    return adapter.getAsync(_getNsKey(namespace, key)).then((text) => {
        if (!text) {
            return null;
        }

        const entry = deserialize<T>(text);
        if (!entry) {
            return null;
        }

        if (entry.exp != null && entry.exp < new Date().getTime()) {
            return adapter
                .removeAsync(_getNsKey(namespace, key))
                .then(() => {
                    return null;
                })
                .catch(() => {
                    return null;
                });
        }

        return entry;
    });
}

function _writeEntry<T>(adapter: SKIT.Storage.StorageAdapter, namespace: string, key: string, entry: StorageEntry<T>): void {
    if (entry.val != null) {
        adapter.set(_getNsKey(namespace, key), serialize<T>(entry));
    } else {
        adapter.remove(_getNsKey(namespace, key));
    }
}

function _writeEntryAsync<T>(adapter: SKIT.Storage.StorageAdapter, namespace: string, key: string, entry: StorageEntry<T>): Promise<void> {
    if (entry.val != null) {
        return adapter.setAsync(_getNsKey(namespace, key), serialize<T>(entry));
    } else {
        return adapter.removeAsync(_getNsKey(namespace, key));
    }
}

export class SkitStorage implements SKIT.Storage.StorageInstance {
    private _adapter: SKIT.Storage.StorageAdapter;
    private _namespace: string;

    public get namespace(): string {
        return this._namespace;
    }

    constructor(config?: SKIT.Storage.StorageConfig) {
        this._adapter = config?.adapter ?? LocalStorageAdapter;
        this._namespace = String(config?.namespace ?? '').trim();

        if (!/^[a-zA-Z0-9_\-\\/:]*$/.test(this._namespace)) {
            throw new Error('The value of namespace can only have alphanumerics, underscores, dashes, slashes and colons.');
        }
    }

    public keys(options?: SKIT.Storage.StorageKeysOptions) {
        let prefix = _getNsPrefix(this._namespace);
        let arrKey = this._adapter.keys();

        if (this._namespace) {
            arrKey = arrKey.filter((e) => e.startsWith(prefix));
            arrKey = arrKey.map((e) => e.substr(prefix.length));
        }

        if (options?.eliminated) {
            arrKey = arrKey.filter((key) => _readEntry(this._adapter, this._namespace, key) != null);
        }

        return arrKey;
    }

    public keysAsync(options?: SKIT.Storage.StorageKeysOptions) {
        return this._adapter.keysAsync().then((keys) => {
            let prefix = _getNsPrefix(this._namespace);
            let arrKey = keys;

            if (this._namespace) {
                arrKey = arrKey.filter((e) => e.startsWith(prefix));
                arrKey = arrKey.map((e) => e.substr(prefix.length));
            }

            if (options?.eliminated) {
                const arrTask = Promise.all(arrKey.map((key) => _readEntryAsync(this._adapter, this._namespace, key)));
                return arrTask.then((res) => arrKey.filter((_, i) => res[i] != null));
            }

            return arrKey;
        });
    }

    public has(key: string) {
        const keys = this.keys({ eliminated: true });
        return keys.includes(_getNsKey(this._namespace, key));
    }

    public hasAsync(key: string) {
        const task = this.keysAsync({ eliminated: true });
        return task.then((keys) => keys.includes(_getNsKey(this._namespace, key)));
    }

    public get<T = string>(key: string, defaultVal?: T) {
        return _readEntry<T>(this._adapter, this._namespace, key)?.val ?? defaultVal ?? null;
    }

    public getAsync<T = string>(key: string, defaultVal?: T) {
        return _readEntryAsync<T>(this._adapter, this._namespace, key).then((entry) => {
            return entry?.val ?? defaultVal ?? null;
        });
    }

    public getAll(keys: string[] | SKIT.Storage.IAnyObject, defaultVal?: SKIT.Storage.IAnyObject) {
        const arrKey = Array.isArray(keys) ? keys : Object.keys(keys);
        const arrEntries = arrKey.map((key) => [key, this.get(key)]);
        return Object.assign({}, defaultVal, Object.fromEntries(arrEntries));
    }

    public getAllAsync(keys: string[] | SKIT.Storage.IAnyObject, defaultVal?: SKIT.Storage.IAnyObject) {
        const arrKey = Array.isArray(keys) ? keys : Object.keys(keys);
        const arrTask = arrKey.map((key) => this.getAsync(key));
        return Promise.all(arrTask).then((vals) => {
            const arrEntries = arrKey.map((key, i) => [key, vals[i]]);
            return Object.assign({}, defaultVal, Object.fromEntries(arrEntries));
        });
    }

    public set<T = string>(key: string, val: T, options?: SKIT.Storage.StorageSetOptions) {
        if (val === undefined || options?.ttl === 0) {
            return this.remove(key);
        }

        let expiresAt: number | undefined = undefined;
        if (options?.ttl && options.ttl > 0) {
            expiresAt = new Date().getTime() + options.ttl;
        }

        _writeEntry<T>(this._adapter, this._namespace, key, { val: val, exp: expiresAt });
    }

    public setAsync<T = string>(key: string, val: T, options?: SKIT.Storage.StorageSetOptions) {
        if (val === undefined || options?.ttl === 0) {
            return this.removeAsync(key);
        }

        let expiresAt: number | undefined = undefined;
        if (options?.ttl && options.ttl > 0) {
            expiresAt = new Date().getTime() + options.ttl;
        }

        return _writeEntryAsync<T>(this._adapter, this._namespace, key, { val: val, exp: expiresAt });
    }

    public setAll(item: SKIT.Storage.IAnyObject, options?: SKIT.Storage.StorageSetOptions) {
        Object.entries(item).forEach(([key, val]) => this.set(key, val, options));
    }

    public setAllAsync(item: SKIT.Storage.IAnyObject, options?: SKIT.Storage.StorageSetOptions) {
        const arrTask = Object.entries(item).map(([key, val]) => this.setAsync(key, val, options));
        return Promise.all(arrTask).then(() => Promise.resolve());
    }

    public remove(key: string) {
        this.removeAll([key]);
    }

    public removeAsync(key: string) {
        return this.removeAllAsync([key]);
    }

    public removeAll(keys: string[]) {
        if (!Array.isArray(keys)) {
            throw new TypeError('Invalid arguments.');
        }

        keys.forEach((key) => this._adapter.remove(_getNsKey(this._namespace, key)));
    }

    public removeAllAsync(keys: string[]) {
        if (!Array.isArray(keys)) {
            throw new TypeError('Invalid arguments.');
        }

        const arrTask = keys.map((key) => this._adapter.removeAsync(_getNsKey(this._namespace, key)));
        return Promise.all(arrTask).then(() => Promise.resolve());
    }

    public clear() {
        if (this._namespace) {
            const arrKey = this.keys();
            return arrKey.forEach((key) => this.remove(key));
        }

        this._adapter.clear();
    }

    public clearAsync() {
        if (this._namespace) {
            const arrKey = this.keys();
            const arrTask = arrKey.map((key) => this.removeAsync(key));
            return Promise.resolve(arrTask).then(() => Promise.resolve());
        }

        return this._adapter.clearAsync();
    }

    public ttl(key: string): number | null;
    public ttl(key: string, expiresIn: number): void;
    public ttl(key: string, expiresAt: Date): void;
    public ttl(key: string, expiry?: any): any {
        if (expiry === undefined) {
            const exp = _readEntry(this._adapter, this._namespace, key)?.exp;
            if (exp != null) {
                return Math.max(0, exp - new Date().getTime());
            }

            return null;
        } else {
            if (typeof expiry === 'number') {
                const entry = _readEntry(this._adapter, this._namespace, key);
                if (entry) {
                    entry.exp = expiry < 0 ? undefined : new Date().getTime() + expiry;
                    _writeEntry(this._adapter, this._namespace, key, entry);
                }
            } else if (expiry instanceof Date) {
                const entry = _readEntry(this._adapter, this._namespace, key);
                if (entry) {
                    entry.exp = expiry.getTime();
                    _writeEntry(this._adapter, this._namespace, key, entry);
                }
            } else {
                throw new TypeError('Invalid arguments.');
            }
        }
    }

    public ttlAsync(key: string): Promise<number | null>;
    public ttlAsync(key: string, expiresIn: number): Promise<void>;
    public ttlAsync(key: string, expiresAt: Date): Promise<void>;
    public ttlAsync(key: string, expiry?: any): any {
        if (expiry === undefined) {
            return _readEntryAsync(this._adapter, this._namespace, key).then((entry) => {
                const exp = entry?.exp;
                if (exp != null) {
                    return Math.max(0, exp - new Date().getTime());
                }

                return null;
            });
        } else {
            if (typeof expiry === 'number') {
                return _readEntryAsync(this._adapter, this._namespace, key).then((entry) => {
                    if (entry) {
                        entry.exp = expiry < 0 ? undefined : new Date().getTime() + expiry;
                        return _writeEntryAsync(this._adapter, this._namespace, key, entry);
                    }
                });
            } else if (expiry instanceof Date) {
                return _readEntryAsync(this._adapter, this._namespace, key).then((entry) => {
                    if (entry) {
                        entry.exp = entry.exp = expiry.getTime();

                        return _writeEntryAsync(this._adapter, this._namespace, key, entry);
                    }
                });
            } else {
                throw new TypeError('Invalid arguments.');
            }
        }
    }
}
