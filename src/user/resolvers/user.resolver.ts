import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserObject } from '../objects/user.object';
import { UserRepository } from '../repositories/user.repository';
import { err, fromSafePromise, ok } from 'neverthrow';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';
import { UserResult } from '../objects/user-result.object';
import { CreateUserInput } from '../inputs/create-user.input';
import { CreateUserCommand } from '../commands/create-user.command';
import { CreateUserResult } from '../objects/create-user-result.objec';
import { ChangeUserEmailCommand } from '../commands/change-user-email.command';
import { ChangeUserEmailResult } from '../objects/change-user-email-result.objec';
import { ChangeUserEmailInput } from '../inputs/change-user-email.input';

@Resolver(() => UserObject)
export class UserResolver {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserCommand: CreateUserCommand,
    private readonly changeUserEmailCommand: ChangeUserEmailCommand,
  ) {}

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

  @Mutation(() => CreateUserResult)
  async createUser(
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
  ): Promise<typeof CreateUserResult> {
    const result = await this.createUserCommand.execute(input);
    if (result.isErr()) {
      return result.error.toGraphql();
    } else {
      return this.userRepository.findOrThrowById(result.value.id);
    }
  }

  @Mutation(() => ChangeUserEmailResult)
  async changeUserEmail(
    @Args('input') input: ChangeUserEmailInput,
  ): Promise<typeof ChangeUserEmailResult> {
    const result = await this.changeUserEmailCommand.execute(input);
    if (result.isErr()) {
      return result.error.toGraphql();
    } else {
      return this.userRepository.findOrThrowById(result.value.id);
    }
  }
}
