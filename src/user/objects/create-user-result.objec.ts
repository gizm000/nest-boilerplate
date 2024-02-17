import { createUnionType } from '@nestjs/graphql';
import { UserObject } from './user.object';
import { ValidationFailed } from 'src/lib/exceptions/validation-failed.exception';

export const CreateUserResult = createUnionType({
  name: 'CreateUserResult',
  types: () => [UserObject, ValidationFailed] as const,
  resolveType(value: UserObject | ValidationFailed) {
    if ('errorName' in value) {
      return ValidationFailed;
    } else {
      return UserObject;
    }
  },
});
