const messageRepository = require('../repositories/messageRepository');
const userRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

const CONTEXT_LIMIT = parseInt(process.env.CONTEXT_MESSAGE_LIMIT || '10', 10);

/**
 * Get recent conversation history for building a context-aware prompt.
 * @param {string} userId
 * @returns {Promise<Array>} Array of message documents (oldest first)
 */
const getContextMessages = async (userId) => {
  return messageRepository.getHistory(userId, CONTEXT_LIMIT);
};

/**
 * Save a user ↔ assistant exchange to MySQL.
 * @param {number} userId
 * @param {string} userMessage
 * @param {string} assistantMessage
 * @param {Object} metadata - { model, tokens }
 */
const saveExchange = async (userId, userMessage, assistantMessage, metadata = {}) => {
  try {
    await messageRepository.saveExchange(userId, userMessage, assistantMessage, metadata);
    logger.debug(`Saved chat exchange for user ${userId}`);
  } catch (err) {
    // Log but don't throw — saving failure shouldn't block the response
    logger.error(`Failed to save chat exchange: ${err.message}`);
  }
};

/**
 * Scan the latest user message for preference keywords and update user's profile.
 * Example: "I'm a morning person" → add 'morning person' to habits.
 * @param {string} userId
 * @param {string} message
 */
const extractAndSavePreferences = async (userId, message) => {
  const lower = message.toLowerCase();
  const detectedHabits = [];

  // Simple keyword-based preference extraction
  const habitPatterns = [
    { pattern: /morning person|early bird|wake up early/i, habit: 'morning person' },
    { pattern: /night owl|work late|late night/i, habit: 'night owl' },
    { pattern: /workout|exercise|gym|fitness/i, habit: 'fitness enthusiast' },
    { pattern: /meditat/i, habit: 'meditator' },
    { pattern: /pomodoro|time block/i, habit: 'uses time-blocking' },
    { pattern: /procrastinat/i, habit: 'struggles with procrastination' },
  ];

  for (const { pattern, habit } of habitPatterns) {
    if (pattern.test(lower)) {
      detectedHabits.push(habit);
    }
  }

  if (detectedHabits.length > 0) {
    try {
      const user = await userRepository.findById(userId);
      if (user) {
        const existing = user.preferences?.habits || [];
        const merged = [...new Set([...existing, ...detectedHabits])];
        await userRepository.updatePreferences(userId, {
          ...user.preferences,
          habits: merged,
        });
        logger.debug(`Updated habits for user ${userId}: ${merged.join(', ')}`);
      }
    } catch (err) {
      logger.error(`Failed to update preferences: ${err.message}`);
    }
  }
};

module.exports = { getContextMessages, saveExchange, extractAndSavePreferences };
