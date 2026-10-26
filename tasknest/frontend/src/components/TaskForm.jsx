import React, { useState } from 'react';

/**
 * TaskForm Component
 * Allows users to add a new task with a required title and optional description.
 */
const TaskForm = ({ onAddTask, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side validation: title cannot be empty
    if (!title.trim()) {
      setValidationError('Please enter a task title.');
      return;
    }

    setValidationError('');
    onAddTask({
      title: title.trim(),
      description: description.trim(),
    });

    // Reset form fields
    setTitle('');
    setDescription('');
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (validationError && e.target.value.trim()) {
      setValidationError('');
    }
  };

  return (
    <section className="form-card" id="tasknest-form-section">
      <h2 className="form-heading">Create New Task</h2>
      <form onSubmit={handleSubmit} className="task-form" noValidate>
        {/* Task Title Input */}
        <div className="form-group">
          <label htmlFor="task-title-input" className="form-label">
            Task Title <span className="required-star">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            className={`form-input ${validationError ? 'input-error' : ''}`}
            placeholder="e.g., Complete project documentation"
            value={title}
            onChange={handleTitleChange}
            disabled={isSubmitting}
            maxLength={120}
            required
          />
          {validationError && (
            <span className="validation-message" role="alert">
              {validationError}
            </span>
          )}
        </div>

        {/* Task Description Textarea */}
        <div className="form-group">
          <label htmlFor="task-description-input" className="form-label">
            Task Description <span className="optional-badge">(optional)</span>
          </label>
          <textarea
            id="task-description-input"
            className="form-textarea"
            placeholder="Add any extra details, notes, or checklists..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-add-task"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="btn-spinner" aria-hidden="true"></span>
              Adding Task...
            </>
          ) : (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Task
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default TaskForm;
