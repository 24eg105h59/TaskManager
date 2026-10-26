const db = require('../config/db');

/**
 * Format raw SQLite row into a clean Task object
 * Maps 0/1 integer to boolean and provides both `id` and `_id` for frontend compatibility
 */
const formatTask = (row) => {
  if (!row) return null;
  return {
    id: row.id,
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
   * @returns {Promise<Array>}
   */
  findAll: () => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks ORDER BY datetime(createdAt) DESC, id DESC';
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(formatTask));
      });
    });
  },

  /**
   * Find a single task by ID
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  findById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM tasks WHERE id = ?';
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        resolve(formatTask(row));
      });
    });
  },

  /**
   * Create a new task using SQL INSERT
   * @param {Object} data { title, description }
   * @returns {Promise<Object>}
   */
  create: ({ title, description }) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)';
      const now = new Date().toISOString();
      const desc = description ? description.trim() : '';

      db.run(sql, [title.trim(), desc, now], function (err) {
        if (err) return reject(err);
        // this.lastID contains the auto-incremented primary key
        Task.findById(this.lastID).then(resolve).catch(reject);
      });
    });
  },

  /**
   * Update task completed status using SQL UPDATE
   * @param {number|string} id
   * @param {boolean} completed
   * @returns {Promise<Object|null>}
   */
  updateCompleted: (id, completed) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE tasks SET completed = ? WHERE id = ?';
      const completedInt = completed ? 1 : 0;

      db.run(sql, [completedInt, id], function (err) {
        if (err) return reject(err);
        if (this.changes === 0) return resolve(null);
        Task.findById(id).then(resolve).catch(reject);
      });
    });
  },

  /**
   * Delete task by ID using SQL DELETE
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      Task.findById(id)
        .then((task) => {
          if (!task) return resolve(null);

          const sql = 'DELETE FROM tasks WHERE id = ?';
          db.run(sql, [id], function (err) {
            if (err) return reject(err);
            resolve(task);
          });
        })
        .catch(reject);
    });
  },
};

module.exports = Task;
