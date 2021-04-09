"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv-safe/config');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const cors = require('cors');
const path = require("path");
const cron = require('cron');
const fetch = require('node-fetch');
const users_1 = require("./utils/users");
const main = () => {
    const server = http.createServer(app);
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    app.use(cors());
    app.use(express.static(path.join(__dirname, "../build")));
    app.get("/*", function (_, res) {
        res.sendFile(path.join(__dirname, "../build", "index.html"));
    });
    app.get("/", (_, res) => {
        res.send("Hello world");
    });
    app.use((_, res) => {
        res.status(404).json({ status: "404" });
    });
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            users_1.removeUser(socket.id, socket.room);
            let onlineusers = users_1.users(socket.room);
            io.to(socket.room).emit('onlineusers', onlineusers);
            console.log(`Disconnected: ${socket.id}`);
        });
        socket.on('chat message', (msg) => {
            console.log(msg);
            io.to(msg.room).emit('chat message', msg);
        });
        socket.on('join', (user) => {
            console.log(`${user.username} has joined ${user.room}`);
            socket.username = user.username;
            socket.room = user.room;
            users_1.addUser(socket.id, socket.room);
            socket.join(user.room);
            let onlineusers = users_1.users(socket.room);
            io.to(user.room).emit('onlineusers', onlineusers);
        });
    });
    const cronJob = new cron.CronJob("0 */25 * * * *", () => {
        fetch("https://devpeak.herokuapp.com/")
            .then((res) => console.log(`response-ok: ${res.ok}, status: ${res.status}`))
            .catch((error) => console.log(error));
    });
    cronJob.start();
    server.listen(process.env.PORT, () => console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`));
};
main();
//# sourceMappingURL=index.js.map