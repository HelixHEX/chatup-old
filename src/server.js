require('dotenv-safe/config')
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const cors = require('cors')
const path = require("path");

import { users, addUser, removeUser } from './utils/users'

const main = () => {
  app.use(cors());

  app.use(express.static(path.join(__dirname, "../build")))
  app.get("/*", function (_, res) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  })
  const server = http.createServer(app);

  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });


  io.on('connection', (socket) => {
    socket.on('disconnect', () => {
      removeUser(socket.id, socket.room)

      let onlineusers = users(socket.room)
      io.to(socket.room).emit('onlineusers', onlineusers);
      console.log(`Disconnected: ${socket.id}`);
    });
    socket.on('chat message', (msg) => {
      console.log(msg)
      io.to(msg.room).emit('chat message', msg);
    });

    socket.on('join', (user) => {
      console.log(`${user.username} has joined ${user.room}`)
      socket.username = user.username
      socket.room = user.room
      addUser(socket.id, socket.room)
      socket.join(user.room)

      let onlineusers = users(socket.room)
      io.to(user.room).emit('onlineusers', onlineusers);
    });
  });

  server.listen(process.env.PORT, () => console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`));
}

main()