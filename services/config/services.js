'use strict';

module.exports = service_container => {
  // Config stuff
  service_container.set('app.configuration_loader', require('../../configuration_loader'));

  // Routes
  service_container.registerFactory('app.route_registry', require('../../server/routing/routing'));
  service_container.alias('RouteRegistry', 'app.route_registry');
};
