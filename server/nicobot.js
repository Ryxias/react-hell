//
// Start point for nicobot
//
'use strict';

const AppKernel = require('../app/AppKernel');
const kernel = new AppKernel('production');

kernel.boot();

kernel.getContainer().get('nicobot').connect();
