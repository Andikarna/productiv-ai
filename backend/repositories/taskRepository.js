const { Task } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a new task.
 * @param {Object} taskData
 * @returns {Promise<Task>}
 */
const create = async (taskData) => {
  return Task.create(taskData);
};

/**
 * Get all tasks for a user, sorted by dueDate.
 * @param {number} userId
 * @param {Object} filters - Optional { status, priority }
 * @returns {Promise<Task[]>}
 */
const findByUser = async (userId, filters = {}) => {
  const where = { userId };
  if (filters.status)   where.status   = filters.status;
  if (filters.priority) where.priority = filters.priority;

  return Task.findAll({
    where,
    order: [
      ['dueDate', 'ASC'],
      ['createdAt', 'DESC'],
    ],
    raw: true,
  });
};

/**
 * Find a single task owned by the given user.
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<Task|null>}
 */
const findByIdAndUser = async (taskId, userId) => {
  return Task.findOne({ where: { id: taskId, userId } });
};

/**
 * Update a task.
 * @param {number} taskId
 * @param {number} userId
 * @param {Object} updates
 * @returns {Promise<Task|null>}
 */
const update = async (taskId, userId, updates) => {
  const [affected] = await Task.update(updates, { where: { id: taskId, userId } });
  if (affected === 0) return null;
  return Task.findByPk(taskId, { raw: true });
};

/**
 * Delete a task.
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<number>} Number of deleted rows
 */
const remove = async (taskId, userId) => {
  return Task.destroy({ where: { id: taskId, userId } });
};

/**
 * Get task stats for recommendation engine.
 * @param {number} userId
 * @returns {Promise<{ pending: number, overdue: number, done: number }>}
 */
const getStatsByUser = async (userId) => {
  const now = new Date();
  const [pending, overdue, done] = await Promise.all([
    Task.count({ where: { userId, status: 'pending' } }),
    Task.count({ where: { userId, status: 'pending', dueDate: { [Op.lt]: now } } }),
    Task.count({ where: { userId, status: 'done' } }),
  ]);
  return { pending, overdue, done };
};

module.exports = { create, findByUser, findByIdAndUser, update, remove, getStatsByUser };
