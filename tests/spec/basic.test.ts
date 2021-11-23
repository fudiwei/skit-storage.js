import { expect } from 'chai';
import { describe, it } from 'mocha';

import $$storage from '../../src/index';

function clean() {
    localStorage.clear();
    sessionStorage.clear();
}

describe('Basic Usages', () => {
    clean();

    it('Set / Get a key-value as string.', () => {
        $$storage.set('key.string', 'value');
        expect($$storage.get('key.string')).to.be.equal('value');
    });

    it('Set / Get a key-value as number.', () => {
        $$storage.set('key.number', 4008008820);
        expect($$storage.get('key.number')).to.be.equal(4008008820);
    });

    it('Set / Get a key-value as boolean.', () => {
        $$storage.set('key.boolean', true);
        expect($$storage.get('key.boolean')).to.be.equal(true);
    });

    it('Set / Get a key-value as object.', () => {
        $$storage.set('key.object', { value: 'object' });
        expect($$storage.get('key.object')).deep.equal({ value: 'object' });
    });

    it('Set / Get a key-value as array.', () => {
        $$storage.set('key.array', [{ value: 'array' }]);
        expect($$storage.get('key.array')).deep.equal([{ value: 'array' }]);
    });

    it('Check if the key exists.', () => {
        expect($$storage.has('key.string')).to.true;
        expect($$storage.has('key.number')).to.true;
        expect($$storage.has('key.boolean')).to.true;
        expect($$storage.has('key.object')).to.true;
        expect($$storage.has('key.array')).to.true;
    });

    it('Remove a key-value.', () => {
        $$storage.remove('key.string');
        expect($$storage.get('key.string')).to.be.null;
    });

    it('Get a key-value with the default.', () => {
        $$storage.remove('key.string');
        expect($$storage.get('key.string', 'default')).to.be.equal('default');
    });
});
