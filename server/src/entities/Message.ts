import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

//entities
import { User } from "./User";
import { Chatroom } from "./Chatroom";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column()
  text!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.messages, { primary: true })
  @JoinColumn({ name: 'userUUID' })
  user: User;

  @Column()
  userUUID: string;
  
  @ManyToOne(() => Chatroom, (chatroom: Chatroom) => chatroom.messages, { primary: true })
  @JoinColumn({ name: 'chatroomUUID'})
  chatroom: Chatroom

  @Column()
  chatroomUUID: string;
}
