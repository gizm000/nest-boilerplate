import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolvers/user.resolver';
import { PrismaService } from 'src/prisma.service';
import { CreateUserCommand } from './commands/create-user.command';
import { ChangeUserEmailCommand } from './commands/change-user-email.command';
import { DeleteUserCommand } from './commands/delete-user.command';
import { UserRepositoryToken } from './repositories/di-token';

@Module({
  providers: [
    PrismaService,
    {
      provide: UserRepositoryToken,
      useClass: UserRepository,
    },
    UserResolver,
    CreateUserCommand,
    ChangeUserEmailCommand,
    DeleteUserCommand,
  ],
  exports: [],
})
export class UserModule {}
