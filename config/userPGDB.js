const { Client } = require("pg");

const usersStmt = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT,
  email TEXT UNIQUE,
  password TEXT,
  socketId TEXT
  
)
`;

const userPGDB = new Client({
  ssl: {
    rejectUnauthorized: false,
    // Bör aldrig sättas till rejectUnauthorized i en riktig applikation
    // https://stackoverflow.com/questions/63863591/is-it-ok-to-be-setting-rejectunauthorized-to-false-in-production-postgresql-conn
  },
  connectionString: process.env.DATABASE_URL,
});

userPGDB.connect(); // Ansluter till Databasen med hjälp av connectionString'en

// Istället för userPGDB.run i sqlite
userPGDB.query(usersStmt, (error) => {
  if (error) {
    console.error(error.message);
    throw error;
  }
});

module.exports = userPGDB;
