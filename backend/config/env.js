/**
 * Validates required environment variables at startup.
 */
const validateEnv = () => {
  const required = [
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'JWT_SECRET',
    'GEMINI_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please check your .env file against .env.example');
    process.exit(1);
  }
};

module.exports = validateEnv;
