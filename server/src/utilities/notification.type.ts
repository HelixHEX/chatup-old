import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Notification {
  @Field()
  field!: string;

  @Field()
  message: string;

  @Field(() => Date)
  createdAt: Date
}

export interface NotificationPayload {
  field: string;
  message: string;
}