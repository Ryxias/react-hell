'use strict';

// Database connection
//
// Exports "ConnectionManager" and "ModelValidator"

module.exports = service_container => {
  const ConnectionManager = require('../../lib/Database/ConnectionManager');
  service_container.registerFactory('database.connection_manager', service_container => {

    const configuration_manager = service_container.get('app.config');

    const mysql_configuration = configuration_manager.get('db');

    const connection_manager = new ConnectionManager(
      mysql_configuration,
      true
    );
    connection_manager.connect();

    // FIXME where do I put this?
    // load associations
    const SlackUser = connection_manager.get('SlackUser');
    const User = connection_manager.get('User');
    SlackUser.belongsTo(User, {foreignKey: 'user_id'}); // Adds user_id fk to SlackUser

    return connection_manager;
  });
  service_container.alias('ConnectionManager', 'database.connection_manager');

  service_container.autowire('database.model_validator', require('../../lib/Database/ModelValidator'));
  service_container.alias('ModelValidator', 'database.model_validator');

};

