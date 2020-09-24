import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany, JoinTable, ManyToMany
} from 'typeorm';
import { ObjectType, Field } from "type-graphql";

//entities
import { Message } from './Message'
import { Chatroom } from './Chatroom'

@ObjectType()
@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Message, (message: Message) => message.user)
  messages: Message[];

  @ManyToMany(() => Chatroom)
  @JoinTable()
  chatrooms: Chatroom[];

  @OneToMany(() => Chatroom, (chatroom: Chatroom) => chatroom.creator)
  chatroomscreated: Chatroom[]
}