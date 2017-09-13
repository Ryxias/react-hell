'use strict';

const fs = require('fs');

// Load all models.  Filename must be camelcase and must end with ".js"
const loadModels = function loadModels(sequelize) {
  let models = {};
  fs.readdirSync(PROJECT_ROOT + '/model')
    .filter(filename => filename.match(/^[A-Z][a-zA-Z0-9]+\.js$/))
    .map(filename => filename.substring(0, filename.length - 3))
    .forEach(model => {
      models[model] = require(PROJECT_ROOT + '/model/' + model)(sequelize); // TODO Replace with sequelize.import later...
    });
  return models;
};

module.exports = sequelize => {
  let models = loadModels(sequelize);

  // Globally export all of the models
  Object.keys(models).forEach(model_name => {
    let model_class = models[model_name];
    global[model_name] = model_class;
  });

  return models;
};
