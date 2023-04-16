import z from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validRequest } from './core';

describe('valid-request-joi', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const updateProductSchema = {
    params: z.object({
      productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
    }),
    body: z.object({
      name: z.string().transform((x) => x?.trim()),
      category: z.string().transform((x) => x?.trim()),
      price: z.number().min(0).multipleOf(0.01),
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
            name: 'ZodError',
            message: expect.any(String),
            errors: [
              expect.objectContaining({
                path: [],
                code: 'invalid_type',
                expected: 'object',
                message: 'Required',
              }),
            ],
          }),
          body: expect.objectContaining({
            name: 'ZodError',
            message: expect.any(String),
            errors: [
              expect.objectContaining({
                path: [],
                code: 'invalid_type',
                expected: 'object',
                message: 'Required',
              }),
            ],
          }),
        },
      })
    );
  });
});
