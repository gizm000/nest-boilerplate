import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Entity } from 'src/lib/grpahql/interfaces/entity';

@ObjectType('UserObject')
export class UserObject
  extends Entity
  implements Omit<User, 'createdAt' | 'updatedAt'>
{
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;
}
