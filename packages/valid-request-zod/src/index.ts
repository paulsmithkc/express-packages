import z from 'zod';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export class ValidateRequestError extends Error {
  public status?: number;
  public details?: ZodErrorMap;
  constructor(status: number, message: string, details: ZodErrorMap) {
    super(message);
    this.name = 'ValidateRequestError';
    this.status = status;
    this.details = details;
  }
}

export interface ZodSchemaMap {
  [key: string]: z.AnyZodObject | null | undefined;
}

export interface ZodErrorMap {
  [key: string]: z.ZodError | null | undefined;
}

/**
 * Uses Zod to validate the request against a set of schemas
 * and updates the request to the sanitized values.
 *
 * Calls the next middleware if request is valid.
 * Sends a 400 response if the request is invalid.
 *
 * @param schemaMap zod schema map
 * @returns a middleware
 */
function validRequest(schemaMap: ZodSchemaMap): RequestHandler {
  return (req: Request & Record<string, any>, _res: Response, next: NextFunction) => {
    const errors = {} as ZodErrorMap;
    let anyErrors = false;

    for (const key in schemaMap) {
      const schema = schemaMap[key];
      if (!schema) {
        continue;
      }

      try {
        req[key] = schema.parse(req[key]); // validate & save sanitized data
      } catch (err: any) {
        errors[key] = err as z.ZodError; // save validation error
        anyErrors = true;
      }
    }

    if (anyErrors) {
      // return 400 response, from standard error handler
      return next(new ValidateRequestError(400, 'Request data is invalid. See details.', errors));
    } else {
      // call next middleware / request handler
      return next();
    }
  };
}

export default validRequest;
module.exports = validRequest;
