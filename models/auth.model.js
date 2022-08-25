const userPGDB = require("../config/userPGDB");
const chatPGDB = require("../config/chatPGDB");

async function authRegister(user) {
  const sql =
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
  const result = await userPGDB.query(sql, [
    user.username,
    user.email,
    user.password,
  ]);
  return result.rows;
}

async function authLogin(username) {
  const sql = "SELECT * FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [username]);

  return result.rows[0];
}

async function authChat(sender, receiver, text, type, date) {
  const sql =
    "INSERT INTO chat (sender, receiver, text, type, date) VALUES ($1, $2, $3, $4, $5)";
  const result = await chatPGDB.query(sql, [
    sender,
    receiver,
    text,
    type,
    date,
  ]);
  return result.rows;
}

async function updateSocketId(socketId, user) {
  const sql = "UPDATE users SET socketId = $1 WHERE username = $1";
  const result = await userPGDB.query(sql, [socketId, user]);
  return result.rows;
}

async function authChats() {
  const type = "group";
  const sql = "SELECT DISTINCT receiver FROM chat WHERE type = $1";
  const result = await chatPGDB.query(sql, [type]);
  return result.rows[0];
}

async function getChat(receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = $1";
  const result = await chatPGDB.query(sql, [receiver]);
  return result.rows[0];
}

async function getDMChat(sender, receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = $1 OR receiver = $1";
  const result = await chatPGDB.query(sql, [sender, receiver]);
  return result.rows[0];
}

async function deleteChat(receiver) {
  const sql = "DELETE FROM chat WHERE receiver = $1";
  const result = await chatPGDB.query(sql, [receiver]);
  return result.rows;
}

async function authUsers(username) {
  const sql = "SELECT username FROM users WHERE username != $1";
  const result = await userPGDB.query(sql, [username]);
  return result.rows[0];
}

async function getSocketReceiver(username) {
  const sql = "SELECT socketId FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [username]);
  return result.rows[0];
}

async function getSocketSender(username) {
  const sql = "SELECT socketId FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [username]);
  return result.rows[0];
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
