import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolvers/user.resolver';
import { PrismaService } from 'src/prisma.service';
import { CreateUserCommand } from './commands/create-user.command';

@Module({
  providers: [PrismaService, UserRepository, UserResolver, CreateUserCommand],
  exports: [],
})
export class UserModule {}
