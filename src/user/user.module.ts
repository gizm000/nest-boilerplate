import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolvers/user.resolver';
import { PrismaService } from 'src/prisma.service';
import { CreateUserCommand } from './commands/create-user.command';
import { ChangeUserEmailCommand } from './commands/change-user-email.command';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    UserResolver,
    CreateUserCommand,
    ChangeUserEmailCommand,
  ],
  exports: [],
})
export class UserModule {}
