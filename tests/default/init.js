'use strict';

const AppKernel = require('../../app/AppKernel');
const app_kernel = new AppKernel('production');

app_kernel.boot();

module.exports = app_kernel;
