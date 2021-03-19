; (function ($$storage) {
    function clean () {
        localStorage.clear();
        sessionStorage.clear();
    }

    QUnit.test("Type checking", function (assert) {
        clean();

        assert.ok('function' === typeof $$storage['create'], '`$$storage.create()` exists.');
        assert.ok('function' === typeof $$storage['keys'], '`$$storage.keys()` exists.');
        assert.ok('function' === typeof $$storage['keysAsync'], '`$$storage.keysAsync()` exists.');
        assert.ok('function' === typeof $$storage['has'], '`$$storage.has()` exists.');
        assert.ok('function' === typeof $$storage['hasAsync'], '`$$storage.hasAsync()` exists.');
        assert.ok('function' === typeof $$storage['get'], '`$$storage.get()` exists.');
        assert.ok('function' === typeof $$storage['getAsync'], '`$$storage.getAsync()` exists.');
        assert.ok('function' === typeof $$storage['getAll'], '`$$storage.getAll()` exists.');
        assert.ok('function' === typeof $$storage['getAllAsync'], '`$$storage.getAllAsync()` exists.');
        assert.ok('function' === typeof $$storage['set'], '`$$storage.set()` exists.');
        assert.ok('function' === typeof $$storage['setAsync'], '`$$storage.setAsync()` exists.');
        assert.ok('function' === typeof $$storage['setAll'], '`$$storage.setAll()` exists.');
        assert.ok('function' === typeof $$storage['setAllAsync'], '`$$storage.setAllAsync()` exists.');
        assert.ok('function' === typeof $$storage['remove'], '`$$storage.remove()` exists.');
        assert.ok('function' === typeof $$storage['removeAsync'], '`$$storage.removeAsync()` exists.');
        assert.ok('function' === typeof $$storage['removeAll'], '`$$storage.removeAll()` exists.');
        assert.ok('function' === typeof $$storage['removeAllAsync'], '`$$storage.removeAllAsync()` exists.');
        assert.ok('function' === typeof $$storage['clear'], '`$$storage.clear()` exists.');
        assert.ok('function' === typeof $$storage['clearAsync'], '`$$storage.clearAsync()` exists.');
        assert.ok('function' === typeof $$storage['ttl'], '`$$storage.ttl()` exists.');
        assert.ok('function' === typeof $$storage['ttlAsync'], '`$$storage.ttlAsync()` exists.');
        assert.ok('string' === typeof $$storage['namespace'], '`$$storage.namespace` exists.');
    });

    QUnit.test("Basic Usages", function (assert) {
        clean();

        $$storage.set('key.string', 'value');
        assert.equal($$storage.get('key.string'), 'value', 'Set / Get a key-value as string.');

        $$storage.set('key.number', 4008008820);
        assert.equal($$storage.get('key.number'), 4008008820, 'Set / Get a key-value as number.');

        $$storage.set('key.boolean', true);
        assert.equal($$storage.get('key.boolean'), true, 'Set / Get a key-value as boolean.');

        $$storage.set('key.object', { value: 'object' });
        assert.deepEqual($$storage.get('key.object'), { value: 'object' }, 'Set / Get a key-value as object.');

        $$storage.set('key.array', [{ value: 'array' }]);
        assert.deepEqual($$storage.get('key.array'), [{ value: 'array' }], 'Set / Get a key-value as array.');

        assert.ok(
            $$storage.has('key.string') &&
            $$storage.has('key.number') &&
            $$storage.has('key.boolean') &&
            $$storage.has('key.object') &&
            $$storage.has('key.array'),
            'Check if the key exists.'
        );

        $$storage.remove('key.string');
        assert.ok($$storage.get('key.string') == null, 'Remove a key-value.');
        assert.equal($$storage.get('key.string', 'default'), 'default', 'Get a key-value with the default.');
    });

    QUnit.test("Bulk Operations", function (assert) {
        clean();

        $$storage.setAll({ 'key1': 'val1', 'key2': 'val2', 'key3': 'val3' });
        assert.deepEqual(
            $$storage.getAll(['key1', 'key2']),
            { 'key1': 'val1', 'key2': 'val2' },
            'Batch to get / set.'
        );

        $$storage.removeAll(['key1', 'key2']);
        assert.ok(
            $$storage.get('key1') == null &&
            $$storage.get('key2') == null &&
            $$storage.get('key3') != null,
            'Batch to remove'
        );

        assert.ok($$storage.keys().indexOf('key3') !== -1, 'Get all keys.');

        $$storage.clear();
        assert.ok($$storage.keys().length === 0, 'Clear all keys.');
    });

    QUnit.test("Namespacings", function (assert) {
        clean();

        let storage1 = $$storage.create({ namespace: 'ns1' });
        let storage2 = $$storage.create({ namespace: 'ns2' });

        storage1.set('key', 'val1');
        storage2.set('key', 'val2');
        assert.ok(
            storage1.keys().length === 1 &&
            storage2.keys().length === 1,
            'Set a key-value in namespaces.'
        );

        storage1.remove('key');
        assert.equal(storage2.get('key'), 'val2', 'Get or remove a key-value in namespaces.');

        storage1.set('key', 'val1');
        storage1.clear();
        assert.equal(storage1.get('key'), null, 'Clear all keys in one namespace.');

        storage1.set('key', 'val1');
        storage2.set('key', 'val2');
        $$storage.clear();
        assert.ok(
            storage1.keys().length === 0 &&
            storage2.keys().length === 0,
            'Clear all keys in all namespaces.'
        );
    });

    QUnit.test("Expiration Cache", function (assert) {
        clean();

        let done = assert.async();

        $$storage.set('key1', 'val1', { ttl: 100 });
        setTimeout(function () {
            assert.ok($$storage.get('key1') != null, 'Set a key-value with TTL, and get it before expiry time.');
        }, 50);
        setTimeout(function () {
            assert.ok($$storage.get('key1') == null, 'Set a key-value with TTL, and get it after expiry time.');
        }, 101);

        $$storage.set('key2', 'val2', { ttl: 500 });
        setTimeout(function () {
            assert.ok($$storage.ttl('key2') > 0, 'Get TTL of a key.');
            $$storage.ttl('key2', 1000);
        }, 200);
        setTimeout(function () {
            assert.ok($$storage.get('key2') != null, 'Set TTL of a key.');
            done();
        }, 501);
    });
})(window.$$storage);
