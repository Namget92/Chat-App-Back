const sqlite3 = require("sqlite3").verbose();

const userDB = new sqlite3.Database("./userDB.sqlite", (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }

  const usersStmt = `
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT UNIQUE,
      password TEXT,
      socketId TEXT
      
    )
  `;
  userDB.run(usersStmt, (error) => {
    if (error) {
      console.error(error.message);
      return;
    }
  });
});

module.exports = userDB;
