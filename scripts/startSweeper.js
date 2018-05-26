'use strict';

const FileSweeper = require('./FileSweeper/FileSweeper');

const dependencies = [
  require('./FileSweeper/lib/menuTypes'),
  require('./FileSweeper/lib/Timer'),
  require('axios'),
  (process.env.NODE_ENV === 'production' ? require('/etc/chuuni/config').fsd_workspace.legacy_token
    : require('../config/config').fsd_workspace.legacy_token),
];

const app = new FileSweeper(...dependencies);

app.start();
