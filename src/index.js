const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
// const index = require("./routes/index");

const app = express();
const cors = require('cors')
const path = require("path");

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

  let interval;

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
      console.log(msg)
      io.emit('chat message', msg);
    });
  });

  server.listen(process.env.PORT, () => console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`));
}

main()