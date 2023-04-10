import { ObjectId, ZodObjectId, zObjectId } from './index';

describe('joi-mongodb', () => {
  let schema: ZodObjectId;
  beforeAll(() => {
    schema = zObjectId;
  });

  it('valid: ObjectId', () => {
    const id = new ObjectId();
    expect(schema.safeParse(id)).toEqual({ success: true, data: id });
  });

  it('valid: string', () => {
    const id = '63e9a03470d59eb137245667';
    expect(schema.safeParse(id)).toEqual({ success: true, data: new ObjectId(id) });
  });

  it('invalid: string', () => {
    const id = '123';
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: number', () => {
    const id = 123;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: empty string', () => {
    const id = '';
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: empty object', () => {
    const id = {};
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: empty array', () => {
    const id = [] as any;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: true', () => {
    const id = true;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: false', () => {
    const id = false;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('invalid: null', () => {
    const id = null;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });

  it('undefined: optional', () => {
    const id = undefined;
    expect(schema.optional().safeParse(id)).toEqual({ success: true });
  });

  it('undefined: required', () => {
    const id = undefined;
    expect(schema.safeParse(id)).toEqual({ success: false, error: expect.any(Error) });
  });
});
