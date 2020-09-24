import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany, ManyToOne, JoinColumn
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

//entities
import { Message } from "./Message";
import { User } from "./User";

@ObjectType()
@Entity()
export class Chatroom extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column()
  title!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.chatroomscreated, { primary: true})
  @JoinColumn({name: 'creatorUUID'})
  creator: User

  @Column()
  creatorUUID: string
  
  @OneToMany(() => Message, (message: Message) => message.chatroom)
  messages: Message[];
}
