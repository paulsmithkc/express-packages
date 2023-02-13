const Joi = require('joi');
require('./index')(Joi);

const { ObjectId } = require('mongodb');
const schema = Joi.object({
  id: Joi.objectId().required(),
});
const testData = [
  undefined,
  null,
  false,
  true,
  0,
  '',
  123,
  '123',
  'abc',
  ObjectId(),
  ObjectId().toString(),
];

console.log(testData);

const results = testData.map((x) => schema.validate({ id: x }));
console.log(results);
