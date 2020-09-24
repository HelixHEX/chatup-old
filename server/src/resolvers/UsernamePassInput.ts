import { InputType, Field } from "type-graphql";

@InputType()
export class UsernamePassInput {
  @Field()
  username: string;
  @Field()
  password: string;
}