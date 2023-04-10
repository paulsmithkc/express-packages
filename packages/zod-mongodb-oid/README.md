# zod-mongodb-oid

Custom Zod validator for MongoDB ObjectId.

## Install

```bash
npm install zod-mongodb-oid
```

## CommonJS Usage

```js
const z = require('zod');
const { zObjectId } = require('zod-mongodb-oid');

const schema = z.object({
  _id: zObjectId,
  name: z.string(),
  date: z.date(),
});
```

## ESM Usage

```js
import z from 'zod';
import { zObjectId } from 'zod-mongodb-oid';

const schema = z.object({
  _id: zObjectId,
  name: z.string(),
  date: z.date(),
});
```

## TS Usage

```js
import z from 'zod';
import { zObjectId } from 'zod-mongodb-oid';

const schema = z.object({
  _id: zObjectId,
  name: z.string(),
  date: z.date(),
});
```

## Related Packages

- [zod](https://www.npmjs.com/package/zod)
- [mongodb](https://www.npmjs.com/package/mongodb)
