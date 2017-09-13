
// Setup Globals
const app_config = require('../configuration_loader');
global.PROJECT_ROOT = __dirname + '/..';
global.Promise = require('bluebird'); // Replace native promise with bluebird because it's better

const sequelize = require(PROJECT_ROOT + '/init/sequelize')(app_config.db);
const models = require(PROJECT_ROOT + '/init/load_models')(sequelize);

const model_synch_promises = [];

// http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-sync
const sync_options = {
  force:    false,
  logging:  true,
  alter:    true,
};

Object.keys(models).forEach((model_name) => {
  let model_class = models[model_name];
  if (model_class.sync) {
    model_synch_promises.push(
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

console.log('Models synchronization queued...');

