'use strict';

const FileSweeper = require('../lib/FileSweeper/FileSweeper');

const dependencies = [
  require('../lib/FileSweeper/utils/menuTypes'),
  new (require('../lib/FileSweeper/utils/Timer'))(),
  new (require('../lib/FileSweeper/utils/Handler'))().invalidInput,
  new (require('../lib/FileSweeper/utils/Fetcher'))(this.httpClient).fetchList,
  require('axios'),
  (process.env.NODE_ENV === 'production' ? require('/etc/chuuni/config').fsd_workspace.legacy_token
    : require('../config/config').fsd_workspace.legacy_token),
];

const app = new FileSweeper(...dependencies);

app.start();
