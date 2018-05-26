'use strict';

const FileSweeper = require('./FileSweeper/FileSweeper');

const dependencies = [
  require('./FileSweeper/lib/Timer'),
];

const app = new FileSweeper(...dependencies);

app.start();
