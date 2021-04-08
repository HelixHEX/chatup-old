require('dotenv-safe/config')
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const cors = require('cors')
const path = require("path");

import { onlineusers, addUser, removeUser } from './utils/users'

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
    console.log('user connected')
    socket.on('disconnect', () => {
      removeUser(socket.id)
      io.emit('onlineusers', onlineusers);
      console.log(`user disconnected`);
    });
    socket.on('chat message', (msg) => {
      console.log(msg)
      io.emit('chat message', msg);
    });

    socket.on('join', (user) => {
      console.log(`${user} has joined`)
      addUser(socket.id)
      io.emit('onlineusers', onlineusers);
    });
  });

  server.listen(process.env.PORT, () => console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`));
}

main()