import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
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

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => Chatroom, { nullable: true})
  chatroom?: Chatroom

  @Field(() => [Chatroom], { nullable: true})
  chatrooms?: Chatroom[]
}

@Resolver(Chatroom)
export class ChatroomResolver {
  @Mutation(() => Message, {nullable: true})
  async send(
    @Arg('input') input: MessageInput,
    @Ctx() {req}: MyContext
  ) {
    //check if the user is logged in
    if (!req.session.userUUID) {
      return null
    }
    let message;
    if (!input.text) {
      //store message in database
      message = await Message.create({
        text: input.text,
        userUUID: req.session.userUUID,
        chatroomUUID: input.chatroomUUID,
        username: input.username
      }).save()
    }

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
    const chatrooms = await Chatroom.find({ where: {creatorUUID: req.session.userUUID}, relations: ['creator']})
    return {chatrooms}
  }
}