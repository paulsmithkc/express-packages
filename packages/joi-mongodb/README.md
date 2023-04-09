# joi-mongodb

Joi custom validator for MongoDB ObjectId.

## Install

```bash
npm install joi-mongodb
```

## CommonJS Usage

In your application's entry point (index.js/server.js/app.js):

```js
const Joi = require('joi-mongodb')(Joi);
```

Then the `objectId()` validator can be used just like any other Joi validator:

```js
const schema = Joi.object({
  _id: Joi.objectId(),
  name: Joi.string(),
  date: Joi.date(),
});
```

## ESM Usage

In your application's entry point (index.js/server.js/app.js):

```js
import JoiMongoDB from 'joi-mongodb';
const Joi = JoiMongoDB();
```

Then the `objectId()` validator can be used just like any other Joi validator:

```js
const schema = Joi.object({
  _id: Joi.objectId(),
  name: Joi.string(),
  date: Joi.date(),
});
```

## TS Usage

Inject the objectId validator:

```js
import JoiMongoDB from 'joi-mongodb';
const Joi = JoiMongoDB();
```

Then the `objectId()` validator can be used just like any other Joi validator:

```js
const schema = Joi.object({
  _id: Joi.objectId(),
  name: Joi.string(),
  date: Joi.date(),
});
```

## Similar Packages

- [joi-objectid](https://www.npmjs.com/package/joi-objectid)
- [joi-oid](https://www.npmjs.com/package/joi-oid)
- [joi-objectid-validator](https://www.npmjs.com/package/joi-objectid-validator)
- [joi-mongodb-objectid](https://www.npmjs.com/package/joi-mongodb-objectid)
- [joi-mongoose-objectid](https://www.npmjs.com/package/joi-mongoose-objectid)
- [joi-objectid-extension](https://www.npmjs.com/package/joi-objectid-extension)
- [object-id-joi-extension](https://www.npmjs.com/package/object-id-joi-extension)
