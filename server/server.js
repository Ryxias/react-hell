//
// server.js (renamed from index.jsx)
//
//   Global front controller for this project!
//
'use strict';

const AppKernel = require('../app/AppKernel');
const app_kernel = new AppKernel('production');

app_kernel.boot();

app_kernel.getContainer().get('express.server').start();

if ('production' === app_kernel.getContainer().get('ConfigurationManager').getValue('NODE_ENV')) {
  app_kernel.getContainer().get('chuubot').connect();
}
