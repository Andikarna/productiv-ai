const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const logger = require('../utils/logger');

/**
 * JWT Authentication middleware.
 * Verifies Bearer token and attaches req.user (Sequelize User instance).
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded.id is an integer (Sequelize primary key)
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token is valid but user no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.debug(`Auth middleware error: ${error.message}`);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    next(error);
  }
};

module.exports = { authenticateToken };
