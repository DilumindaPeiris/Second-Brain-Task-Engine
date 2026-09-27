const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// ──────────────────────────────────────────────
// CRUD
// ──────────────────────────────────────────────

/**
 * GET /api/tasks
 * Fetch all tasks for the authenticated user, sorted by column order.
 */
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ status: 1, order: 1 });
    res.json(tasks);
  } catch (error) {
    console.error('getTasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

/**
 * POST /api/tasks
 * Create a new task for the authenticated user.
 */
exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, status, contextSnippets } = req.body;

    // Place new tasks at the end of their column
    const lastTask = await Task.findOne({ userId: req.userId, status: status || 'todo' })
      .sort({ order: -1 })
      .select('order');

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      status: status || 'todo',
      order: lastTask ? lastTask.order + 1 : 0,
      contextSnippets: contextSnippets || [],
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('createTask error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

/**
 * PUT /api/tasks/:id
 * Update a task (title, description, status).
 */
exports.updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('updateTask error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task.
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('deleteTask error:', error);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};

// ──────────────────────────────────────────────
// Kanban Reorder
// ──────────────────────────────────────────────

/**
 * PATCH /api/tasks/reorder
 * Batch-update task positions after a drag-and-drop.
 *
 * Expected body:
 * {
 *   tasks: [
 *     { id: "<taskId>", status: "todo", order: 0 },
 *     { id: "<taskId>", status: "in-progress", order: 1 },
 *     ...
 *   ]
 * }
 */
exports.reorderTasks = async (req, res) => {
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ message: 'tasks array is required' });
  }

  try {
    const bulkOps = tasks.map(({ id, status, order }) => ({
      updateOne: {
        filter: { _id: id, userId: req.userId },
        update: { $set: { status, order } },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.json({ message: 'Reorder successful' });
  } catch (error) {
    console.error('reorderTasks error:', error);
    res.status(500).json({ message: 'Failed to reorder tasks' });
  }
};

// ──────────────────────────────────────────────
// Context Snippets
// ──────────────────────────────────────────────

/**
 * POST /api/tasks/:id/snippets
 * Add a context snippet to a task.
 */
exports.addSnippet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $push: { contextSnippets: req.body } },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(201).json(task);
  } catch (error) {
    console.error('addSnippet error:', error);
    res.status(500).json({ message: 'Failed to add snippet' });
  }
};

/**
 * DELETE /api/tasks/:id/snippets/:snippetId
 * Remove a specific context snippet from a task.
 */
exports.removeSnippet = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $pull: { contextSnippets: { _id: req.params.snippetId } } },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('removeSnippet error:', error);
    res.status(500).json({ message: 'Failed to remove snippet' });
  }
};
