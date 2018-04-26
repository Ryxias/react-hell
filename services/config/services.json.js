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

  UserStore: require('../../lib/ModelStores/UserStore'),
  GossipStore: require('../../lib/ModelStores/GossipStore'),
  SlackUserStore: require('../../lib/ModelStores/SlackUserStore'),
  TokenStore: require('../../lib/ModelStores/TokenStore'),

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
  'app.controllers.auth': {
    class: require('../../server/controllers/AuthenticationApiController'),
    tags: [ 'controller' ],
  },

  // Config stuff
  'app.configuration_loader': {
    factory: require('../../configuration_loader'),
  },

  // Routes
  'app.route_registry': {
    factory: require('../../server/routing/routing')
  },
  RouteRegistry: '@app.route_registry',
};
