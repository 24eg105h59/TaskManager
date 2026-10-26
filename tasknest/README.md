# TaskNest — Mini Task Manager

A simple, beginner-friendly full-stack task management website built with **React (Vite)**, **Node.js (Express)**, and **SQL (SQLite)**.

Organize your day, one task at a time — easily add, view, complete, and delete your daily tasks.

---

## 📁 Project Structure

```text
tasknest/
├── backend/
│   ├── config/
│   │   └── db.js            # SQLite database connection & SQL schema initialization
│   ├── models/
│   │   └── Task.js          # SQL Task model executing queries (SELECT, INSERT, UPDATE, DELETE)
│   ├── routes/
│   │   └── taskRoutes.js    # Express REST API routes for tasks
│   ├── .env.example         # Template for backend environment variables
│   ├── .gitignore           # Ignores node_modules, .env, and *.sqlite files
│   ├── package.json         # Backend dependencies (express, sqlite3, cors, dotenv)
│   └── server.js            # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg      # TaskNest icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskHeader.jsx    # Header with title and subtitle
│   │   │   ├── TaskStats.jsx     # Total, Completed, and Pending statistics
│   │   │   ├── TaskForm.jsx      # Input form for adding tasks
│   │   │   ├── TaskCard.jsx      # Individual task card with Complete & Delete
│   │   │   ├── TaskList.jsx      # Task grid, loading & empty state
│   │   │   └── Notification.jsx  # Toast banner for success and errors
│   │   ├── services/
│   │   │   └── api.js            # Fetch API integration with backend
│   │   ├── App.jsx               # Main React application component
│   │   ├── index.css             # Vanilla CSS styling
│   │   └── main.jsx              # React DOM entry point
│   ├── .env.example         # Template for frontend environment variables
│   ├── .gitignore           # Ignores node_modules, dist, and .env
│   ├── index.html           # Main HTML document
│   ├── package.json         # Frontend dependencies & npm scripts
│   └── vite.config.js       # Vite build configuration
└── README.md                # Project documentation & setup instructions
```

---

## 🗄️ SQL Database Schema

The application uses an embedded **SQLite SQL** database (`tasknest.sqlite`), which runs locally without requiring any external database server setup or installation.

The `tasks` table is automatically created with the following SQL schema:

```sql
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  completed INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL
);
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **[Node.js](https://nodejs.org/)** (v18 or higher) installed on your computer.
*(No external database installation required — SQLite runs directly with Node.js!)*

---

### Step 1: Running the Backend

1. Open your terminal (Command Prompt, PowerShell, or Bash) and navigate to the `backend` folder:
   ```bash
   cd tasknest/backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```

   You should see:
   ```text
   TaskNest backend server is running on http://localhost:5000
   [TaskNest SQL DB] Connected to SQLite database: .../tasknest.sqlite
   [TaskNest SQL DB] SQL table "tasks" verified and ready.
   ```

---

### Step 2: Running the Frontend

1. Open a **new** terminal window and navigate to the `frontend` folder:
   ```bash
   cd tasknest/frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 REST API Reference

The backend exposes the following REST endpoints under `/api/tasks`:

| Method | Endpoint | Description | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Retrieve all tasks (ordered by newest first) | None | `200 OK` with JSON array of tasks |
| **POST** | `/api/tasks` | Create a new task | `{ "title": "...", "description": "..." }` | `201 Created` with created task object |
| **PATCH** | `/api/tasks/:id` | Mark task as completed (or toggle) | Optional: `{ "completed": true }` | `200 OK` with updated task object |
| **DELETE** | `/api/tasks/:id` | Delete a task by ID | None | `200 OK` with confirmation message |

### Validation & Error Handling
- **Empty Title Validation:** Submitting an empty title returns `400 Bad Request` with `{ "message": "Task title is required and cannot be empty." }`.
- **Invalid ID Format:** Requesting an invalid non-integer ID returns `400 Bad Request` with `{ "message": "Invalid task ID format." }`.
- **Task Not Found:** Requesting an ID that does not exist returns `404 Not Found` with `{ "message": "Task not found." }`.
