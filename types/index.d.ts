/// <reference path="./lib.storage.core.d.ts" />
/// <reference path="./lib.storage.adapter.d.ts" />

export const LocalStorageAdapter: SKIT.Storage.StorageAdapter;
export const SessionStorageAdapter: SKIT.Storage.StorageAdapter;
export const MiniprogramAdapter: SKIT.Storage.StorageAdapter;

declare const $$storage: SKIT.Storage.StorageStatic;
export default $$storage;
