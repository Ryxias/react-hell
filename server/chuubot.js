//
// Start point for chuubot
//
//   You can boot chuubot via npm run chuubot
//
// (!) this has since been folded back into the server.js as a temporary hack
//     to get messaging working
//
'use strict';

const AppKernel = require('../app/AppKernel');
const app_kernel = new AppKernel('production');

app_kernel.boot();

app_kernel.getContainer().get('chuubot').connect();
