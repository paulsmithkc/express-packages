import { ObjectId } from 'mongodb';
import _joi from 'joi';
import type { Root, AnySchema, CustomHelpers } from 'joi';

export type ObjectIdSchema = AnySchema;
export type ObjectIdSchemaFunc = () => ObjectIdSchema;
export type JoiMongoDb = Root & { objectId: ObjectIdSchemaFunc };

export const init = (_joi: Root | JoiMongoDb): JoiMongoDb => {
  const objectId = (): ObjectIdSchema => {
    return _joi
      .any()
      .custom((value: any, helpers: CustomHelpers) => {
        try {
          if (!value) {
            throw new Error('ObjectId was falsy');
          } else if (typeof value !== 'string' && typeof value !== 'object') {
            throw new Error('ObjectId was wrong type');
          } else {
            return new ObjectId(value);
          }
        } catch {
          return helpers.error('any.objectId');
        }
      }, 'ObjectId')
      .rule({
        message: {
          'any.objectId': '{#label} was not a valid ObjectId',
        },
      });
  };
  const Joi = _joi as JoiMongoDb;
  Joi.objectId = objectId;
  return Joi;
};

export default init;
export const Joi: JoiMongoDb = init(_joi);

module.exports = init;
module.exports.Joi = Joi;
module.exports.init = init;
