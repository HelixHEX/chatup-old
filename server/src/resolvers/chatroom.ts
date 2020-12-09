import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Publisher,
  PubSub,
  Query,
  Resolver,
} from "type-graphql";


//entities
import { Message } from "../entities/Message"
import { Chatroom } from '../entities/Chatroom'
import { MyContext } from "src/types";
import { MessageInput } from "./ChatroomTypes";

//types
import { ChatroomRequest, CreateChatroom } from './ChatroomTypes'

//utilities
import {validateChatroom} from '../utilities/validateChatroom'
import { NotificationPayload } from "src/utilities/notification.type";

//Class for errors
@ObjectType()
class ChatroomErrors {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ChatroomResponse {  
  @Field(() => [ChatroomErrors], { nullable: true })
  errors?: ChatroomErrors[];

  @Field(() => Message, { nullable: true })
  message?: Message

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => [Message], { nullable: true })
  messages2?: Message[];

  @Field(() => Chatroom, { nullable: true})
  chatroom?: Chatroom

  @Field(() => [Chatroom], { nullable: true})
  chatrooms?: Chatroom[]
}

@Resolver(Chatroom)
export class ChatroomResolver {
  @Mutation(() => ChatroomResponse, {nullable: true})
  async send(
    @PubSub("NOTIFICATIONS") publish: Publisher<NotificationPayload>,
    @Arg('input') input: MessageInput,
    @Ctx() {req}: MyContext
  ): Promise<ChatroomResponse> {
    //check if the user is logged in
    if(!req.session.userUUID) {
      return {
        errors: [
          {
            field: 'login',
            message: 'user not logged in'
          }
        ]
      }      
    }
    const message = await Message.create({
        text: input.text,
        userUUID: req.session.userUUID,
        chatroomUUID: input.chatroomUUID,
        username: input.username
    }).save()
    await publish({ field: "New Message", message: input.text})
    return {message}
  }

  @Query(() => ChatroomResponse, {nullable: true})
  async chatroom(
    @Arg('input') input: ChatroomRequest,
    @Ctx() {req}: MyContext
  ): Promise<ChatroomResponse> {
    //check for errors
    const errors = validateChatroom(input)
    if (errors) {
      return { errors }
    }

    //check if user is logged in 
    if (!req.session.userUUID) {
      return {
        errors: [
          {
            field: "login",
            message: "user not logged in"
          }
        ]
      }
    }

    //load messages
    let messages;
    if (!input.chatroomUUID) {
      messages = await Message.find({ where: { chatroomUUID: input.chatroomUUID}, relations: ['Chatroom']})
    } else {

    }
    return {messages}
  }

  @Mutation(() => ChatroomResponse, {nullable: true})
  async createChatroom(
    @Arg('input') input: CreateChatroom,
    @Ctx() {req}: MyContext
  ): Promise<ChatroomResponse> {
    //check if user is logged in
    if (!req.session.userUUID) {
      return {
        errors: [
          {
            field: 'login',
            message: 'user not logged in'
          }
        ]
      }
    }

    const chatroom = await Chatroom.create({
      title: input.title,
      creatorUUID: req.session.userUUID
    }).save()
    return {chatroom}
  }

  @Query(() => ChatroomResponse, {nullable: true})
  async allchatrooms(
    @Ctx() {req}: MyContext
  ): Promise<ChatroomResponse> {
    // if(!req.session.userUUID) {
    //   return {
    //     errors: [
    //       {
    //         field: 'login',
    //         message: 'user not logged in'
    //       }
    //     ]
    //   }      
    // }
    console.log(req.session.userUUID)
    const chatrooms = await Chatroom.find({ relations: ['messages']})
    chatrooms.forEach(user => {
      user.messages.forEach(message => console.log(message.text))
    })
    return {chatrooms}
  }
  @Query(() => ChatroomResponse, {nullable: true})
  async allmessages(
    @Ctx() {req}: MyContext
  ): Promise<ChatroomResponse> {
    if(!req.session.userUUID) {
      return {
        errors: [
          {
            field: 'login',
            message: 'user not logged in'
          }
        ]
      }      
    }
    const messages2 = await Message.find({relations: ['chatroom']})
    console.log(messages2)
    return {messages2}
  }
}