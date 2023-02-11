import Joi from 'joi';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

export class ValidateRequestError extends Error {
  public status?: number;
  public details?: JoiErrorMap;
  constructor(status: number, message: string, details: JoiErrorMap) {
    super(message);
    this.name = 'ValidateRequestError';
    this.status = status;
    this.details = details;
  }
}

export interface JoiSchemaMap {
  [key: string]: Joi.ObjectSchema | null | undefined;
}

export interface JoiErrorMap {
  [key: string]: Joi.ValidationError | null | undefined;
}

/**
 * Uses Joi to validate the request against a set of schemas
 * and updates the request to the sanitized values.
 *
 * Calls the next middleware if request is valid.
 * Sends a 400 response if the request is invalid.
 *
 * @param schemaMap joi schema map
 * @returns a middleware
 */
function validRequest(schemaMap: JoiSchemaMap): RequestHandler {
  return (req: Request & Record<string, any>, _res: Response, next: NextFunction) => {
    const errors = {} as JoiErrorMap;
    let anyErrors = false;

    for (const key in schemaMap) {
      const schema = schemaMap[key];
      if (!schema) {
        continue;
      }

      const validateResult = schema
        .required()
        .label('req.' + key)
        .validate(req[key], { abortEarly: false });

      if (validateResult.error) {
        errors[key] = validateResult.error; // save validation error
        anyErrors = true;
      } else {
        req[key] = validateResult.value; // save sanitized body
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
