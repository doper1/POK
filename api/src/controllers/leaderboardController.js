const { dbRO } = require('../db');
const logger = require('../config/logger');

/**
 * Get leaderboard based on game_money
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
const getLeaderboard = async (req, res) => {
  try {
    const amount = parseInt(req.query.amount) || 100;
    if (amount <= 0 || isNaN(amount)) {
      logger.warn(`Invalid amount parameter: ${req.query.amount}`);
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number',
      });
    }

    logger.info(`Fetching leaderboard for top ${amount} users`);
    const queryText = `
      SELECT 
        RIGHT(id::text, 3) as id_last_3,
        money 
      FROM 
        "user"
      ORDER BY 
        money DESC
      LIMIT $1
    `;
    const result = await dbRO.query(queryText, [amount]);
    logger.info(`Retrieved ${result.rows.length} users for leaderboard`);

    const transformedResult = result.rows.map((row) => ({
      ...row,
      id: row.id_last_3.padStart(3, '0'),
    }));

    res.status(200).json({
      success: true,
      count: transformedResult.length,
      leaderboard: transformedResult,
    });
    logger.info('Leaderboard sent successfully');
  } catch (error) {
    logger.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
    });
  }
};

module.exports = {
  getLeaderboard,
};
