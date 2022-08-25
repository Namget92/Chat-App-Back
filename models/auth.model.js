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
  console.log(result.rows);
  return result.rows;
}

// Kolla på result.rows (svaret postgres ger tbx)

async function authLogin(email) {
  const sql = "SELECT * FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [email]);
  console.log(result.rows);
  return result.rows;
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
  console.log(result.rows);
  return result.rows;
}

async function updateSocketId(socketId, user) {
  const sql = "UPDATE users SET socketId = $1 WHERE username = $1";
  const result = await userPGDB.query(sql, [socketId, user]);
  console.log(result.rows);
  return result.rows;
}

async function authChats() {
  const type = "group";
  const sql = "SELECT DISTINCT receiver FROM chat WHERE type = $1";
  const result = await chatPGDB.query(sql, [type]);
  console.log(result.rows);
  return result.rows;
}

async function getChat(receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = $1";
  const result = await chatPGDB.query(sql, [receiver]);
  console.log(result.rows);
  return result.rows;
}

async function getDMChat(sender, receiver) {
  const sql = "SELECT * FROM chat WHERE receiver = $1 OR receiver = $1";
  const result = await chatPGDB.query(sql, [sender, receiver]);
  console.log(result.rows);
  return result.rows;
}

async function deleteChat(receiver) {
  const sql = "DELETE FROM chat WHERE receiver = $1";
  const result = await chatPGDB.query(sql, [receiver]);
  console.log(result.rows);
  return result.rows;
}

async function authUsers(username) {
  const sql = "SELECT username FROM users WHERE username != $1";
  const result = await userPGDB.query(sql, [username]);
  console.log(result.rows);
  return result.rows;
}

async function getSocketReceiver(username) {
  const sql = "SELECT socketId FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [username]);
  console.log(result.rows);
  return result.rows;
}

async function getSocketSender(username) {
  const sql = "SELECT socketId FROM users WHERE username = $1";
  const result = await userPGDB.query(sql, [username]);
  console.log(result.rows);
  return result.rows;
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
