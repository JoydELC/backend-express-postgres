require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  dbUser: process.env.POSTGRES_USER,
  dbPassword: process.env.POSTGRES_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.POSTGRES_DB, 
  dbPort: process.env.DB_PORT,
};

module.exports = { config };
