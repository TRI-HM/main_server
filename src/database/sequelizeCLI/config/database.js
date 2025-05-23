const dotenv = require('dotenv').config().parsed

let config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'db',
  dialect: process.env.DB_DIALECT,
  port: parseInt(process.env.DB_PORT) || 3306,
  logging: false,
  timezone: '+07:00',
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  migrationStorageTableName: "sequelize_migrations",
  seederStorageTableName: "sequelize_seeds"
}

module.exports = {
  development: config,
  test: config,
  production: config
}
