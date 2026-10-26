import React, { useEffect } from 'react';

/**
 * Notification Component
 * Renders success or error messages with auto-dismiss and manual close.
 */
const Notification = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (!notification) return;

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification || !notification.message) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div
      className={`notification-banner ${isSuccess ? 'notification-success' : 'notification-error'}`}
      role="alert"
      id="tasknest-notification"
    >
      <div className="notification-icon" aria-hidden="true">
        {isSuccess ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>

      <div className="notification-text">
        <p className="notification-message">{notification.message}</p>
      </div>

      <button
        type="button"
        className="notification-close-btn"
        onClick={onDismiss}
        aria-label="Dismiss message"
        id="btn-dismiss-notification"
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
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
