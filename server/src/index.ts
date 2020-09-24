//config stuff
import { __prod__, COOKIE_NAME } from "./constants";
import path from 'path';
import 'dotenv-safe/config';
import 'reflect-metadata';

//express
import express from "express";

//cors
import cors from 'cors'

//graphql
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

//typeorm
import { createConnection } from 'typeorm';

//entities
import { User } from './entities/User'
import { Message } from './entities/Message'
import { Chatroom } from './entities/Chatroom'

//resolvers
import { UserResolver } from './resolvers/user'
import { ChatroomResolver } from './resolvers/chatroom'


//redis/sessions
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

const main = async () => {
  //typeorm setup
  await createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, './migrations/*')],
    entities: [User, Message, Chatroom]
  });

  //express setup
  const app = express()

  //setup cors
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
    })
  )

  //setup redis/sessions
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ 
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false
    })
  )

  //setup apollo server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ChatroomResolver],
      validate: false,
    }),
    context: ({req, res}) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(process.env.PORT, () => {
    console.log("server started on localhost:5000");
  });
}

main()