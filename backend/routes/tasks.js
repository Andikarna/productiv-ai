const express = require('express');
const { body } = require('express-validator');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

const taskValidation = [
  body('title')
    .if(body('naturalLanguage').not().equals('true'))
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 200 }),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'done', 'cancelled'])
    .withMessage('Invalid status value'),
];

/**
 * POST /api/task
 * Body: { title, description?, dueDate?, priority?, naturalLanguage? }
 */
router.post('/', taskValidation, createTask);

/**
 * GET /api/task
 * Query: ?status=pending&priority=high
 */
router.get('/', getTasks);

/**
 * PATCH /api/task/:id
 * Body: { title?, description?, dueDate?, status?, priority? }
 */
router.patch('/:id', updateTask);

/**
 * DELETE /api/task/:id
 */
router.delete('/:id', deleteTask);

module.exports = router;
