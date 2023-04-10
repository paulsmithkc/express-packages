import type { RequestHandler } from 'express';

/**
 * Wraps an async middleware in a try-catch block.
 * @param middleware the original middleware function
 * @returns the wrapped middleware
 */
function asyncCatch(middleware: RequestHandler): RequestHandler {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

// ESM exports
export default asyncCatch;
export { asyncCatch };

// CommonJS exports
module.exports = asyncCatch;
module.exports.asyncCatch = asyncCatch;
