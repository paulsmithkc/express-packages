import { asyncCatch } from './asyncCatch';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

class ErrorWithStatus extends Error {
  public status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ErrorWithStatus';
    this.status = status;
  }
}

describe('express-async-catch', () => {
  let handler: RequestHandler;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    handler = jest.fn();
    req = {} as any;
    res = {
      status: jest.fn().mockImplementation(() => res),
      json: jest.fn().mockImplementation(() => res),
    } as any;
    next = jest.fn();
  });

  it('sync: send success response', async () => {
    // setup
    handler = (req, res) => res.status(200).json({ success: true, message: 'OK' });

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, message: 'OK' });
  });

  it('sync: send error response', async () => {
    // setup
    handler = (req, res) => res.status(400).json({ success: false, message: 'Bad Request' });

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ success: false, message: 'Bad Request' });
  });

  it('sync: unhandled promise rejection', async () => {
    // setup
    handler = (req, res) => Promise.reject(new ErrorWithStatus('Unhandled Error', 400));

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ErrorWithStatus',
        message: 'Unhandled Error',
      })
    );
  });

  it('sync: unhandled thrown error', async () => {
    // setup
    handler = (req, res) => {
      throw new ErrorWithStatus('Unhandled Error', 400);
    };

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ErrorWithStatus',
        message: 'Unhandled Error',
      })
    );
  });

  it('async: send success response', async () => {
    // setup
    handler = async (req, res) => res.status(200).json({ success: true, message: 'OK' });

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ success: true, message: 'OK' });
  });

  it('async: send error response', async () => {
    // setup
    handler = async (req, res) => res.status(400).json({ success: false, message: 'Bad Request' });

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(0);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ success: false, message: 'Bad Request' });
  });

  it('async: unhandled promise rejection', async () => {
    // setup
    handler = async (req, res) => Promise.reject(new ErrorWithStatus('Unhandled Error', 400));

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ErrorWithStatus',
        message: 'Unhandled Error',
      })
    );
  });

  it('async: unhandled thrown error', async () => {
    // setup
    handler = async (req, res) => {
      throw new ErrorWithStatus('Unhandled Error', 400);
    };

    // run
    await asyncCatch(handler)(req, res, next);

    // assert
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 400,
        name: 'ErrorWithStatus',
        message: 'Unhandled Error',
      })
    );
  });
});
