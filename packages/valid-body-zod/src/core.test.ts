import z from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validBody } from './core';

describe('valid-body-zod', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  const loginSchema = z.object({
    email: z.string().transform((x) => x?.trim()?.toLowerCase()),
    password: z.string().transform((x) => x?.trim()),
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
        name: 'ZodError',
        message: expect.any(String),
        errors: [
          expect.objectContaining({
            path: ['email'],
            code: 'invalid_type',
            expected: 'string',
            message: 'Expected string, received number',
          }),
          expect.objectContaining({
            path: ['password'],
            code: 'invalid_type',
            expected: 'string',
            message: 'Expected string, received number',
          }),
        ],
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
        name: 'ZodError',
        message: expect.any(String),
        errors: [
          expect.objectContaining({
            path: ['email'],
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
          }),
          expect.objectContaining({
            path: ['password'],
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
          }),
        ],
      })
    );
  });
});
