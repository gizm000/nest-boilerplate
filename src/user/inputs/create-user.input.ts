import { Field, InputType } from '@nestjs/graphql';
import { ICreateUserInput } from '../commands/create-user.command';

@InputType()
export class CreateUserInput implements ICreateUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  name?: string;
}
