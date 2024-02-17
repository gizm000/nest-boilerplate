import { Inject, Injectable } from '@nestjs/common';
import { DeletableUser, IUserIdentifier, User } from '../entities/user.entity';
import { err, fromSafePromise, ok } from 'neverthrow';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';
import { UserObject } from '../objects/user.object';
import { UserRepositoryToken } from '../repositories/di-token';
import { IUserRepository } from '../repositories/interface';

export interface IDeleteUserInput extends IUserIdentifier {}

export interface IUserRepositoryDeleteUser {
  delete(deletableUser: DeletableUser): Promise<UserObject>;
}

type Command = {
  input: IDeleteUserInput;
  user: User;
};

@Injectable()
export class DeleteUserCommand {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
  ) {}

  execute(input: IDeleteUserInput) {
    return ok(input)
      .asyncAndThen(this.toCommand.bind(this))
      .andThen(this.delete.bind(this))
      .andThen(this.save.bind(this));
  }

  private toCommand(input: IDeleteUserInput) {
    return fromSafePromise(this.userRepository.findById(input.id))
      .andThen((userOrNull) => {
        if (!userOrNull) {
          return err(new DataNotFoundError());
        } else {
          return ok(userOrNull);
        }
      })
      .map((userObject) => User.fromObject(userObject))
      .map((user) => ({
        input,
        user,
      }));
  }

  private delete({ user }: Command) {
    return user.delete();
  }

  private save(deletableUser: DeletableUser) {
    return fromSafePromise(this.userRepository.delete(deletableUser));
  }
}
