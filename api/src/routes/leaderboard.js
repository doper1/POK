const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

/**
 * @route   GET /api/get-leaderboard
 * @desc    Get leaderboard based on game_money
 * @access  Public
 * @param   {number} amount - Number of users to retrieve (defaults to 100)
 */
router.get('/', leaderboardController.getLeaderboard);

module.exports = router;
