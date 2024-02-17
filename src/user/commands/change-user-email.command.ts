import { err, fromSafePromise, ok } from 'neverthrow';
import {
  IChangeEmailEntity,
  IUserIdentifier,
  User,
} from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { DataNotFoundError } from 'src/lib/exceptions/data-not-found.exception';
import { ValidationFailedError } from 'src/lib/exceptions/validation-failed.exception';
import { Injectable } from '@nestjs/common';

export interface IChangeEmailInput
  extends IChangeEmailEntity,
    IUserIdentifier {}

type Command = {
  input: IChangeEmailInput;
  user: User;
};

@Injectable()
export class ChangeUserEmailCommand {
  constructor(private readonly userRepository: UserRepository) {}

  execute(input: IChangeEmailInput) {
    return ok(input)
      .asyncAndThen(this.toCommand.bind(this))
      .andThen(this.changeEmail.bind(this))
      .andThen(this.save.bind(this));
  }

  private toCommand(input: IChangeEmailInput) {
    return fromSafePromise(this.userRepository.findById(input.id))
      .andThen((userOrNull) => {
        if (!userOrNull) {
          return err(new DataNotFoundError());
        } else {
          return ok(userOrNull);
        }
      })
      .map(User.fromObject)
      .map((user) => ({
        input,
        user,
      }));
  }

  private changeEmail({ input, user }: Command) {
    return ok(input)
      .andThen(user.changeEmail.bind(user))
      .mapErr((zodError) => {
        return new ValidationFailedError({
          responseMessage: zodError.errors.map((e) => e.message).join('\n'),
          options: {
            cause: zodError.cause,
          },
        });
      });
  }

  private save(user: User) {
    return fromSafePromise(this.userRepository.save(user)).map(() => user);
  }

  private publishEvents(user: User) {
    // TODO: Publish domain event.
  }
}
