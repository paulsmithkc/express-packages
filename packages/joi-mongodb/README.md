# joi-mongodb

Joi custom validator for MongoDB ObjectId.

## Install

```bash
npm install joi-mongodb
```

## Usage

In your application entry point (index.js/server.js/app.js):

```js
const Joi = require('joi');
require('joi-mongodb')(Joi);
```

Then it can be used just like any other Joi type:

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
