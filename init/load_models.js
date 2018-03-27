'use strict';

//
// Scans through the model/ directory and reads all files, loading them to the global
// symbol table for convenient use.  Returns a JS object mapping the model class names
// to references to the class prototypes.
//

const fs = require('fs');
const loadModels = function loadModels(sequelize) {
  let models = {};
  fs.readdirSync(__dirname + '/../model')
    .filter(filename => filename.match(/^[A-Z][a-zA-Z0-9]+\.js$/))
    .map(filename => filename.substring(0, filename.length - 3))
    .forEach(model => {
      models[model] = require('../model/' + model)(sequelize); // TODO Replace with sequelize.import later...
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
