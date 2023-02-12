import validRequest from './index';
import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';

describe('valid-request-joi', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const updateProductSchema = {
    params: Joi.object({
      productId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/, 'ObjectId')
        .required(),
    }),
    body: Joi.object({
      name: Joi.string().trim().required(),
      category: Joi.string().trim().required(),
      price: Joi.number().min(0).precision(2).required(),
    }),
  };

  beforeEach(() => {
    req = {} as any;
    res = {} as any;
    next = jest.fn();
  });

  it('valid request', () => {
    // setup
    const productId = '63e7ea1cd33fc054cdc599d5';
    const name = 'New Name';
    const category = 'New Category';
    const price = 12.95;
    const req = {
      params: { productId },
      body: { name, category, price },
    } as any;

    // run
    validRequest(updateProductSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.params).toEqual({ productId });
    expect(req.body).toEqual({ name, category, price });
  });

  it('valid request: null schemas', () => {
    // setup
    const productId = '63e7ea1cd33fc054cdc599d5';
    const name = 'New Name';
    const category = 'New Category';
    const price = 12.95;
    const req = {
      params: { productId },
      body: { name, category, price },
    } as any;

    // run
    validRequest({ params: null, body: null })(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.params).toEqual({ productId });
    expect(req.body).toEqual({ name, category, price });
  });

  it('valid request: null schema map', () => {
    // setup
    const productId = '63e7ea1cd33fc054cdc599d5';
    const name = 'New Name';
    const category = 'New Category';
    const price = 12.95;
    const req = {
      params: { productId },
      body: { name, category, price },
    } as any;

    // run
    validRequest(null)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.params).toEqual({ productId });
    expect(req.body).toEqual({ name, category, price });
  });

  it('invalid body: empty request', () => {
    // setup
    const req = {} as any;

    // run
    validRequest(updateProductSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ValidateRequestError',
        message: 'Request data is invalid. See details.',
        details: {
          params: expect.objectContaining({
            name: 'ValidationError',
            message: '"req.params" is required',
          }),
          body: expect.objectContaining({
            name: 'ValidationError',
            message: '"req.body" is required',
          }),
        },
      })
    );
  });
});
