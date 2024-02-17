import { createUnionType } from '@nestjs/graphql';
import { UserObject } from './user.object';
import { DataNotFound } from 'src/lib/exceptions/data-not-found.exception';

export const UserResult = createUnionType({
  name: 'UserResult',
  types: () => [UserObject, DataNotFound] as const,
});
