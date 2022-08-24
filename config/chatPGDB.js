const { Client } = require("pg");

const chatStmt = `
CREATE TABLE chat (
  id SERIAL PRIMARY KEY,
  sender TEXT,
  receiver TEXT,
  text TEXT,
  type TEXT,
  date TEXT
)
`;

const chatPGDB = new Client({
  ssl: {
    rejectUnauthorized: false,
    // Bör aldrig sättas till rejectUnauthorized i en riktig applikation
    // https://stackoverflow.com/questions/63863591/is-it-ok-to-be-setting-rejectunauthorized-to-false-in-production-postgresql-conn
  },
  connectionString: process.env.DATABASE_URL,
});

chatPGDB.connect(); // Ansluter till Databasen med hjälp av connectionString'en

// Istället för chatPGDB.run i sqlite
chatPGDB.query(chatStmt, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }
});

module.exports = chatPGDB;
