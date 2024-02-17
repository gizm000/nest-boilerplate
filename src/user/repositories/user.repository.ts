import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
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
    await this.prisma.user.upsert({
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
}
