'use strict';

//
// Synchronizes the database schema with the models that have been loaded
//

const AppKernel = require('../app/AppKernel');
const kernel = new AppKernel('production');

kernel.boot();

const ConnectionManager = kernel.getContainer().get('ConnectionManager');
const SessionStore = kernel.getContainer().get('express.session_store');

ConnectionManager.createDatabaseIfNotExists()
  // create Sessions table
  .then(() => SessionStore.sync())
  // This step may fail because the models are sync'd in the wrong order (Foreign key problems)
  // Simply re-run the whole operation and it should work
  .then(() => ConnectionManager.sync())
  .then(() => console.log('Sync completed!'))
  .catch(err => {
    console.error(`Sync error:`);
    console.error(err);
  })
  .then(() => process.exit(0));
