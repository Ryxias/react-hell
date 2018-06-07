'use strict';

module.exports = {
  'app.config': {
    // Configuration manager
    class: require('../../lib/Configuration/ConfigurationManager'),
    autowire: false,
    args: [
      '@app.configuration_loader',
    ]
  },
  ConfigurationManager: '@app.config',

  'sif.client': require('../../lib/SchoolIdo.lu/Client'),

  // Controllers

  'app.controllers.helloworld': {
    class: require('../../server/controllers/HelloWorldController'),
    tags: [ 'controller' ],
  },
  'app.controllers.gossip_api': {
    class: require('../../server/controllers/GossipApiController'),
    tags: [ 'controller' ],
  },
  'app.controllers.debug': {
    class: require('../../server/controllers/DebugController'),
    tags: [ 'controller' ],
  },
  'app.controllers.sif_api': {
    class: require('../../server/controllers/SifApiController'),
    tags: [ 'controller' ],
  },
  'app.controllers.react': {
    class: require('../../server/controllers/ReactController'),
    tags: [ 'controller' ],
  },

  // Config stuff
  'app.configuration_loader': {
    factory: require('../../configuration_loader'),
  },
  RouteRegistry: '@app.route_registry',
};
