/**
 * TaskNest API Service
 * Encapsulates all backend REST API calls using native Fetch API.
 * The base URL is dynamically loaded from the VITE_API_URL environment variable.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

/**
 * Helper to handle HTTP responses and throw informative errors
 */
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) ||
      `Request failed with status ${response.status} (${response.statusText})`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Retrieve all tasks from the backend
 * @returns {Promise<Array>} Array of task objects
 */
export const getTasks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        'Cannot connect to backend server. Please make sure the backend is running at ' + BASE_URL
      );
    }
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - { title: string, description?: string }
 * @returns {Promise<Object>} The created task
 */
export const createTask = async ({ title, description }) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        title,
        description: description || '',
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach backend server.');
    }
    throw error;
  }
};

/**
 * Mark a task as completed (or toggle completed status)
 * @param {string} id - Task MongoDB ObjectId
 * @param {boolean} [completed=true] - Target completed status
 * @returns {Promise<Object>} The updated task
 */
export const markTaskCompleted = async (id, completed = true) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach backend server.');
    }
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} id - Task MongoDB ObjectId
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach backend server.');
    }
    throw error;
  }
};
