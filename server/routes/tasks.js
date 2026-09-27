const express = require('express');
const { body } = require('express-validator');
const protect = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
  addSnippet,
  removeSnippet,
} = require('../controllers/taskController');

const router = express.Router();

// All task routes require authentication
router.use(protect);

/**
 * GET    /api/tasks          — list all tasks for the user
 * POST   /api/tasks          — create a new task
 */
router
  .route('/')
  .get(getTasks)
  .post(
    [body('title').trim().notEmpty().withMessage('Title is required')],
    createTask
  );

/**
 * PUT    /api/tasks/:id      — update a task
 * DELETE /api/tasks/:id      — delete a task
 */
router
  .route('/:id')
  .put(updateTask)
  .delete(deleteTask);

/**
 * PATCH  /api/tasks/reorder  — batch reorder after drag-and-drop
 */
router.patch('/reorder', reorderTasks);

/**
 * POST   /api/tasks/:id/snippets             — add a context snippet
 * DELETE /api/tasks/:id/snippets/:snippetId   — remove a context snippet
 */
router.post(
  '/:id/snippets',
  [
    body('type').isIn(['url', 'note', 'file']).withMessage('Type must be url, note, or file'),
    body('label').trim().notEmpty().withMessage('Label is required'),
    body('value').trim().notEmpty().withMessage('Value is required'),
  ],
  addSnippet
);
router.delete('/:id/snippets/:snippetId', removeSnippet);

module.exports = router;
