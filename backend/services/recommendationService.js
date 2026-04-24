const taskRepository = require('../repositories/taskRepository');
const logger = require('../utils/logger');

// Curated productivity tip bank
const TIPS = {
  overdue: [
    'The user has overdue tasks. Gently encourage them to tackle the most important one first using the "eat the frog" technique.',
    'The user is running behind on some tasks. A gentle reminder about prioritization might help.',
  ],
  manyPending: [
    "The user has a lot of pending tasks. Suggest breaking them into smaller chunks or using time-blocking.",
    "Consider suggesting the user do a 'brain dump' and then prioritize using the Eisenhower Matrix.",
  ],
  goodProgress: [
    "The user is making great progress on their tasks! Offer positive reinforcement and encourage continued momentum.",
    "The user has been completing tasks well. Celebrate that briefly and ask if they want to set new goals.",
  ],
  noTasks: [
    "The user has no tasks yet. Encourage them to set up a few goals for the day.",
  ],
  balanced: [
    "The user seems to have a good task balance. Keep the tone encouraging and offer to help plan the next step.",
  ],
};

/**
 * Analyze user's task statistics and return relevant productivity tips.
 * @param {string} userId
 * @returns {Promise<string[]>} Array of tip strings to inject into the prompt
 */
const getRecommendations = async (userId) => {
  try {
    const stats = await taskRepository.getStatsByUser(userId);
    const { pending, overdue, done } = stats;
    const total = pending + done;

    logger.debug(`Task stats for ${userId}: pending=${pending}, overdue=${overdue}, done=${done}`);

    const tips = [];

    if (total === 0) {
      tips.push(randomFrom(TIPS.noTasks));
    } else if (overdue > 0) {
      tips.push(randomFrom(TIPS.overdue));
    } else if (pending > 5) {
      tips.push(randomFrom(TIPS.manyPending));
    } else if (done > 0 && done >= pending) {
      tips.push(randomFrom(TIPS.goodProgress));
    } else {
      tips.push(randomFrom(TIPS.balanced));
    }

    return tips;
  } catch (err) {
    logger.error(`Recommendation engine error: ${err.message}`);
    return []; // Fail silently — recommendations are optional
  }
};

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = { getRecommendations };
