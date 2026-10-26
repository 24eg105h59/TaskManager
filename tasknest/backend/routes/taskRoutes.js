const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

/**
 * Helper to validate positive integer IDs in SQL
 */
const isValidId = (id) => {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
};

/**
 * @route   GET /api/tasks
 * @desc    Retrieve all tasks (sorted newest first)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/', async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Validate title: required, must be string, cannot be empty or whitespace only
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        message: 'Task title is required and cannot be empty.',
      });
    }

    const newTask = await Task.create({
      title: title.trim(),
      description: description && typeof description === 'string' ? description.trim() : '',
    });

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Mark a task as completed (or toggle completed status)
 * @access  Public
 */
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID format.',
      });
    }

    const existingTask = await Task.findById(id);
    if (!existingTask) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    // Determine target completed state
    let targetCompleted = true;
    if (typeof req.body.completed === 'boolean') {
      targetCompleted = req.body.completed;
    }

    const updatedTask = await Task.updateCompleted(id, targetCompleted);

    return res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task by ID
 * @access  Public
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        message: 'Invalid task ID format.',
      });
    }

    const deletedTask = await Task.deleteById(id);
    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      message: 'Task deleted successfully.',
      task: deletedTask,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
