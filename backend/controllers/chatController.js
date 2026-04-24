const aiService = require('../services/aiService');
const memoryService = require('../services/memoryService');
const taskService = require('../services/taskService');
const recommendationService = require('../services/recommendationService');
const messageRepository = require('../repositories/messageRepository');
const { buildPrompt } = require('../utils/promptBuilder');
const logger = require('../utils/logger');

/**
 * POST /api/chat
 * Accept user message, build context-aware Gemini prompt, save exchange.
 */
const sendMessage = async (req, res, next) => {
  try {
    const { message, image } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const userId = req.user.id; // Sequelize uses .id (integer)
    const userMessage = message.trim();

    // Detect task intent in message
    const taskKeywords = /^(remind me|add task|create task|new task|task:)/i.test(userMessage);

    // Fetch context in parallel
    const [history, tasks, tips] = await Promise.all([
      memoryService.getContextMessages(userId),
      taskService.getUserTasks(userId, { status: 'pending' }),
      recommendationService.getRecommendations(userId),
    ]);

    // Build Gemini prompt (system instruction + current message)
    const { systemPrompt } = buildPrompt(req.user, userMessage, tasks, tips);

    // Call Gemini with history
    const { content: aiResponse, model, tokens } = await aiService.chat(
      systemPrompt,
      history,
      userMessage,
      image
    );

    // Save exchange & extract preferences (non-blocking)
    await Promise.all([
      memoryService.saveExchange(userId, userMessage, aiResponse, { model, tokens }),
      memoryService.extractAndSavePreferences(userId, userMessage),
      taskKeywords
        ? taskService.createFromNaturalLanguage(userMessage, userId)
        : Promise.resolve(null),
    ]);

    logger.info(`Chat [${req.user.email}]: ${tokens} tokens used (${model})`);

    res.json({
      success: true,
      message: aiResponse,
      metadata: { model, tokens, taskDetected: taskKeywords },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/chat/history
 * Return paginated chat history.
 */
const getHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const pageSize = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const { messages, total } = await messageRepository.getPaginated(req.user.id, page, pageSize);
    res.json({
      success: true,
      data: messages,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/chat/history
 * Clear all chat history for the authenticated user.
 */
const clearHistory = async (req, res, next) => {
  try {
    await messageRepository.clearHistory(req.user.id);
    res.json({ success: true, message: 'Chat history cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getHistory, clearHistory };
