const userDB = require("../config/userDB");
const chatDB = require("../config/chatDB");

function authRegister(user) {
  const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  return new Promise((resolve, reject) => {
    userDB.run(sql, [user.username, user.email, user.password], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}
function authLogin(email) {
  const sql = "SELECT * FROM users WHERE username = ?";

  return new Promise((resolve, reject) => {
    userDB.get(sql, email, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function authChat(sender, receiver, text, type, date) {
  const sql =
    "INSERT INTO chat (sender, receiver, text, type, date) VALUES (?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    chatDB.run(sql, [sender, receiver, text, type, date], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}
function updateSocketId(socketId, user) {
  const sql = "UPDATE users SET socketId = ? WHERE username = ?";
  return new Promise((resolve, reject) => {
    userDB.run(sql, [socketId, user], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}
function authChats() {
  const type = "group";
  const sql = "SELECT DISTINCT receiver FROM chat WHERE type = ?";
  return new Promise((resolve, reject) => {
    chatDB.all(sql, [type], (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function getChat(receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = ?";
  return new Promise((resolve, reject) => {
    chatDB.all(sql, [receiver], (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function getDMChat(sender, receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = ? OR receiver = ?";
  return new Promise((resolve, reject) => {
    chatDB.all(sql, [sender, receiver], (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function deleteChat(receiver) {
  const sql = "DELETE FROM chat WHERE receiver = ?";
  return new Promise((resolve, reject) => {
    chatDB.run(sql, [receiver], (error) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve();
    });
  });
}
function authUsers(username) {
  const sql = "SELECT username FROM users WHERE username != ?";

  return new Promise((resolve, reject) => {
    userDB.all(sql, username, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function getSocketReceiver(username) {
  const sql = "SELECT socketId FROM users WHERE username = ?";

  return new Promise((resolve, reject) => {
    userDB.get(sql, username, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
function getSocketSender(username) {
  const sql = "SELECT socketId FROM users WHERE username = ?";

  return new Promise((resolve, reject) => {
    userDB.get(sql, username, (error, rows) => {
      if (error) {
        console.error(error.message);
        reject(error);
      }
      resolve(rows);
    });
  });
}
module.exports = {
  getSocketSender,
  getSocketReceiver,
  authRegister,
  authLogin,
  authUsers,
  authChat,
  getChat,
  authChats,
  deleteChat,
  updateSocketId,
  getDMChat,
};
