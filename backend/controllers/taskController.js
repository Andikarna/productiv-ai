const { validationResult } = require('express-validator');
const taskService = require('../services/taskService');
const logger = require('../utils/logger');

/**
 * POST /api/task
 */
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { title, description, dueDate, priority, naturalLanguage } = req.body;
    const userId = req.user.id; // Sequelize integer id

    let task;
    if (naturalLanguage && title) {
      task = await taskService.createFromNaturalLanguage(title, userId);
    } else {
      task = await taskService.createTask({
        userId,
        title,
        description: description || '',
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        status: 'pending',
        fromChat: false,
      });
    }

    logger.info(`Task created for ${req.user.email}: "${task.title}"`);
    res.status(201).json({ success: true, message: 'Task created!', task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/task
 */
const getTasks = async (req, res, next) => {
  try {
    const { status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const tasks = await taskService.getUserTasks(req.user.id, filters);
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/task/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.userId;

    const task = await taskService.updateTask(id, req.user.id, updates);
    res.json({ success: true, message: 'Task updated.', task });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

/**
 * DELETE /api/task/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
