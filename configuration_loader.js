//
// Configuration Loader
//   Looks into a specific directory to find a configuration file on the server,
//   which should be a javascript file that exports 'config'
//

const CONFIG_FILE_PATH = '/etc/chuuni/config';

// Blows up on bad permissions
const config = require(CONFIG_FILE_PATH);

// validates the config
if ('object' !== typeof config) {
  throw new Error('Invalid configuration file');
}

// Validates it for db credentials
//
// db:
//   host:
//   db:
//   user:
//   password:
if (null === config.db) {
  throw new Error('Invalid configuration at "db"');
}

// Validates it for slack credentials
//
// slack:
//   bot_user_id:
//   bot_token:
if (null === config.slack) {
  throw new Error('Invalid configuration at "slack_bot_token"');
}

module.exports = config;
