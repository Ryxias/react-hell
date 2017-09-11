'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize_config) => {
  let db_name = sequelize_config.db;
  let user = sequelize_config.user;
  let password = sequelize_config.password;
  let db_host = sequelize_config.host;

  return new Sequelize(
    db_name,
    user,
    password,
    {
      host: db_host,
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
      logging: false
    }
  );
};
