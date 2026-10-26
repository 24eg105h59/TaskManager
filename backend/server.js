const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize SQLite database
require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint for Render / cloud load balancers
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Task REST API Routes
app.use('/api/tasks', taskRoutes);

// Base API info route
app.get('/api', (req, res) => {
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

// Serve frontend static build if deployed together
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      message: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`,
    });
  }

  const indexPath = path.join(frontendDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).json({
        message: 'Welcome to TaskNest API!',
        status: 'online',
        database: 'SQLite (SQL)',
        endpoints: {
          getAllTasks: 'GET /api/tasks',
          createTask: 'POST /api/tasks',
          markTaskCompleted: 'PATCH /api/tasks/:id',
          deleteTask: 'DELETE /api/tasks/:id',
        },
      });
    }
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[TaskNest Server Error]:', err.message);

  return res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Process-level error diagnostics
process.on('uncaughtException', (err) => {
  console.error('[FATAL UNCAUGHT EXCEPTION]:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]:', reason);
});

// Server Port & Host: bind to 0.0.0.0 for Render / cloud deployment
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`TaskNest backend server is running on http://${HOST}:${PORT}`);
});
