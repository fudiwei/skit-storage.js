import { expect } from 'chai';
import { describe, it } from 'mocha';

import $$storage from '../../src/index';

function clean() {
    localStorage.clear();
    sessionStorage.clear();
}

describe('Namespacings', () => {
    clean();

    let storage1 = $$storage.create({ namespace: 'ns1' });
    let storage2 = $$storage.create({ namespace: 'ns2' });

    it('Set a key-value in namespaces.', () => {
        storage1.set('key', 'val1');
        storage2.set('key', 'val2');
        expect(storage1.keys().length).to.be.equal(1);
        expect(storage2.keys().length).to.be.equal(1);
    });

    it('Get or remove a key-value in namespaces.', () => {
        storage1.remove('key');
        expect(storage1.get('key')).to.be.null;
        expect(storage2.get('key')).to.be.equal('val2');
    });

    it('Clear all keys in one namespace.', () => {
        storage1.set('key', 'val2');
        storage1.clear();
        expect(storage1.get('key')).to.be.null;
        expect(storage2.get('key')).to.be.equal('val2');
    });

    it('Clear all keys in all namespaces.', () => {
        storage1.set('key', 'val1');
        storage2.set('key', 'val2');
        $$storage.clear();
        expect(storage1.keys()).to.be.empty;
        expect(storage2.keys()).to.be.empty;
    });
});
