# @skit/storage

[![NPM Version](https://img.shields.io/npm/v/@skit/storage.svg?sanitize=true)](https://www.npmjs.com/package/@skit/storage)
[![NPM Download](https://img.shields.io/npm/dm/@skit/storage.svg?sanitize=true)](https://www.npmjs.com/package/@skit/storage)
[![Travis-CI](https://travis-ci.org/fudiwei/skit-storage.js.svg?branch=main)](https://travis-ci.org/fudiwei/skit-storage.js)
[![Dependency Status](https://david-dm.org/fudiwei/skit-storage.js.svg)](https://david-dm.org/fudiwei/skit-storage.js)
[![License](https://img.shields.io/github/license/fudiwei/skit-storage.js)](https://mit-license.org/)

A better way to use storage (strong typing, namespacing, ttl, etc).

（[中文文档](./README.zh-CN.md)）

---

## Features

-   Supports LocalStorage, SessionStorage, **Wechat Mini-Program, QQ Mini-Progam, Alipay Mini-Program, Baidu Smart-Program, ByteDance Micro-App**, and supports custom adapters to adapt to other environments.

-   Supports **namespacing**. Data stored in different namespaces are isolated from each other.

-   Supports setting TTL values for **auto expiring** stored keys.

-   Supports **strong typing** (based on JSON).

-   Supports **synchronous and asynchronous API** both.

-   Supports **TypeScript**.

---

## Usage

### Install:

```shell
npm install @skit/storage
```

### Import:

```javascript
/* require */
const $$storage = require('@skit/storage');

/* import */
import $$storage from '@skit/storage';
```

### Basic:

```javascript
/* set a string data under key */
$$storage.set('key', 'value');

/* set a number data under key */
$$storage.set('key', 1);

/* set an object data under key */
$$storage.set('key', { value: 'object' });

/* get and parse data stored under key */
let val = $$storage.get('key'); // 会自动尝试反序列化回写入时的类型

/* get default value if the key does not exist */
let val = $$storage.get('key', 'default value');

/* check whether the key exists */
let flag = $$storage.has('key');

/* remove key and its data */
$$storage.remove('key');

/* clear all keys */
$$storage.clear();
```

### Bulk:

```javascript
/* batch set */
$$storage.setAll({ key1: 'val1', key2: 'val2' });

/* batch get */
let item = $$storage.getAll(['key1', 'key2']); // { key1: 'val1', key2: 'val2' }

/* batch remove */
$$storage.removeAll(['key1', 'key2']);

/* get all keys */
$$storge.keys(); // ['key1', 'key2']
```

### Expiration:

```javascript
/* set value and TTL at the same time */
$$storage.set('key', 'val', { ttl: 1000 });

/* set value, and set a relative expiration time  */
$$storage.set('key', 'val');
$$storage.ttl('key', 1000);

/* set an absolute expiration time */
$$storage.ttl('key', new Date('2020-12-31 23:59:59'));

/* set to not expire */
$$storage.ttl('key', -1);

/* get TTL */
$$storage.ttl('key'); // `null` means never expire
```

### Namespacings:

```javascript
/* create two namespaces */
let storage1 = $$storage.create({ namespace: 'ns1' });
let storage2 = $$storage.create({ namespace: 'ns1' });

/* allow keys with the same name in different namespaces */
storage1.set('key', 'val1');
storage2.set('key', 'val2');
storage1.get('key'); // val1
storage2.get('key'); // val2

/* clear the keys under a namespace */
storage1.clear();

/* clear all the keys */
$$storage.clear();
```

### Asynchronous:

```javascript
/* async set */
$$storage.setAsync('key', 'val');

/* async get */
$$storage.getAsync('key').then((val) => {});

/* async remove */
$$storage.removeAsync('key');
```

---

## FAQ

### 1. How to use LocalStorage / SessionStorage?

Use LocalStorage by default. If you want to switch to SessionStorage, please:

```javascript
import $$storage, { SessionStorageAdapter } from '@skit/storage';

const storage = $$storage.create({ adapter: SessionStorageAdapter });
storage.set('key', 'val');
storage.get('key');
```

### 2. How to use in Mini-Program?

Like above:

```javascript
import $$storage, { MiniprogramAdapter } from '@skit/storage';

const storage = $$storage.create({ adapter: MiniprogramAdapter });
storage.set('key', 'val');
storage.get('key');
```

### 3. How to write a custom adapter?

You can refer to the built-in adapter source codes and write a custom adapter to access storage in different environments (for example, in a Chrome plugin).

Use it like the above:

```javascript
import MyAdapter from './my-adapter';

const storage = $$storage.create({ adapter: MyAdapter });
```

### 4. How is the expiration strategy implemented?

Since the underlying layer does not provide a way to set TTL, it actually records the expiration time of each key when writing, and calculates the current time when it is taken out, and deletes the key if it expires.

It should be noted that the above behavior is "LAZY", that is, expired keys will only be deleted when reading.

Because this method is too expensive, it will only be deleted lazily in several methods such as `has()`, `get()`, and `ttl()`. The `keys()` method will not delete lazily by default. If you want to return only keys that have not expired, you can:

```javascript
/* Only return keys that have not expired */
$$storage.keys({ eliminated: true });
```

### 5. What if I want to store special types such as `Function`?

If you really need similar functions, you can import other third-party serializers and treat them as ordinary strings when accessing data.

### 6. Does it support IE?

There are several versions to choose from in the _dist_ directory:

-   `index.js`：babel translated, uncompressed, IE8+ supported.

-   `index.min.js`：babel translated, compressed, IE8+ supported.

-   `index.modern.js`：Only modern browsers supported

P.S. In principle, it can also support IE6+. But because there is no LocalStorage feature on IE6-7, you need to write your own adapter based on IE UserData or polyfills.
