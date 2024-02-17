import { genUUID } from 'src/lib/uuid';
import { UserObject } from '../objects/user.object';
import { z } from 'zod';
import { err, ok } from 'neverthrow';

export interface ICreateUserEntity {
  email: string;
  name?: string;
}

export class User extends UserObject {
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
  }

  static create(input: ICreateUserEntity) {
    const user = new User();
    user.id = genUUID();
    user.email = input.email;
    user.name = input.name ?? null;
    return ok(user).andThen(user.validate);
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
