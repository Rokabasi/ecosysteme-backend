const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.db_name,
  process.env.role,
  process.env.password,
  {
    host: process.env.hostname,
    dialect: process.env.dialect,
  }
);
sequelize
  .authenticate()
  .then(() => console.log("connection db is established successfully"))
  .catch((err) => logger.error(err));

module.exports = sequelize;
