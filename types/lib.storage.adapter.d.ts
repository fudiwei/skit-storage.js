declare namespace SKIT.Storage {
    export interface StorageAdapter {
        keys(): string[];
        keysAsync(): Promise<string[]>;

        get(key: string): string | null;
        getAsync(key: string): Promise<string | null>;

        set(key: string, val: string): void;
        setAsync(key: string, val: string): Promise<void>;

        remove(key: string): void;
        removeAsync(key: string): Promise<void>;

        clear(): void;
        clearAsync(): Promise<void>;
    }
}
