'use strict';

module.exports = () => {
  const AppKernel = require('../app/AppKernel');
  const app_kernel = new AppKernel(process.env.NODE_ENV);

  app_kernel.boot();

  return app_kernel;
};
