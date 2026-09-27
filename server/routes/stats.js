const express = require('express');
const protect = require('../middleware/auth');
const { getTaskStats } = require('../controllers/statsController');

const router = express.Router();

router.use(protect);

/**
 * GET /api/stats — aggregated task statistics
 */
router.get('/', getTaskStats);

module.exports = router;
