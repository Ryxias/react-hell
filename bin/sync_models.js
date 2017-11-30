'use strict';

//
// Synchronizes the database schema with the models that have been loaded
//

const CommandLineApplication = require('../init/CommandLineApplication');
global.APP = new CommandLineApplication();
APP.boot();

const sequelize = APP.getSequelizeConnection();
const models = APP.getSequelizeModels();
const sessionStore = APP.getSessionStore();

const model_sync_promises = [];

// http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-sync
const sync_options = {
  force:    false,
  logging:  true,
  alter:    true,
};

Object.keys(models).forEach((model_name) => {
  let model_class = models[model_name];
  if (model_class.sync) {
    model_sync_promises.push(
      model_class.sync(sync_options)
        .then(() => {
          console.log('Completed synchronizing ' + model_name);
        })
        .catch(err => {
          throw err;
        })
    );
  }
});

// Wait until all sync promises resolve then exit
Promise.all(model_sync_promises)
  .then(() => sessionStore.sync())  // create/syncs the session db tables
  .then(() => sequelize.close())
  .then(() => {
    console.log('Models synchronization completed');
    process.exit(0);
  });

