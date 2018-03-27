'use strict';

module.exports = service_container => {

  service_container.set('service_container', service_container);
  service_container.alias('ServiceContainer', 'service_container');

  // Configuration manager
  service_container.registerFactory('app.config', service_container => {
    const ConfigurationManager = require('../..//lib/Configuration/ConfigurationManager');
    return new ConfigurationManager(require('../../configuration_loader'));
  });
  service_container.alias('ConfigurationManager', 'app.config');

  // Database connection
  service_container.registerFactory('database.connection_manager', require('./database_connection'));
  service_container.alias('ConnectionManager', 'database.connection_manager');

  require('./express')(service_container);

  service_container.registerFactory('chuubot', require('../../init/chuubot'));


  service_container.autowire('database.model_validator', require('../../lib/Database/ModelValidator'));
  service_container.alias('ModelValidator', 'database.model_validator');

  // Model Stores
  {
    // FIXME (derek) in the future, we can automate this registration by scanning the /lib/ModelStores/ directory,
    // and registering them by classname.

    service_container.autowire('GenericGameStateStore', require('../../lib/ModelStores/GenericGameStateStore'));
  }


  // Controllers
  {
    const { ControllerCompilerPass } = require('express-route-registry');

    service_container.autowire('app.controllers.debug', require('../../server/controllers/DebugController')).addTag('controller');
    service_container.addCompilerPass(new ControllerCompilerPass());
  }
};
