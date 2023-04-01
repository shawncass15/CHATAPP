const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("static/chat-adv-client.html");
});

let users = [];

io.on("connection", (socket) => {
  socket.on("join", (msg) => {
    users.push({
      id: Math.floor(Math.random() * (70 - 1) + 1),
      username: msg,
    });
    io.emit("users", users);
    io.emit("event", `${msg} has joined!`);
  });

  socket.on("part", (msg) => {
    users.forEach((value, key) => {
      if (value.username == msg) {
        users.splice(key, 1);
      }
    });
    io.emit("users", users);
    io.emit("event", `${msg} has left!`);
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});

httpServer.listen(3000);
