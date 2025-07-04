require('dotenv').config()

module.exports = {
  env: process.env.NODE_ENV,
  JWTSecret: process.env.JWT_SECRET_KEY,
  // Additional configuration can be added here as needed
}
