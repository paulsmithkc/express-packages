import z from 'zod';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export type ValidateBodyError = z.ZodError & { status?: number };

/**
 * Uses Zod to validate the request body against a schema
 * and updates the body to the sanitized value.
 *
 * Calls the next middleware if body is valid.
 * Sends a 400 response if the body is invalid.
 *
 * @param schema zod schema
 * @returns a middleware
 */
export function validBody(schema: z.AnyZodObject): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // validate request body
      const validateResult = schema.parse(req.body);
      // save sanitized body
      req.body = validateResult;
      return next();
    } catch (err: any) {
      // return 400 response, from standard error handler
      const validateError = err as ValidateBodyError;
      validateError.status = 400;
      return next(validateError);
    }
  };
}

export default validBody;
module.exports = validBody;
