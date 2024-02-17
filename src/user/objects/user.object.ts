import { Field, ObjectType } from '@nestjs/graphql';
import { Entity } from 'src/lib/grpahql/interfaces/entity';
import { IUser } from '../entities/user.entity';
import { User } from '@prisma/client';

@ObjectType('User')
export class UserObject extends Entity implements IUser, User {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;
}
