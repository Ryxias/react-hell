//
// server.js (renamed from index.jsx)
//
//   Global front controller for this project!
//
'use strict';

// const ExpressApplication = require('../init/ExpressApplication');
// global.EXPRESS_APP = new ExpressApplication();
//
// EXPRESS_APP.boot();

const AppKernel = require('../app/AppKernel');
const app_kernel = new AppKernel('production');

app_kernel.boot();

app_kernel.getContainer().get('express.server').start();
