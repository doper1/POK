require('dotenv').config();
const express = require('express');
const winston = require('winston');
const { dbRO, dbRW, dbInitialization } = require('./db');
const app = express();
const PORT = process.env.PORT || 5000;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

/**
 * @route   GET /api/get-leaderboard
 * @desc    Get leaderboard based on game_money
 * @access  Public
 * @param   {number} amount - Number of users to retrieve (defaults to 100)
 */
app.get('/api/get-leaderboard', async (req, res) => {
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
});

// Wait for DB initialization before starting the server.
dbInitialization
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('DB Initialization failed:', err);
    process.exit(1);
  });

// Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
