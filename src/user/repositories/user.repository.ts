import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DeletableUser, User } from '../entities/user.entity';
import { IUserRepositoryCreateUser } from '../commands/create-user.command';
import { IUserRepositoryDeleteUser } from '../commands/delete-user.command';
import { IUserRepositoryQuery } from '../resolvers/user.resolver';

@Injectable()
export class UserRepository
  implements
    IUserRepositoryCreateUser,
    IUserRepositoryDeleteUser,
    IUserRepositoryQuery
{
  constructor(private readonly prisma: PrismaService) {}

  async findMany() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOrThrowById(id: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async save(user: User) {
    return await this.prisma.user.upsert({
      where: {
        id: user.id,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      update: {
        email: user.email,
        name: user.name,
      },
    });
  }

  async delete(deletableUser: DeletableUser) {
    return await this.prisma.user.delete({
      where: {
        id: deletableUser.id,
      },
    });
  }
}
