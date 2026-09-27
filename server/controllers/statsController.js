const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

/**
 * GET /api/tasks/stats
 * Returns aggregated task statistics for the authenticated user.
 *
 * Response shape:
 * {
 *   total: 12,
 *   byStatus: { todo: 5, 'in-progress': 3, done: 4 },
 *   byPriority: { low: 3, medium: 5, high: 4 },
 *   overdue: 2,
 *   completedThisWeek: 3,
 *   averageSnippetsPerTask: 2.4
 * }
 */
exports.getTaskStats = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const [statusAgg, priorityAgg, overdueAgg, weekAgg, snippetAgg] = await Promise.all([
    // Group by status
    Task.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Group by priority
    Task.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),

    // Count overdue tasks
    Task.countDocuments({
      userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
    }),

    // Completed this week
    Task.countDocuments({
      userId,
      status: 'done',
      updatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),

    // Average snippets per task
    Task.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          avgSnippets: { $avg: { $size: '$contextSnippets' } },
        },
      },
    ]),
  ]);

  // Transform aggregation results
  const byStatus = {};
  statusAgg.forEach((s) => { byStatus[s._id] = s.count; });

  const byPriority = {};
  priorityAgg.forEach((p) => { byPriority[p._id || 'none'] = p.count; });

  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  res.json({
    total,
    byStatus,
    byPriority,
    overdue: overdueAgg,
    completedThisWeek: weekAgg,
    averageSnippetsPerTask: snippetAgg[0]?.avgSnippets
      ? Math.round(snippetAgg[0].avgSnippets * 10) / 10
      : 0,
  });
});
