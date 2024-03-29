const express = require("express");

const app = require("express");
const INDEX = "/index.html";
const PORT = process.env.PORT || 4000;

const model = require("./models/auth.model");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "https://tgt-chat-app-front.herokuapp.com",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const date = Date().substring(4, 24);
  socket.on("createAccount", (data) => {
    async function createAccount(data) {
      const { username, email, password } = data;
      if (!username || !email || !password) {
        return socket.emit("createAccountResponse", {
          info: "One or more of the following is missing. Username, email or password",
          result: data,
        });
      }
      const existingUser = await model.authLogin(username);
      if (existingUser) {
        return socket.emit("createAccountResponse", {
          info: "Username is alredy in use",
        });
      }
      const user = { username, email, password: md5(password) };
      await model.authRegister(user);
      io.emit("updateUsers");
      return socket.emit("createAccountResponse", {
        success:
          "Log in with your new account at http://localhost:4000/auth/login",
      });
    }
    createAccount(data);
  });
  socket.on("message", (sender, receiver, text, type) => {
    if (text.length === 0) {
      return socket.emit("noText", "Needs atleast 1 character");
    }
    async function chatText(sender, receiver, text, type) {
      await model.authChat(sender, receiver, text, type, date);
      const chatMessages = await model.getChat(receiver);
      io.in(receiver).emit("collectMessages", chatMessages);
    }
    chatText(sender, receiver, text, type);
  });
  socket.on("DMmessage", (sender, receiver, text, type) => {
    if (text.length === 0) {
      return socket.emit("noText", "Needs atleast 1 character");
    }
    async function chatText(sender, receiver, text, type) {
      await model.authChat(sender, receiver, text, type, date);
      const chatMessages = await model.getDMChat(sender, receiver);
      const items = [`${receiver}`, `${sender}`];
      const order = items.sort();
      const sortByLength = items.sort((a, b) => b.length - a.length);
      io.in(`${sortByLength[0]}`).emit("collectDMMessages", chatMessages);
    }
    chatText(sender, receiver, text, type);
  });
  socket.on("getDMMessages", (sender, receiver) => {
    async function chatText(sender, receiver) {
      const chatMessages = await model.getDMChat(sender, receiver);
      socket.emit("collectDMMessages", chatMessages);
    }
    chatText(sender, receiver);
  });
  socket.on("getMessages", (receiver) => {
    async function chatText(receiver) {
      await model.authChat(receiver);
      const chatMessages = await model.getChat(receiver);
      socket.emit("collectMessages", chatMessages);
    }
    chatText(receiver);
  });
  socket.on("deleteMe", (sender, receiver) => {
    async function deleteChat(sender, receiver) {
      await model.deleteChat(receiver);
      io.emit("chatDeleted", sender, receiver);
    }
    deleteChat(sender, receiver);
  });
  socket.on("leave_room", (sender, receiver) => {
    function leaveRoom(sender, receiver) {
      socket.leave(receiver);
      socket.to(receiver).emit("leaved_room", sender, receiver);
    }
    leaveRoom(sender, receiver);
  });
  socket.on("join_room", (sender, receiver) => {
    function joinRoom(sender, receiver) {
      socket.join(receiver);
      socket.emit("joined_room", sender, receiver);
      socket.to(receiver).emit("joining_room", sender, receiver);
    }
    joinRoom(sender, receiver);
  });
  socket.on("leave_DM_room", (sender, receiver) => {
    const items = [`${receiver}`, `${sender}`];
    const order = items.sort();
    async function leaveRoom(sender, receiver) {
      socket.leave(`${order[0]} & ${order[1]}`);
      socket.to(receiver).emit("leaved_room", sender, receiver);
    }
    leaveRoom(sender, receiver);
  });
  socket.on("join_DM_room", (sender, receiver) => {
    const items = [`${receiver}`, `${sender}`];
    const order = items.sort();
    async function joinDMroom(sender, receiver) {
      socket.join(`${order[0]} & ${order[1]}`);
      socket.emit("joined_DM_room", sender, receiver);
    }
    joinDMroom(sender, receiver);
  });
  socket.on("createChat", (sender, receiver) => {
    if (receiver.length === 0) {
      return socket.emit("noText", "Needs atleast 1 character");
    }
    function createChat(sender, receiver) {
      io.emit("createChat", sender, receiver);
      socket.join(receiver);
      socket.emit("joined_room", sender, receiver);
    }
    createChat(sender, receiver);
  });
  socket.on("login", (data) => {
    async function handleLogin(data) {
      const { username, password } = data;
      if (!username || !password) {
        return socket.emit("loginResponse", {
          info: "One or more of the following is missing. Username or password",
        });
      }
      const existingUser = await model.authLogin(username);
      if (!existingUser) {
        return socket.emit("loginResponse", {
          info: "Username or Password is incorrect",
        });
      }
      const hashedPassword = md5(password);
      if (existingUser.password !== hashedPassword) {
        return socket.emit("loginResponse", {
          info: "Username or Password is incorrect",
        });
      }
      dotenv.config();
      const token = jwt.sign(
        {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        },
        process.env.TOKEN_SECRET
      );
      socket.emit("loginResponse", { token });
    }
    handleLogin(data);
  });
  socket.on("wantAllUsers", (data) => {
    async function authUsers(data) {
      const { username } = data;
      if (!username) {
        return socket.emit({
          info: "Username is missing.",
        });
      }
      const existingUsers = await model.authUsers(username);
      socket.emit("getAllUsers", {
        success: existingUsers,
      });
    }
    authUsers(data);
  });
  socket.on("wantAllChats", () => {
    async function authChats() {
      const existingChats = await model.authChats();
      io.emit("getAllChats", {
        success: existingChats,
      });
    }
    authChats();
  });
  socket.on("updateSocketId", (yourSocketId, yourUsername) => {
    async function update(yourSocketId, yourUsername) {
      await model.updateSocketId(yourSocketId, yourUsername);
      socket.emit("updateSocketId");
    }
    update(yourSocketId, yourUsername);
  });
  socket.on("logoff", () => {});
});

http.listen(PORT, () => {});
