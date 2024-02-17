import { genUUID } from 'src/lib/uuid';
import { z } from 'zod';
import { err, ok } from 'neverthrow';
import { ChangeUserEmailEvent } from '../events/change-user-email.event';

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

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

export class User implements IUser {
  changeUserEmailEvent: ChangeUserEmailEvent[] = [];

  protected constructor(
    public id: string = genUUID(),
    public email: string,
    public name: string | null = null,
    public createdAt: Date | null,
    public updatedAt: Date | null,
  ) {}

  private readonly schema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().optional(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
  });

  static fromObject(userObject: IUser) {
    const user = new User(
      userObject.id,
      userObject.email,
      userObject.name,
      userObject.createdAt,
      userObject.updatedAt,
    );
    return user;
  }

  static create(input: ICreateUserEntity) {
    const user = new User(
      genUUID(),
      input.email,
      input.name ?? null,
      null,
      null,
    );
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
    const deletableUser = new DeletableUser(this, deletableSymbol);
    return ok(deletableUser);
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

export class DeletableUser extends User {
  constructor(
    user: User,
    readonly symbol: typeof deletableSymbol,
  ) {
    super(user.id, user.email, user.name, user.createdAt, user.updatedAt);
  }
}
