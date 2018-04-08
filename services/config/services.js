'use strict';

module.exports = service_container => {
  // Global Application config, maybe move into AppKernel??
  const bcrypt = require('bcryptjs');
  Promise.promisifyAll(bcrypt);

  //
  service_container.set('service_container', service_container);
  service_container.alias('ServiceContainer', 'service_container');

  // Configuration manager
  service_container.registerFactory('app.config', service_container => {
    const ConfigurationManager = require('../../lib/Configuration/ConfigurationManager');
    return new ConfigurationManager(require('../../configuration_loader'));
  });
  service_container.alias('ConfigurationManager', 'app.config');

  service_container.autowire('sif.client', require('../../lib/SchoolIdo.lu/Client'));

  // Routes
  service_container.registerFactory('app.route_registry', require('../../server/routing/routing'));
  service_container.alias('RouteRegistry', 'app.route_registry');

  // Model Stores
  {
    // FIXME (derek) in the future, we can automate this registration by scanning the /lib/ModelStores/ directory,
    // and registering them by classname.

    service_container.autowire('UserStore', require('../../lib/ModelStores/UserStore'));
    service_container.autowire('GossipStore', require('../../lib/ModelStores/GossipStore'));
    service_container.autowire('SlackUserStore', require('../../lib/ModelStores/SlackUserStore'));
  }


  // Controllers
  {
    const { ControllerCompilerPass } = require('express-route-registry');

    service_container.autowire('app.controllers.helloworld', require('../../server/controllers/HelloWorldController')).addTag('controller');
    service_container.autowire('app.controllers.gossip_api', require('../../server/controllers/GossipApiController')).addTag('controller');
    service_container.autowire('app.controllers.debug', require('../../server/controllers/DebugController')).addTag('controller');
    service_container.autowire('app.controllers.sif_api', require('../../server/controllers/SifApiController')).addTag('controller');
    service_container.autowire('app.controllers.react', require('../../server/controllers/ReactController')).addTag('controller');
    service_container.autowire('app.controllers.auth', require('../../server/controllers/AuthenticationApiController')).addTag('controller');
    service_container.addCompilerPass(new ControllerCompilerPass());
  }
};
