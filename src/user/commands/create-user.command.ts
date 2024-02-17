import { fromSafePromise, ok } from 'neverthrow';
import { ICreateUserEntity, IUser, User } from '../entities/user.entity';
import { ValidationFailedError } from 'src/lib/exceptions/validation-failed.exception';
import { Inject, Injectable } from '@nestjs/common';
import { UserRepositoryToken } from '../repositories/di-token';

// UserEntityで定義したUserを作成するインタフェースを継承して、ユースケースの入力インタフェースを定義
// 今回はたまたま同じなので、継承するだけでおしまい
export interface ICreateUserInput extends ICreateUserEntity {}

// 永続化処理のインタフェースを定義する
// あとでUserRepositoryで実装する
export interface IUserRepositoryCreateUser {
  save(user: User): Promise<IUser>;
}

@Injectable()
export class CreateUserCommand {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepositoryCreateUser,
  ) {}

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
