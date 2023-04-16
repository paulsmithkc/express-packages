import { ObjectId } from 'mongodb';
import __zod from 'zod';

type Zod = typeof __zod;

const _objectId = (zod: Zod) => {
  return zod
    .any()
    .superRefine((value, context) => {
      try {
        if (!value) {
          throw new Error('ObjectId was falsy');
        } else if (typeof value === 'string' || value instanceof ObjectId) {
          new ObjectId(value); // attempt to parse ObjectId
          return;
        } else {
          throw new Error('ObjectId was wrong type');
        }
      } catch {
        context.addIssue({
          code: zod.ZodIssueCode.custom,
          message: 'Invalid ObjectId',
        });
        return zod.NEVER;
      }
    })
    .transform((value: any) => {
      /* istanbul ignore next */
      return value ? new ObjectId(value) : value;
    });
};

const zObjectId = _objectId(__zod);
type ZodObjectId = __zod.infer<typeof zObjectId>;

// exports
export { ObjectId, Zod, ZodObjectId, zObjectId };
