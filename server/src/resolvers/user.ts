import { validateLogin, validateRegister } from "../utilities/validateUser";
//typescript graphql
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
import { User } from "../entities/User";

//username/password field types
import { UsernamePassInput } from "./UsernamePassInput";

//argon2 
import argon2 from "argon2"

//cusotm types 
import { MyContext } from "src/types";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [User], { nullable: true})
  users?: User[]
}

@Resolver(User)
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(
    @Ctx() {req}: MyContext
  ) {
    if (!req.session.userUUID) {
      return null
    }
    const user = await User.findOne(req.session.userUUID)
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input") input: UsernamePassInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
       //check for errors
    const errors = validateRegister(input);
    if (errors) {
      return { errors}
    }

    //hash the passowrd
    const hashedPass = await argon2.hash(input.password)

    let user;
    try {
      //create the user
      user = await User.create({
        username: input.username,
        password: hashedPass
      }).save()
    } catch (err) {
      //check if the username is taken
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    //create user session 
    req.session.userUUID = user?.uuid;

    //return user
    return {user}
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input") input: UsernamePassInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    //check for errors
    const errors = validateLogin(input);
    if (errors) {
      return { errors}
    }

    //check if user exists 
    const user = await User.findOne({username: input.username})
    if (!user) {
      return {
        errors: [
          {
            field: "password",
            message: 'inccorect username/password'
          }
        ]
      }
    }

    const verifyPass = await argon2.verify(user.password, input.password)
    if (!verifyPass) {
      return {
        errors: [
          {
            field: 'password',
            message: 'inccorect username/password'
          }
        ]
      }
    }

    //create user session 
    req.session.userUUID = user.uuid;
    //return user
    return {user}
  }

  @Query(() => UserResponse, {nullable: true})
  async allusers(
    @Ctx() {req}: MyContext
  ): Promise<UserResponse> {
    if (!req.session.userUUID) {
      return {
        errors: [
          {
            field: "login",
            message: 'user not logged in'
          }
        ]
      }
    }

    const users = await User.find({ relations: ['messages']})
    users.forEach(user => {
      user.messages.forEach(message => console.log(message.text))
    })
    return {users}
  }
}
