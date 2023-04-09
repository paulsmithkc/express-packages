import JoiMongoDB, { ObjectId, ObjectIdSchema } from './index';

describe('joi-mongodb', () => {
  let schema: ObjectIdSchema;
  beforeAll(() => {
    schema = JoiMongoDB().objectId();
  });

  it('valid: ObjectId', () => {
    const id = new ObjectId();
    expect(schema.validate(id)).toEqual({ value: id });
  });

  it('valid: string', () => {
    const id = '63e9a03470d59eb137245667';
    expect(schema.validate(id)).toEqual({ value: new ObjectId(id) });
  });

  it('invalid: string', () => {
    const id = '123';
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: number', () => {
    const id = 123;
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: empty string', () => {
    const id = '';
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: empty object', () => {
    const id = {};
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: empty array', () => {
    const id = [] as any;
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: true', () => {
    const id = true;
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: false', () => {
    const id = false;
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('invalid: null', () => {
    const id = null;
    expect(schema.validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });

  it('undefined: optional', () => {
    const id = undefined;
    expect(schema.optional().validate(id)).toEqual({ value: id });
  });

  it('undefined: required', () => {
    const id = undefined;
    expect(schema.required().validate(id)).toEqual({ value: id, error: expect.any(Error) });
  });
});
