'use strict';

// The "test" environment exists as a copy of the production configs...
// since we run it on the same server.
// Only difference is we run it on a different database name (whew!!)
const config_prod = require('./config_production');

const config_test = Object.assign({}, config_prod);

config_test.db.db = 'chuuni_test';
config_test.db.user = 'test_user';
config_test.db.password = 'IncorrectPasswordDeniesDatabaseAccess';

module.exports = config_test;
