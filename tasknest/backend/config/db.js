const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to SQLite database file (configurable via DB_PATH env variable)
const dbPath = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, '../tasknest.sqlite');

/**
 * Initialize SQLite SQL database connection
 */
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(`[TaskNest SQL DB] Connection Error: ${err.message}`);
    process.exit(1);
  }
  console.log(`[TaskNest SQL DB] Connected to SQLite database: ${dbPath}`);
});

/**
 * Create 'tasks' table with SQL if it does not exist
 */
const initDB = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error(`[TaskNest SQL DB] Table creation error: ${err.message}`);
    } else {
      console.log('[TaskNest SQL DB] SQL table "tasks" verified and ready.');
    }
  });
};

initDB();

module.exports = db;
