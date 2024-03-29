import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserObject } from '../objects/user.object';
import { err, fromSafePromise, ok } from 'neverthrow';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';
import { UserResult } from '../objects/user-result.object';
import { CreateUserInput } from '../inputs/create-user.input';
import { CreateUserCommand } from '../commands/create-user.command';
import { CreateUserResult } from '../objects/create-user-result.objec';
import { ChangeUserEmailCommand } from '../commands/change-user-email.command';
import { ChangeUserEmailResult } from '../objects/change-user-email-result.objec';
import { ChangeUserEmailInput } from '../inputs/change-user-email.input';
import { DeleteUserCommand } from '../commands/delete-user.command';
import { DeleteUserInput } from '../inputs/delete-user.input';
import { DeleteUserResult } from '../objects/delete-user-result.object';
import { ValidationFailed } from 'src/lib/exceptions/validation-failed.exception';
import { Inject } from '@nestjs/common';
import { UserRepositoryToken } from '../repositories/di-token';

export type CreateUserResult = UserObject | ValidationFailed;

export interface IUserRepositoryQuery {
  findById(id: string): Promise<UserObject | null>;
  findMany(): Promise<UserObject[]>;
  findOrThrowById(id: string): Promise<UserObject>;
}

@Resolver(() => UserObject)
export class UserResolver {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepositoryQuery,
    private readonly createUserCommand: CreateUserCommand,
    private readonly changeUserEmailCommand: ChangeUserEmailCommand,
    private readonly deleteUserCommand: DeleteUserCommand,
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
  ): Promise<CreateUserResult> {
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

  @Mutation(() => DeleteUserResult)
  async deleteUser(
    @Args('input', { type: () => DeleteUserInput }) input: DeleteUserInput,
  ): Promise<typeof DeleteUserResult> {
    const result = await this.deleteUserCommand.execute(input);
    if (result.isErr()) {
      return result.error.toGraphql();
    } else {
      return result.value;
    }
  }
}
