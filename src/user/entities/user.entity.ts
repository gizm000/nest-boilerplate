import { genUUID } from 'src/lib/uuid';
import { UserObject } from '../objects/user.object';
import { z } from 'zod';
import { err, ok } from 'neverthrow';
import { ChangeUserEmailEvent } from '../events/change-user-email.event';

export interface ICreateUserEntity {
  email: string;
  name?: string;
}

export interface IUserIdentifier {
  id: string;
}

export interface IChangeEmailEntity {
  email: string;
}

const deletableSymbol = Symbol('deletable');

export class User extends UserObject {
  changeUserEmailEvent: ChangeUserEmailEvent[] = [];

  private readonly schema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().optional(),
  });

  static fromObject(userObject: UserObject) {
    const user = new User();
    user.id = userObject.id;
    user.email = userObject.email;
    user.name = user.name;
    user.createdAt = userObject.createdAt;
    user.updatedAt = userObject.updatedAt;
    return user;
  }

  static create(input: ICreateUserEntity) {
    const user = new User();
    user.id = genUUID();
    user.email = input.email;
    user.name = input.name ?? null;
    return ok(user).andThen(user.validate);
  }

  public changeEmail(input: IChangeEmailEntity) {
    this.email = input.email;
    return ok(this)
      .andThen(this.validate)
      .map((user) => {
        this.changeUserEmailEvent.push(new ChangeUserEmailEvent(input.email));
        return user;
      });
  }

  public delete() {
    return ok(new DeletableUserId(this.id, deletableSymbol));
  }

  private validate(user: User) {
    return ok(user).andThen(() => {
      const result = user.schema.safeParse(user);
      if (result.success) {
        return ok(user);
      } else {
        return err(result.error);
      }
    });
  }
}

export class DeletableUserId {
  constructor(
    readonly value: string,
    readonly symbol: typeof deletableSymbol,
  ) {}
}
