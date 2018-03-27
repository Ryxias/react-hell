'use strict';

const ConnectionManager = require('../../lib/Database/ConnectionManager');


module.exports = service_container => {
  // Database connection
  service_container.registerFactory('database.connection_manager', service_container => {

    const configuration_manager = service_container.get('app.config');

    const mysql_configuration = configuration_manager.get('db');

    const connection_manager = new ConnectionManager(
      mysql_configuration,
      true
    );
    connection_manager.connect();

    return connection_manager;
  });
  service_container.alias('ConnectionManager', 'database.connection_manager');

  service_container.autowire('database.model_validator', require('../../lib/Database/ModelValidator'));
  service_container.alias('ModelValidator', 'database.model_validator');

};

