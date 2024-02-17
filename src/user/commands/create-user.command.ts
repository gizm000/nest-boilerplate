import { fromSafePromise, ok } from 'neverthrow';
import { ICreateUserEntity, User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { ValidationFailedError } from 'src/lib/exceptions/validation-failed.exception';
import { Injectable } from '@nestjs/common';

export interface ICreateUserInput extends ICreateUserEntity {}

@Injectable()
export class CreateUserCommand {
  constructor(private readonly userRepository: UserRepository) {}

  execute(input: ICreateUserInput) {
    return ok(input)
      .andThen(this.toEntity.bind(this))
      .asyncAndThen(this.save.bind(this));
  }

  private toEntity(input: ICreateUserInput) {
    return ok(input)
      .andThen(User.create)
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
}
