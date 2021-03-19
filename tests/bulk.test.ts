import { expect } from 'chai';
import { describe, it } from 'mocha';

import $$storage from '../src/index';

function clean() {
    localStorage.clear();
    sessionStorage.clear();
}

describe('Bulk Operations', () => {
    clean();

    it('Batch to get / set.', () => {
        $$storage.setAll({ key1: 'val1', key2: 'val2', key3: 'val3' });
        expect($$storage.getAll(['key1', 'key2'])).deep.equal({ key1: 'val1', key2: 'val2' });
    });

    it('Batch to remove.', () => {
        $$storage.removeAll(['key1', 'key2']);
        expect($$storage.get('key1')).to.be.null;
        expect($$storage.get('key2')).to.be.null;
        expect($$storage.get('key3')).to.not.null;
    });

    it('Get all keys.', () => {
        expect($$storage.keys()).to.be.contain('key3');
    });

    it('Clear all keys.', () => {
        $$storage.clear();
        expect($$storage.keys()).to.be.empty;
    });
});
