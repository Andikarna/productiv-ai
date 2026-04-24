const taskRepository = require('../repositories/taskRepository');
const logger = require('../utils/logger');

/**
 * Parse natural language task input into structured task data.
 * Handles inputs like "remind me to workout at 7pm tomorrow"
 * @param {string} input - Raw user input
 * @param {string} userId
 * @returns {Object} Structured task object
 */
const parseNaturalLanguageTask = (input, userId) => {
  const text = input.trim();

  // Extract potential due date/time
  let dueDate = null;
  const now = new Date();

  const timePatterns = [
    { regex: /at (\d{1,2})(?::(\d{2}))?\s*(am|pm)/i, handler: (m) => parseTimeToday(m[1], m[2] || '00', m[3]) },
    { regex: /tomorrow/i, handler: () => { const d = new Date(now); d.setDate(d.getDate() + 1); return d; } },
    { regex: /next week/i, handler: () => { const d = new Date(now); d.setDate(d.getDate() + 7); return d; } },
    { regex: /tonight/i, handler: () => parseTimeToday('9', '00', 'pm') },
    { regex: /this evening/i, handler: () => parseTimeToday('6', '00', 'pm') },
    { regex: /this morning/i, handler: () => parseTimeToday('9', '00', 'am') },
    { regex: /in (\d+) (hour|hours)/i, handler: (m) => { const d = new Date(now); d.setHours(d.getHours() + parseInt(m[1])); return d; } },
    { regex: /in (\d+) (day|days)/i, handler: (m) => { const d = new Date(now); d.setDate(d.getDate() + parseInt(m[1])); return d; } },
  ];

  for (const { regex, handler } of timePatterns) {
    const match = text.match(regex);
    if (match) {
      dueDate = handler(match);
      break;
    }
  }

  // Detect priority keywords
  let priority = 'medium';
  if (/urgent|asap|immediately|critical/i.test(text)) priority = 'high';
  else if (/someday|eventually|low priority/i.test(text)) priority = 'low';

  // Clean up the title
  let title = text
    .replace(/remind me to|remind me|i need to|i should|don'?t forget to|make sure to|schedule|task:/gi, '')
    .replace(/at \d{1,2}(?::\d{2})?\s*(?:am|pm)/gi, '')
    .replace(/tomorrow|tonight|this evening|this morning|next week/gi, '')
    .replace(/in \d+ (?:hour|hours|day|days)/gi, '')
    .replace(/urgent|asap|immediately|critical|someday|eventually|low priority/gi, '')
    .trim()
    .replace(/\s+/g, ' ');

  // Capitalize first letter
  title = title.charAt(0).toUpperCase() + title.slice(1);

  return {
    userId,
    title: title || text,
    description: '',
    dueDate,
    priority,
    status: 'pending',
    fromChat: true,
  };
};

/**
 * Parse a time string into today's date at that time.
 */
const parseTimeToday = (hours, minutes, ampm) => {
  const d = new Date();
  let h = parseInt(hours, 10);
  if (ampm?.toLowerCase() === 'pm' && h !== 12) h += 12;
  if (ampm?.toLowerCase() === 'am' && h === 12) h = 0;
  d.setHours(h, parseInt(minutes, 10), 0, 0);
  return d;
};

/**
 * Create a task from structured data.
 * @param {Object} taskData
 * @returns {Promise<Task>}
 */
const createTask = async (taskData) => {
  return taskRepository.create(taskData);
};

/**
 * Create a task from a natural language string.
 * @param {string} input
 * @param {string} userId
 * @returns {Promise<Task>}
 */
const createFromNaturalLanguage = async (input, userId) => {
  const taskData = parseNaturalLanguageTask(input, userId);
  logger.debug(`Parsed task: ${JSON.stringify(taskData)}`);
  return taskRepository.create(taskData);
};

/**
 * Get all tasks for a user.
 * @param {string} userId
 * @param {Object} filters
 */
const getUserTasks = async (userId, filters = {}) => {
  return taskRepository.findByUser(userId, filters);
};

/**
 * Update task status or details.
 * @param {string} taskId
 * @param {string} userId
 * @param {Object} updates
 */
const updateTask = async (taskId, userId, updates) => {
  const task = await taskRepository.update(taskId, userId, updates);
  if (!task) throw new Error('Task not found or access denied');
  return task;
};

/**
 * Delete a task.
 * @param {string} taskId
 * @param {string} userId
 */
const deleteTask = async (taskId, userId) => {
  const result = await taskRepository.remove(taskId, userId);
  if (result.deletedCount === 0) throw new Error('Task not found or access denied');
  return { message: 'Task deleted successfully' };
};

module.exports = {
  createTask,
  createFromNaturalLanguage,
  getUserTasks,
  updateTask,
  deleteTask,
  parseNaturalLanguageTask,
};
