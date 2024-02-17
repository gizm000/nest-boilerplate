import { Field, ID, InputType } from '@nestjs/graphql';
import { IChangeEmailInput } from '../commands/change-user-email.command';

@InputType()
export class ChangeUserEmailInput implements IChangeEmailInput {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  email: string;
}
