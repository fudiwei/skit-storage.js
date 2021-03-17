export interface StorageEntry<T> {
    val: T;
    exp?: number;
}

export function deserialize<T = any>(text: string): StorageEntry<T> | null {
    try {
        const res = JSON.parse(text);
        if (res != null) {
            if (res.val != null) {
                return res;
            }

            return { val: res };
        }
    } catch (err) {
        console.error(err);
    }

    return null;
}

export function serialize<T = any>(entry: StorageEntry<T>): string {
    let cache: object[] | null = [];
    try {
        return JSON.stringify(entry, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache!.indexOf(value) !== -1) {
                    return;
                }
                cache!.push(value);
            }
            return value;
        });
    } catch (err) {
        console.error(err);
    } finally {
        cache = null;
    }

    return '';
}
