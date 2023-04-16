import { ObjectId } from 'mongodb';
import type { Root, CustomHelpers } from 'joi';

type Joi = Root;

const _objectId = (joi: Joi) => {
  return joi
    .any()
    .custom((value: any, helpers: CustomHelpers) => {
      try {
        if (!value) {
          throw new Error('ObjectId was falsy');
        } else if (typeof value === 'string' || value instanceof ObjectId) {
          return new ObjectId(value);
        } else {
          throw new Error('ObjectId was wrong type');
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

type JoiObjectId = ReturnType<typeof _objectId>;
type JoiExtended = Joi & { objectId: () => JoiObjectId };

/* istanbul ignore next */
const objectId = (joi: Joi | JoiExtended): JoiObjectId => {
  return _objectId(joi);
};

const extend = (joi?: Joi | JoiExtended): JoiExtended => {
  let Joi = joi as JoiExtended;
  if (!Joi) {
    Joi = require('joi') as JoiExtended;
  }
  if (!Joi.objectId) {
    Joi.objectId = () => _objectId(Joi);
  }
  return Joi;
};

export { ObjectId, Joi, JoiExtended, JoiObjectId, objectId, extend };
