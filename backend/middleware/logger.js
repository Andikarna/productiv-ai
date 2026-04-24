const morgan = require('morgan');
const logger = require('../utils/logger');

// Morgan stream to Winston
const morganStream = {
  write: (message) => logger.http(message.trim()),
};

// Skip logging for health check endpoint
const skip = (req) => req.path === '/health';

const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  { stream: morganStream, skip }
);

module.exports = requestLogger;
