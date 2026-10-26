import React from 'react';

/**
 * TaskHeader Component
 * Displays the website brand name and subtitle.
 */
const TaskHeader = () => {
  return (
    <header className="header" id="tasknest-header">
      <div className="header-brand">
        <div className="brand-icon" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="brand-text">
          <h1 className="header-title">TaskNest</h1>
          <p className="header-subtitle">Organize your day, one task at a time.</p>
        </div>
      </div>
    </header>
  );
};

export default TaskHeader;
