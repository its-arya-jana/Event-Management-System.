module.exports = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ems_user',
  password: process.env.DB_PASSWORD || 'ems_password',
  database: process.env.DB_NAME || 'event_management_system',
  port: process.env.DB_PORT || 3306
};