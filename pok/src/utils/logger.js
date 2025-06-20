const winston = require('winston');

// Configure Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    winston.format.printf((info) => {
      const { timestamp, level, message, metadata } = info;
      const chatName = metadata?.chatName || 'SYSTEM';
      const author = metadata?.author || '-';
      // Handle cases where message might be an object (like errors)
      const msg =
        typeof message === 'string' ? message : JSON.stringify(message);
      return `[${timestamp}] [${level.toUpperCase()}] [${chatName}] [${author}] ${msg}`;
    }),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'pok_app.log' }),
  ],
});

module.exports = { logger }; 