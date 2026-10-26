import React from 'react';

/**
 * Helper to format date in a readable format
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * TaskCard Component
 * Displays a single task with title, description, status, creation date,
 * Complete button, and Delete button.
 */
const TaskCard = ({ task, onComplete, onDelete, isActionLoading }) => {
  const isCompleted = Boolean(task.completed);
  const taskId = task.id || task._id;

  return (
    <article
      className={`task-card ${isCompleted ? 'task-card-completed' : ''}`}
      id={`task-card-${taskId}`}
      data-testid="task-card"
    >
      <div className="task-card-main">
        {/* Status Pill Badge & Creation Date */}
        <div className="task-card-meta">
          <span
            className={`status-badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}
            id={`task-status-${taskId}`}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
          <span className="task-date" title={task.createdAt ? new Date(task.createdAt).toLocaleString() : ''}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatDate(task.createdAt)}
          </span>
        </div>

        {/* Task Title */}
        <h3 className={`task-title ${isCompleted ? 'text-completed' : ''}`}>
          {task.title}
        </h3>

        {/* Task Description (optional) */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      {/* Action Buttons: Complete and Delete */}
      <div className="task-card-actions">
        <button
          type="button"
          id={`btn-complete-${taskId}`}
          className={`btn btn-action ${isCompleted ? 'btn-completed-toggle' : 'btn-complete'}`}
          onClick={() => onComplete(taskId, !isCompleted)}
          disabled={isActionLoading}
          aria-label={isCompleted ? `Mark "${task.title}" as pending` : `Complete "${task.title}"`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {isCompleted ? 'Completed' : 'Complete'}
        </button>

        <button
          type="button"
          id={`btn-delete-${taskId}`}
          className="btn btn-action btn-delete"
          onClick={() => onDelete(taskId)}
          disabled={isActionLoading}
          aria-label={`Delete "${task.title}"`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
