const path = require("path");
require("dotenv").config({
  path: path.resolve(process.cwd(), ".env"),
});
console.log("DB URL:", process.env.DATABASE_URL);
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL,

  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },

  saltRounds: Number(process.env.SALT_ROUNDS) || 10,
};