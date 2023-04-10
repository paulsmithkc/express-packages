import JoiMongoDB, { ObjectId } from '../dist/index.js';

// inject objectId validator
const Joi = JoiMongoDB();

// define schema
const schema = Joi.object({
  id: Joi.objectId().required(),
});

// test values
const testValues = [undefined, null, false, true, 0, '', 123, '123', 'abc', ObjectId(), ObjectId().toString()];
console.log('TEST VALUES:', testValues);

// validate each test value
const results = testValues.map((x) => schema.validate({ id: x }));
console.log('RESULTS:', results);