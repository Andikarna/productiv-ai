const { Message } = require('../models');
const { Op } = require('sequelize');

/**
 * Retrieve the most recent N messages for a user (oldest first for prompt context).
 * @param {number} userId
 * @param {number} limit
 * @returns {Promise<Message[]>}
 */
const getHistory = async (userId, limit = 10) => {
  const messages = await Message.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
    limit,
    raw: true,
  });
  // Reverse so oldest is first (correct prompt ordering)
  return messages.reverse();
};

/**
 * Get paginated full chat history for the UI.
 * @param {number} userId
 * @param {number} page
 * @param {number} pageSize
 * @returns {Promise<{ messages: Message[], total: number }>}
 */
const getPaginated = async (userId, page = 1, pageSize = 20) => {
  const offset = (page - 1) * pageSize;
  const { count, rows } = await Message.findAndCountAll({
    where: { userId },
    order: [['createdAt', 'ASC']],
    limit: pageSize,
    offset,
    raw: true,
  });
  return { messages: rows, total: count };
};

/**
 * Save a single message.
 * @param {Object} messageData - { userId, role, content, metadata? }
 * @returns {Promise<Message>}
 */
const save = async (messageData) => {
  return Message.create(messageData);
};

/**
 * Save user message and assistant response together.
 * @param {number} userId
 * @param {string} userContent
 * @param {string} assistantContent
 * @param {Object} metadata
 */
const saveExchange = async (userId, userContent, assistantContent, metadata = {}) => {
  return Message.bulkCreate([
    { userId, role: 'user', content: userContent },
    { userId, role: 'assistant', content: assistantContent, metadata },
  ]);
};

/**
 * Delete all messages for a user.
 * @param {number} userId
 */
const clearHistory = async (userId) => {
  return Message.destroy({ where: { userId } });
};

module.exports = { getHistory, getPaginated, save, saveExchange, clearHistory };
