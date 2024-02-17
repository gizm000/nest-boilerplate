import { createUnionType } from '@nestjs/graphql';
import { UserObject } from './user.object';
import { DataNotFound } from 'src/lib/exceptions/data-not-found.exception';
import { ValidationFailed } from 'src/lib/exceptions/validation-failed.exception';

export const ChangeUserEmailResult = createUnionType({
  name: 'ChangeUserEmailResult',
  types: () => [UserObject, DataNotFound, ValidationFailed] as const,
  resolveType(value: UserObject | DataNotFound | ValidationFailed) {
    if ('errorName' in value) {
      switch (value.errorName) {
        case 'DataNotFoundError':
          return DataNotFound;
        case 'ValidationFailedError':
          return ValidationFailed;
      }
    } else {
      return UserObject;
    }
  },
});
