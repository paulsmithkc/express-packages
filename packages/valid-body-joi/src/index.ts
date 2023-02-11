import Joi from 'joi';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export type ValidateBodyError = Joi.ValidationError & { status?: number };

/**
 * Uses Joi to validate the request body against a schema
 * and updates the body to the sanitized value.
 *
 * Calls the next middleware if body is valid.
 * Sends a 400 response if the body is invalid.
 *
 * @param schema joi schema
 * @returns a middleware
 */
export function validBody(schema: Joi.ObjectSchema): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const validateResult = schema.required().label('req.body').validate(req.body, { abortEarly: false });
    const validateError = validateResult.error as ValidateBodyError;
    if (validateError) {
      // return 400 response, from standard error handler
      validateError.status = 400;
      return next(validateError);
    } else {
      // save sanitized body
      req.body = validateResult.value;
      return next();
    }
  };
}

export default validBody;
module.exports = validBody;
