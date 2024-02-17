import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ErrorResult {
  @Field(() => Boolean)
  success: false = false;

  @Field(() => String)
  message: string;
}
