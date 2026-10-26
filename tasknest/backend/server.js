const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize SQLite database
require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base API route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to TaskNest SQL API!',
    status: 'online',
    database: 'SQLite (SQL)',
    endpoints: {
      getAllTasks: 'GET /api/tasks',
      createTask: 'POST /api/tasks',
      markTaskCompleted: 'PATCH /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id',
    },
  });
});

// Task Routes
app.use('/api/tasks', taskRoutes);

// 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[TaskNest Server Error]:', err.message);

  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`TaskNest backend server is running on http://localhost:${PORT}`);
});
