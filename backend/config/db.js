const path = require('path');

/**
 * Determine suitable SQLite DB path
 * On Render/Linux cloud environments, /tmp is always writable.
 */
let dbPath = process.env.DB_PATH;
if (!dbPath) {
  if (process.env.RENDER) {
    dbPath = '/tmp/tasknest.sqlite';
  } else {
    dbPath = path.join(__dirname, '../tasknest.sqlite');
  }
}

let db = null;
let dbType = 'none';

// 1. Try built-in Node.js SQLite (available on Node >= 22.5.0 and Node 24)
try {
  const { DatabaseSync } = require('node:sqlite');
  db = new DatabaseSync(dbPath);
  dbType = 'node:sqlite';
  console.log(`[TaskNest SQL DB] Connected using built-in node:sqlite at: ${dbPath}`);
} catch (err) {
  console.warn(`[TaskNest SQL DB] node:sqlite notice: ${err.message}`);
}

// 2. If node:sqlite failed, try sqlite3 package
if (!db) {
  try {
    const sqlite3 = require('sqlite3').verbose();
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error(`[TaskNest SQL DB] sqlite3 connection error: ${err.message}`);
      } else {
        console.log(`[TaskNest SQL DB] Connected using sqlite3 package at: ${dbPath}`);
      }
    });
    dbType = 'sqlite3';
  } catch (err) {
    console.warn(`[TaskNest SQL DB] sqlite3 package notice: ${err.message}`);
  }
}

// 3. Fallback to in-memory database if file path cannot be written
if (!db) {
  try {
    const { DatabaseSync } = require('node:sqlite');
    db = new DatabaseSync(':memory:');
    dbType = 'node:sqlite';
    console.log('[TaskNest SQL DB] Using in-memory SQLite database fallback.');
  } catch (err) {
    console.error(`[TaskNest SQL DB] In-memory initialization error: ${err.message}`);
  }
}

/**
 * Initialize schema table
 */
const initSchema = () => {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `;

  if (dbType === 'node:sqlite') {
    db.exec(createTableSql);
    console.log('[TaskNest SQL DB] SQL table "tasks" verified and ready.');
  } else if (dbType === 'sqlite3') {
    db.run(createTableSql, (err) => {
      if (err) {
        console.error(`[TaskNest SQL DB] Table creation error: ${err.message}`);
      } else {
        console.log('[TaskNest SQL DB] SQL table "tasks" verified and ready.');
      }
    });
  }
};

initSchema();

module.exports = {
  db,
  dbType,
};
