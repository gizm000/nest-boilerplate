import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserObject } from '../objects/user.object';
import { UserRepository } from '../repositories/user.repository';
import { err, fromSafePromise, ok } from 'neverthrow';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';
import { UserResult } from '../objects/user-result.object';

@Resolver(() => UserObject)
export class UserResolver {
  constructor(private readonly userRepository: UserRepository) {}

  @Query(() => [UserObject])
  async users(): Promise<UserObject[]> {
    return this.userRepository.findMany();
  }

  @Query(() => UserResult)
  async user(@Args('id') id: string): Promise<typeof UserResult> {
    const result = await fromSafePromise(
      this.userRepository.findById(id),
    ).andThen((userOrNull) => {
      if (userOrNull === null) {
        return err(new DataNotFoundError());
      } else {
        return ok(userOrNull);
      }
    });
    if (result.isErr()) {
      return result.error.toGraphql();
    } else {
      return result.value;
    }
  }
}
