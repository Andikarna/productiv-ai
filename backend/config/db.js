const { sequelize } = require('../models');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ MySQL connected successfully');

    // Sync all models (create tables if they don't exist)
    // alter: true → update columns if model changes (safe for dev)
    await sequelize.sync({ alter: true });
    logger.info('✅ MySQL tables synced');
  } catch (error) {
    logger.error(`❌ MySQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
