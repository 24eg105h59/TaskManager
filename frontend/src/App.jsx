import React, { useState, useEffect, useCallback } from 'react';
import TaskHeader from './components/TaskHeader';
import TaskStats from './components/TaskStats';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Notification from './components/Notification';
import { getTasks, createTask, markTaskCompleted, deleteTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null);

  /**
   * Helper to display notifications
   */
  const showNotification = useCallback((type, message) => {
    setNotification({ type, message });
  }, []);

  /**
   * Helper to clear notifications
   */
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  /**
   * Fetch all tasks from backend
   */
  const loadTasks = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    }
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load tasks from server.');
    } finally {
      if (isInitial) {
        setIsLoading(false);
      }
    }
  }, [showNotification]);

  // Initial data load on mount
  useEffect(() => {
    loadTasks(true);
  }, [loadTasks]);

  /**
   * Add a new task
   */
  const handleAddTask = async ({ title, description }) => {
    setIsSubmitting(true);
    try {
      const newTask = await createTask({ title, description });
      // Optimistically update or reload tasks to refresh list and statistics
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      showNotification('success', 'Task added successfully!');
    } catch (err) {
      showNotification('error', err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Update task completed status
   */
  const handleCompleteTask = async (id, targetStatus) => {
    setActionLoadingId(id);
    try {
      const updated = await markTaskCompleted(id, targetStatus);
      // Update state with updated task
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === id || t._id === id ? updated : t))
      );
      showNotification(
        'success',
        updated.completed
          ? 'Task marked as completed!'
          : 'Task marked as pending.'
      );
    } catch (err) {
      showNotification('error', err.message || 'Failed to update task status.');
      // Refresh to ensure synchronization with backend
      loadTasks();
    } finally {
      setActionLoadingId(null);
    }
  };

  /**
   * Delete a task
   */
  const handleDeleteTask = async (id) => {
    setActionLoadingId(id);
    try {
      await deleteTask(id);
      // Remove deleted task from state to update list and statistics
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id && t._id !== id));
      showNotification('success', 'Task deleted successfully.');
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete task.');
      // Refresh to sync
      loadTasks();
    } finally {
      setActionLoadingId(null);
    }
  };

  // Derive simple statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app-layout">
      {/* Top Notification Toast / Banner */}
      <Notification
        notification={notification}
        onDismiss={dismissNotification}
      />

      <div className="app-container">
        {/* Header */}
        <TaskHeader />

        {/* 3 Simple Statistics: Total, Completed, Pending */}
        <TaskStats
          total={totalTasks}
          completed={completedTasks}
          pending={pendingTasks}
        />

        {/* Main Content Area: Form & Task List */}
        <main className="main-content">
          {/* Add Task Form */}
          <TaskForm
            onAddTask={handleAddTask}
            isSubmitting={isSubmitting}
          />

          {/* Saved Tasks Section */}
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            actionLoadingId={actionLoadingId}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
          />
        </main>

        {/* Simple Footer */}
        <footer className="footer" id="tasknest-footer">
          <p>TaskNest &copy; {new Date().getFullYear()} — Simple Daily Task Management</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
