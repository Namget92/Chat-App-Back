const sqlite3 = require("sqlite3").verbose();

const chatDB = new sqlite3.Database("./chatDB.sqlite", (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }

  const chatStmt = `
    CREATE TABLE chat (
      id SERIAL PRIMARY KEY AUTOINCREMENT,
      sender TEXT,
      receiver TEXT,
      text TEXT,
      type TEXT,
      date TEXT
    )
  `;
  chatDB.run(chatStmt, (error) => {
    if (error) {
      console.error(error.message);
      return;
    }
  });
});

module.exports = chatDB;
