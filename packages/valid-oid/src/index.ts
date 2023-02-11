import { ObjectId } from 'mongodb';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export class ValidateIdError extends Error {
  public status?: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ValidateIdError';
    this.status = status;
  }
}

/**
 * Validates an ObjectId that is part of the request path
 * and adds the validated ObjectId to the request.
 *
 * Calls the next middleware if ObjectId is valid.
 * Sends a 404 response if the ObjectId is invalid.
 *
 * @param paramName the name of the request parameter
 * @returns a middleware
 */
export function validId(paramName: string): RequestHandler {
  return (req: Request & Record<string, any>, _res: Response, next: NextFunction) => {
    const paramValue = req.params[paramName];
    try {
      if (!paramValue) {
        throw new Error('parameter not provided');
      } else {
        // save sanitized oid
        req[paramName] = new ObjectId(paramValue);
        return next();
      }
    } catch (err) {
      // return 404 response, from standard error handler
      return next(new ValidateIdError(404, `${paramName} "${paramValue}" is not a valid ObjectId.`));
    }
  };
}

export default validId;
module.exports = validId;
