'use strict';

// All secret keys and tokens can be stored here and are .gitignored
module.exports = {
  port: 8000,
  db: {
    host: '',
    db: 'chuuni',
    user: 'root',
    password: '',
  },
  secret: 'development_env_session_secret_lol',
  slack: {
    bot_user_id: '',
    bot_token: '',
  },
  nicobot: {
    bot_user_id: '',
    bot_token: '',
  }
};
