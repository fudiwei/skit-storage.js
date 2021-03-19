/// <reference path="../types/index.d.ts" />

import LocalStorageAdapter from './adapters/localstorage';
import SessionStorageAdapter from './adapters/sessionstorage';
import MiniprogramAdapter from './adapters/miniprogram';
import { SkitStorage } from './storage';

const $$storage: SKIT.Storage.StorageStatic = Object.freeze(
    Object.assign(
        new SkitStorage(),
        {
            create(config?: SKIT.Storage.StorageConfig) {
                return new SkitStorage(config);
            }
        },
        {
            LocalStorageAdapter,
            SessionStorageAdapter,
            MiniprogramAdapter
        }
    )
);

export { LocalStorageAdapter, SessionStorageAdapter, MiniprogramAdapter, $$storage };
export default $$storage;
