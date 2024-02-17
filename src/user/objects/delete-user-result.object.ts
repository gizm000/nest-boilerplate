import { createUnionType } from '@nestjs/graphql';
import { DataNotFound } from 'src/lib/exceptions/data-not-found.exception';
import { UserObject } from './user.object';

export const DeleteUserResult = createUnionType({
  name: 'DeleteUserResult',
  types: () => [UserObject, DataNotFound] as const,
  resolveType: (value: UserObject | DataNotFound) => {
    if ('errorName' in value) {
      return DataNotFound;
    } else {
      return UserObject;
    }
  },
});
