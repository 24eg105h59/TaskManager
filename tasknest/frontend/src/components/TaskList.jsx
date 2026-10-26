import React from 'react';
import TaskCard from './TaskCard';

/**
 * TaskList Component
 * Displays the list of tasks, loading state, or a friendly empty state.
 */
const TaskList = ({
  tasks = [],
  isLoading,
  actionLoadingId,
  onCompleteTask,
  onDeleteTask,
}) => {
  return (
    <section className="task-list-section" id="tasknest-list-section" aria-label="Task List">
      <div className="section-header">
        <h2 className="section-title">Your Tasks</h2>
        {tasks.length > 0 && (
          <span className="task-count-badge" id="task-badge-count">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="state-box loading-box" id="loading-tasks-indicator">
          <div className="loading-spinner" aria-hidden="true"></div>
          <p className="state-message">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="state-box empty-box" id="empty-tasks-message">
          <div className="empty-icon" aria-hidden="true">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <h3 className="empty-title">No tasks found</h3>
          <p className="state-message">
            Your task list is empty. Add your first task above to get started!
          </p>
        </div>
      ) : (
        /* Grid / List of Tasks */
        <div className="task-grid" id="tasknest-grid">
          {tasks.map((task) => {
            const taskId = task.id || task._id;
            return (
              <TaskCard
                key={taskId}
                task={task}
                onComplete={onCompleteTask}
                onDelete={onDeleteTask}
                isActionLoading={actionLoadingId === taskId}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TaskList;
