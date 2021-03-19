import { expect } from 'chai';
import { describe, it } from 'mocha';

import $$storage from '../src/index';

function clean() {
    localStorage.clear();
    sessionStorage.clear();
}

describe('Expiration Cache', () => {
    clean();

    it('Set a key-value with TTL.', (done) => {
        $$storage.set('key1', 'val1', { ttl: 100 });

        setTimeout(function () {
            expect($$storage.get('key1')).to.not.null;
        }, 50);

        setTimeout(function () {
            expect($$storage.get('key1')).to.be.null;
            done();
        }, 101);
    });

    it('Get / Set TTL of a key.', (done) => {
        $$storage.set('key2', 'val2', { ttl: 500 });

        setTimeout(function () {
            expect($$storage.ttl('key2')).to.be.greaterThan(0);
            $$storage.ttl('key2', 1000);
        }, 200);

        setTimeout(function () {
            expect($$storage.get('key2')).to.not.null;
            done();
        }, 501);
    });
});
