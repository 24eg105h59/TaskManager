const { db, dbType } = require('../config/db');

/**
 * Format raw SQLite row into a clean Task object
 */
const formatTask = (row) => {
  if (!row) return null;
  return {
    id: Number(row.id),
    _id: row.id.toString(),
    title: row.title,
    description: row.description || '',
    completed: Boolean(row.completed),
    createdAt: row.createdAt,
  };
};

/**
 * Task Model handling SQL operations
 */
const Task = {
  /**
   * Retrieve all tasks sorted by createdAt descending
   */
  findAll: async () => {
    if (dbType === 'node:sqlite') {
      const rows = db.prepare('SELECT * FROM tasks ORDER BY datetime(createdAt) DESC, id DESC').all();
      return rows.map(formatTask);
    } else {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tasks ORDER BY datetime(createdAt) DESC, id DESC', [], (err, rows) => {
          if (err) return reject(err);
          resolve((rows || []).map(formatTask));
        });
      });
    }
  },

  /**
   * Find a single task by ID
   */
  findById: async (id) => {
    const numId = Number(id);
    if (dbType === 'node:sqlite') {
      const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(numId);
      return formatTask(row);
    } else {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM tasks WHERE id = ?', [numId], (err, row) => {
          if (err) return reject(err);
          resolve(formatTask(row));
        });
      });
    }
  },

  /**
   * Create a new task using SQL INSERT
   */
  create: async ({ title, description }) => {
    const now = new Date().toISOString();
    const desc = description ? description.trim() : '';
    const cleanTitle = title.trim();

    if (dbType === 'node:sqlite') {
      const stmt = db.prepare('INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)');
      const res = stmt.run(cleanTitle, desc, now);
      const newId = Number(res.lastInsertRowid);
      return await Task.findById(newId);
    } else {
      return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)';
        db.run(sql, [cleanTitle, desc, now], function (err) {
          if (err) return reject(err);
          Task.findById(this.lastID).then(resolve).catch(reject);
        });
      });
    }
  },

  /**
   * Update task completed status using SQL UPDATE
   */
  updateCompleted: async (id, completed) => {
    const numId = Number(id);
    const completedInt = completed ? 1 : 0;

    if (dbType === 'node:sqlite') {
      const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
      const res = stmt.run(completedInt, numId);
      if (res.changes === 0) return null;
      return await Task.findById(numId);
    } else {
      return new Promise((resolve, reject) => {
        db.run('UPDATE tasks SET completed = ? WHERE id = ?', [completedInt, numId], function (err) {
          if (err) return reject(err);
          if (this.changes === 0) return resolve(null);
          Task.findById(numId).then(resolve).catch(reject);
        });
      });
    }
  },

  /**
   * Delete task by ID using SQL DELETE
   */
  deleteById: async (id) => {
    const numId = Number(id);
    const existingTask = await Task.findById(numId);
    if (!existingTask) return null;

    if (dbType === 'node:sqlite') {
      db.prepare('DELETE FROM tasks WHERE id = ?').run(numId);
      return existingTask;
    } else {
      return new Promise((resolve, reject) => {
        db.run('DELETE FROM tasks WHERE id = ?', [numId], function (err) {
          if (err) return reject(err);
          resolve(existingTask);
        });
      });
    }
  },
};

module.exports = Task;
