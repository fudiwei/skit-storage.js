# @skit/storage

[![NPM Version](https://img.shields.io/npm/v/@skit/storage.svg?sanitize=true)](https://www.npmjs.com/package/@skit/storage)
[![NPM Download](https://img.shields.io/npm/dm/@skit/storage.svg?sanitize=true)](https://www.npmjs.com/package/@skit/storage)
[![Travis-CI](https://travis-ci.org/fudiwei/skit-storage.js.svg?branch=main)](https://travis-ci.org/fudiwei/skit-storage.js)
[![Dependency Status](https://david-dm.org/fudiwei/skit-storage.js.svg)](https://david-dm.org/fudiwei/skit-storage.js)
[![License](https://img.shields.io/github/license/fudiwei/skit-storage.js)](https://mit-license.org/)

更便捷地访问本地存储，支持强类型读写、命名空间、过期策略等特性，同时支持在浏览器和小程序中运行。

（[English Documentation](./README.md)）

---

## 特性

-   支持 LocalStorage、SessionStorage、**微信小程序、QQ 小程序、支付宝小程序、百度小程序、头条小程序**等环境，并支持自定义适配器以适配其他存储环境。

-   支持**命名空间**，不同命名空间下的存储相互隔离；

-   支持**过期策略**；

-   支持**强类型读写**（依赖于 JSON 序列化）；

-   支持**同步、异步**两种调用方式（取决于适配器）；

-   支持 **TypeScript**。

---

## 用法

### 安装：

```shell
npm install @skit/storage
```

### 导入：

```javascript
/* require */
const $$storage = require('@skit/storage');

/* import */
import $$storage from '@skit/storage';
```

### 基本用法：

```javascript
/* 写入字符串 */
$$storage.set('key', 'value');

/* 写入数值 */
$$storage.set('key', 1);

/* 写入对象 */
$$storage.set('key', { value: 'object' });

/* 读取 */
let val = $$storage.get('key'); // 会自动尝试反序列化回写入时的类型

/* 读取，如果不存在则返回默认值 */
let val = $$storage.get('key', 'default value');

/* 判断是否存在指定键 */
let flag = $$storage.has('key');

/* 删除 */
$$storage.remove('key');

/* 清空 */
$$storage.clear();
```

### 批量操作：

```javascript
/* 批量写入 */
$$storage.setAll({ key1: 'val1', key2: 'val2' });

/* 批量读取 */
let item = $$storage.getAll(['key1', 'key2']); // { key1: 'val1', key2: 'val2' }

/* 批量删除 */
$$storage.removeAll(['key1', 'key2']);

/* 获取全部键 */
$$storge.keys(); // ['key1', 'key2']
```

### 过期策略：

```javascript
/* 写入，同时设置相对过期时间（单位：毫秒） */
$$storage.set('key', 'val', { ttl: 1000 });

/* 写入，之后设置相对过期时间（单位：毫秒） */
$$storage.set('key', 'val');
$$storage.ttl('key', 1000);

/* 设置绝对过期时间 */
$$storage.ttl('key', new Date('2020-12-31 23:59:59'));

/* 取消过期时间 */
$$storage.ttl('key', -1);

/* 查看还有多久过期（单位：毫秒） */
$$storage.ttl('key'); // null 表示不过期
```

### 命名空间

```javascript
/* 创建两个命名空间 */
let storage1 = $$storage.create({ namespace: 'ns1' });
let storage2 = $$storage.create({ namespace: 'ns1' });

/* 命名空间彼此隔离，支持设置同名的键 */
storage1.set('key', 'val1');
storage2.set('key', 'val2');
storage1.get('key'); // val1
storage2.get('key'); // val2

/* 清空单个命名空间下的键 */
storage1.clear();

/* 清空所有命名空间下的键 */
$$storage.clear();
```

### 异步操作

```javascript
/* 异步写入 */
$$storage.setAsync('key', 'val');

/* 异步读取 */
$$storage.getAsync('key').then((val) => {});

/* 其他方法略，均为同名同步方法 + Async */
```

---

## 常见问题

### 1. 如何使用 LocalStorage / SessionStorage？

默认使用 LocalStorage，如果要切换到 SessionStorage，可以：

```javascript
import $$storage, { SessionStorageAdapter } from '@skit/storage';

const storage = $$storage.create({ adapter: SessionStorageAdapter });
storage.set('key', 'val');
storage.get('key');
```

### 2. 如何在小程序中使用？

类似上面：

```javascript
import $$storage, { MiniprogramAdapter } from '@skit/storage';

const storage = $$storage.create({ adapter: MiniprogramAdapter });
storage.set('key', 'val');
storage.get('key');
```

### 3. 如何编写自定义的适配器？

可以仿照内置的几个适配器源码，编写自定义的适配器来在不同的环境下访问本地存储（比如在 Chrome 插件中）。

使用时只需要像上面那样：

```javascript
import MyAdapter from './my-adapter';

const storage = $$storage.create({ adapter: MyAdapter });
```

### 4. 过期策略是如何实现的？

因为底层的本地存储并没有提供设置 TTL 的方法，所以实际上是在写入时一并记录了每个键的过期时间，在取出时与当前时间做一次计算，如果过期了则删除这个键。

需要注意的是，上述行为是“惰性”的，也即只有进行读取操作才会删除过期的键。

由于这种方式开销过大，所以仅在 `has()`、`get()`、`ttl()` 等几个方法中才会惰性删除，`keys()` 方法默认不会惰性删除，如果你希望只返回尚未过期的键，那么可以：

```javascript
/* 只返回尚未过期的所有键 */
$$storage.keys({ eliminated: true });
```

### 5. 想要存储 `Function` 等特殊类型怎么办？

最初是想实现一个 JS 序列化器来支持 `Function`、`Symbol`、`BigInt` 等特殊对象的存取的。但考虑到反序列化回来时基本都得依靠 `eval()` 等小程序中不支持的操作，外加实现这个序列化器本身就很复杂，这与这个工具类的定位有些不符。最后还是放弃了这个特性，只是简单的解决了一下 `JSON.stringify()` 循环引用的问题。

如果你确实需要类似的功能，可以自行引入其他第三方序列化器，在存取时当作普通字符串来处理。

### 6. 支持 IE 吗？

_dist_ 目录中提供了几个版本可供选择：

-   `index.min.js`：UMD 版本，最低适配到 IE8。

-   `index.modern.min.js`：UMD 版本，仅适配支持 ES6 完整特性的现代浏览器。

-   `index.cjs.min.js`：CommonJS 版本，仅适配 Node.js 9.0+ 环境。

-   `index.esm.min.js`：ES Modules 版本，仅适配支持 ES Modules 的现代浏览器或 Node.js 环境。

P.S. 原则上 `index.min.js` 也可以支持到 IE6，但因 IE6 上没有 LocalStorage 特性，需要你自行编写基于 IE UserData 的适配器，或引入第三方 polyfill。
