import validId from './index';
import { ObjectId } from 'mongodb';
import type { Request, Response, NextFunction } from 'express';

describe('valid-oid', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as any;
    res = {} as any;
    next = jest.fn();
  });

  it('valid ObjectId', () => {
    // setup
    const itemId = '63e7ea1cd33fc054cdc599d5';
    const req = { params: { itemId } } as any;

    // run
    validId('itemId')(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.params.itemId).toEqual(itemId);
    expect(req.itemId).toEqual(new ObjectId(itemId));
    expect(req.itemId.toString()).toEqual(itemId);
  });

  it('invalid ObjectId', () => {
    // setup
    const itemId = '1234';
    const req = { params: { itemId } } as any;

    // run
    validId('itemId')(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        name: 'ValidateIdError',
        message: 'itemId "1234" is not a valid ObjectId.',
      })
    );
  });

  it('missing ObjectId', () => {
    // setup
    const req = { params: {} } as any;

    // run
    validId('itemId')(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        name: 'ValidateIdError',
        message: 'itemId "undefined" is not a valid ObjectId.',
      })
    );
  });
});
