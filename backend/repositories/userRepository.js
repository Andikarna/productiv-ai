const { User } = require('../models');

/**
 * Find a user by email.
 * @param {string} email
 * @returns {Promise<User|null>}
 */
const findByEmail = async (email) => {
  return User.findOne({ where: { email: email.toLowerCase() } });
};

/**
 * Find a user by primary key (id).
 * @param {number} id
 * @returns {Promise<User|null>}
 */
const findById = async (id) => {
  return User.findByPk(id);
};

/**
 * Create a new user.
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<User>}
 */
const create = async (userData) => {
  return User.create(userData);
};

/**
 * Update user preferences.
 * @param {number} userId
 * @param {Object} preferences
 * @returns {Promise<User>}
 */
const updatePreferences = async (userId, preferences) => {
  await User.update({ preferences }, { where: { id: userId } });
  return User.findByPk(userId);
};

/**
 * Update lastActive timestamp.
 * @param {number} userId
 */
const touchLastActive = async (userId) => {
  return User.update({ lastActive: new Date() }, { where: { id: userId } });
};

module.exports = { findByEmail, findById, create, updatePreferences, touchLastActive };
