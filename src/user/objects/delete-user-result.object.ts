import { createUnionType } from '@nestjs/graphql';
import { DataNotFound } from 'src/lib/exceptions/data-not-found.exception';

export const DeleteUserResult = createUnionType({
  name: 'DeleteUserResult',
  types: () => [String, DataNotFound] as const,
  resolveType: (value: String | DataNotFound) => {
    if ('errorName' in value) {
      return DataNotFound;
    } else {
      return String;
    }
  },
});
