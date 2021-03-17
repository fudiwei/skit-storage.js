declare namespace SKIT.Storage {
    type IAnyObject = Record<string, any>;

    export interface StorageConfig {
        adapter?: StorageAdapter;
        namespace?: string;
    }

    export interface StorageSetOptions {
        ttl?: number;
    }

    export interface StorageKeysOptions {
        eliminated?: boolean;
    }

    export interface StorageInstance {
        namespace: string;

        keys(options?: StorageKeysOptions): string[];
        keysAsync(options?: StorageKeysOptions): Promise<string[]>;

        has(key: string): boolean;
        hasAsync(key: string): Promise<boolean>;

        get<T = string>(key: string, defaultVal?: T): T | null;
        getAsync<T = string>(key: string, defaultVal?: T): Promise<T | null>;

        getAll(keys: string[] | IAnyObject, defaultVal?: IAnyObject): IAnyObject;
        getAllAsync(keys: string[] | IAnyObject, defaultVal?: IAnyObject): Promise<IAnyObject>;

        set<T = string>(key: string, val: T, options?: StorageSetOptions): void;
        setAsync<T = string>(key: string, val: T, options?: SKIT.Storage.StorageSetOptions): Promise<void>;

        setAll(item: IAnyObject, options?: StorageSetOptions): void;
        setAllAsync(item: IAnyObject, options?: StorageSetOptions): void;

        remove(key: string): void;
        removeAsync(key: string): Promise<void>;

        removeAll(keys: string[]): void;
        removeAllAsync(keys: string[]): Promise<void>;

        clear(): void;
        clearAsync(): Promise<void>;

        ttl(key: string): number | null;
        ttl(key: string, expiresIn: number): void;
        ttl(key: string, expiresAt: Date): void;
        ttlAsync(key: string): Promise<number | null>;
        ttlAsync(key: string, expiresIn: number): Promise<void>;
        ttlAsync(key: string, expiresAt: Date): Promise<void>;
    }

    export interface StorageStatic extends StorageInstance {
        create(config?: StorageConfig): StorageInstance;
    }
}
