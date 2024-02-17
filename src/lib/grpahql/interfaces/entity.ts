import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType({ isAbstract: true })
export abstract class Entity {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date;
}
