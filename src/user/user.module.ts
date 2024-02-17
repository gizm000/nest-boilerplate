import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserResolver } from './resolvers/user.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PrismaService, UserRepository, UserResolver],
  exports: [],
})
export class UserModule {}
