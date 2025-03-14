const express = require('express');
const router = express.Router();
const leaderboardRoutes = require('./leaderboard');

// Mount leaderboard routes
router.use('/get-leaderboard', leaderboardRoutes);

module.exports = router;
