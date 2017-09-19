//
// server.js (renamed from index.jsx)
//
//   Global front controller for this project!
//
'use strict';

const ExpressApplication = require('../init/ExpressApplication');
global.EXPRESS_APP = new ExpressApplication();

EXPRESS_APP.boot();
