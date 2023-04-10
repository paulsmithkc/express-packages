import z from 'zod';
import { ObjectId, zObjectId } from '../dist/index.js';

// define schema
const schema = z.object({
  id: zObjectId,
});

// test values
const testValues = [undefined, null, false, true, 0, '', 123, '123', 'abc', new ObjectId(), new ObjectId().toString()];
console.log('TEST VALUES:', testValues);

// validate each test value
const results = testValues.map((x) => schema.safeParse({ id: x }));
console.log('RESULTS:', results);
