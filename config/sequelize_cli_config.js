'use strict';

//
// sequelize-cli annoying requires this special configuration file specifically for running it. It is specified
// in the ".sequelizerc" file, and is expected to export a specific set of parameters.
//
// https://stackoverflow.com/questions/25102271/what-goes-in-the-sequelize-config-file
//

// AN INCREDIBLY ANNOYING DETAIL; sequelize-cli is written in ES6 syntax. So we need to use babel to transpile
// this crap to get it to work.
require('babel-core/register');

const AppKernel = require('../app/AppKernel');
const app_kernel = new AppKernel(process.env.NODE_ENV);

app_kernel.boot();

const ConfigurationManager = app_kernel.getContainer().get('ConfigurationManager');
const config = ConfigurationManager;

module.exports = {
  database: config.getValue('db.db'),
  username: config.getValue('db.user'),
  password: config.getValue('db.password'),
  host: config.getValue('db.host'),
  port: null, // defaults to 3306
  dialect: 'mysql',

  // Extremely annoyingly: https://github.com/sequelize/cli/pull/591
  //   Default characterset/collation is not supported on a connection-level for sequelize CLI.
  // dialectOptions: {
  //   charset: 'utf8mb4',
  //   collate: 'utf8mb4_unicode_ci',
  // },
  logging: true,
};
