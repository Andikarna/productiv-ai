const express = require('express');
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All chat routes require authentication
router.use(authenticateToken);

/**
 * POST /api/chat
 * Body: { message: string }
 */
router.post('/', sendMessage);

/**
 * GET /api/history
 * Query: ?page=1&limit=20
 */
router.get('/history', getHistory);

/**
 * DELETE /api/history
 * Clear all chat messages for authenticated user.
 */
router.delete('/history', clearHistory);

module.exports = router;
