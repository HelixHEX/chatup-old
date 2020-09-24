import { InputType, Field } from "type-graphql";

@InputType()
export class ChatroomRequest {
  @Field()
  chatroomUUID!: string;
}

@InputType()
export class CreateChatroom {
  @Field()
  title!: string;
}

@InputType()
export class MessageInput {
  @Field()
  chatroomUUID: string;
  @Field()
  text!: string;
  @Field()
  username!: string;
}