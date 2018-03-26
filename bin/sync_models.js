'use strict';

//
// Synchronizes the database schema with the models that have been loaded
//

const AppKernel = require('../app/AppKernel');
const kernel = new AppKernel('production');

kernel.boot();

kernel.getContainer().get('ConnectionManager').sync()
  .then(() => console.log('Sync completed!'))
  .then(() => process.exit(0))
  .catch(err => console.error(`Sync error: ${err.message}.`));
