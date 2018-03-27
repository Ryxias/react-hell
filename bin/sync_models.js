'use strict';

//
// Synchronizes the database schema with the models that have been loaded
//

const AppKernel = require('../app/AppKernel');
const kernel = new AppKernel('production');

kernel.boot();

kernel.getContainer().get('ConnectionManager').sync()
  .then(() => console.log('Sync completed!'))
  .catch(err => {
    console.error(`Sync error:`);
    console.error(err);
  })
  .then(() => process.exit(0));
