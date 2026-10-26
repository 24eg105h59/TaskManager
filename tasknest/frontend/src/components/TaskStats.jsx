import React from 'react';

/**
 * TaskStats Component
 * Displays three simple statistics: Total Tasks, Completed Tasks, and Pending Tasks.
 */
const TaskStats = ({ total = 0, completed = 0, pending = 0 }) => {
  return (
    <section className="stats-container" id="tasknest-stats" aria-label="Task Statistics">
      {/* Total Tasks */}
      <div className="stat-card stat-total">
        <div className="stat-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value" id="stat-total-count">{total}</span>
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="stat-card stat-completed">
        <div className="stat-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed Tasks</span>
          <span className="stat-value" id="stat-completed-count">{completed}</span>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="stat-card stat-pending">
        <div className="stat-icon" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="stat-content">
          <span className="stat-label">Pending Tasks</span>
          <span className="stat-value" id="stat-pending-count">{pending}</span>
        </div>
      </div>
    </section>
  );
};

export default TaskStats;
