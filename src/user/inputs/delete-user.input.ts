import { Field, ID, InputType } from '@nestjs/graphql';
import { IDeleteUserInput } from '../commands/delete-user.command';

@InputType()
export class DeleteUserInput implements IDeleteUserInput {
  @Field(() => ID, { nullable: false })
  id: string;
}
