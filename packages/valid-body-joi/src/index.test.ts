import validBody from './index';
import Joi from 'joi';
import type { Request, Response, NextFunction } from 'express';

describe('valid-body-joi', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().required(),
  });

  beforeEach(() => {
    req = {} as any;
    res = {} as any;
    next = jest.fn();
  });

  it('valid body', () => {
    // setup
    const email = 'admin@example.com';
    const password = 'password';
    const req = { body: { email, password } } as any;

    // run
    validBody(loginSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ email, password });
  });

  it('valid body: sanitize data', () => {
    // setup
    const email = ' AdmiN@ExampLe.COM ';
    const password = ' P@ssword123 ';
    const req = { body: { email, password } } as any;

    // run
    validBody(loginSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.body).toEqual({ email: 'admin@example.com', password: 'P@ssword123' });
  });

  it('invalid body: wrong types', () => {
    // setup
    const req = { body: { email: 123, password: 456 } } as any;

    // run
    validBody(loginSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ValidationError',
        message: '"email" must be a string. "password" must be a string',
      })
    );
  });

  it('invalid body: empty request', () => {
    // setup
    const req = { body: {} } as any;

    // run
    validBody(loginSchema)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ValidationError',
        message: '"email" is required. "password" is required',
      })
    );
  });
});
