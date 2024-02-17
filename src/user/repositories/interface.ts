import { IUserRepositoryCreateUser } from '../commands/create-user.command';
import { IUserRepositoryDeleteUser } from '../commands/delete-user.command';
import { IUserRepositoryQuery } from '../resolvers/user.resolver';

export interface IUserRepository
  extends IUserRepositoryCreateUser,
    IUserRepositoryDeleteUser,
    IUserRepositoryQuery {}
