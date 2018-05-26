'use strict';

const FileSweeper = require('./FileSweeper/FileSweeper');
const sinon = require('sinon');

const Timer = {
  elapsed: 0,
  start: sinon.spy(),
  reset: sinon.spy(),
};

const dependencies = [
  require('./FileSweeper/lib/menuTypes'),
  new (require('./FileSweeper/lib/Timer'))(),
  new (require('./FileSweeper/lib/Handler'))().invalidInput,
  new (require('./FileSweeper/lib/Fetcher'))(this.httpClient).fetchList,
  require('axios'),
  (process.env.NODE_ENV === 'production' ? require('/etc/chuuni/config').fsd_workspace.legacy_token
    : require('../config/config').fsd_workspace.legacy_token),
];

const app = new FileSweeper(...dependencies);
