import type { RequestHandler } from 'express';

/**
 * Wraps an async middleware in a try-catch block.
 * @param middleware the original middleware function
 * @returns the wrapped middleware
 */
export function asyncCatch(middleware: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
