import { UserObject } from '../objects/user.object';

export class User extends UserObject {
  static fromObject(userObject: UserObject) {
    const user = new User();
    user.id = userObject.id;
    user.email = userObject.email;
    user.name = user.name;
    user.createdAt = userObject.createdAt;
    user.updatedAt = userObject.updatedAt;
  }
}
