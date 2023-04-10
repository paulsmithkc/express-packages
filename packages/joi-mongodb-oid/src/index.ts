import { ObjectId } from 'mongodb';
import type { Root, AnySchema, CustomHelpers } from 'joi';

type ObjectIdSchema = AnySchema;
type ObjectIdSchemaFunc = () => ObjectIdSchema;
type JoiMongoDb = Root & { objectId: ObjectIdSchemaFunc };

const _objectId = (joi: Root): ObjectIdSchema => {
  return joi
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

const objectId = (joi: Root | JoiMongoDb): ObjectIdSchema => {
  return _objectId(joi);
};

const init = (joi?: Root | JoiMongoDb): JoiMongoDb => {
  let Joi = joi as JoiMongoDb;
  if (!Joi) {
    Joi = require('joi') as JoiMongoDb;
  }
  if (!Joi.objectId) {
    Joi.objectId = () => _objectId(Joi);
  }
  return Joi;
};

// ESM exports
export default init;
export { ObjectId, ObjectIdSchema, ObjectIdSchemaFunc, objectId, init };

// CommonJS exports
module.exports = init;
module.exports.init = init;
module.exports.objectId = objectId;
module.exports.ObjectId = ObjectId;
