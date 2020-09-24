import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany
} from "typeorm";
import { ObjectType, Field } from "type-graphql";

//entities
import { Message } from "./Message";

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
  
  @OneToMany(() => Message, (message: Message) => message.user)
  messages: Message[];
}
