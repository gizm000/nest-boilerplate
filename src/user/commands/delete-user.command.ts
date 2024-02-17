import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
  DeletableUserId,
  IUserIdentifier,
  User,
} from '../entities/user.entity';
import { err, fromSafePromise, ok } from 'neverthrow';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';

export interface IDeleteUserInput extends IUserIdentifier {}

type Command = {
  input: IDeleteUserInput;
  user: User;
};

@Injectable()
export class DeleteUserCommand {
  constructor(private readonly userRepository: UserRepository) {}

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

  private save(deletableUserId: DeletableUserId) {
    return fromSafePromise(this.userRepository.delete(deletableUserId)).map(
      () => deletableUserId.value,
    );
  }
}
