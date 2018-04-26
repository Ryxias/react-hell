'use strict';

module.exports = {
  'app.config': {
    // Configuration manager
    constructor: require('../../lib/Configuration/ConfigurationManager'),
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
    constructor: require('../../server/controllers/HelloWorldController'),
    tags: [ 'controller' ],
  },
  'app.controllers.gossip_api': {
    constructor: require('../../server/controllers/GossipApiController'),
    tags: [ 'controller' ],
  },
  'app.controllers.debug': {
    constructor: require('../../server/controllers/DebugController'),
    tags: [ 'controller' ],
  },
  'app.controllers.sif_api': {
    constructor: require('../../server/controllers/SifApiController'),
    tags: [ 'controller' ],
  },
  'app.controllers.react': {
    constructor: require('../../server/controllers/ReactController'),
    tags: [ 'controller' ],
  },
  'app.controllers.auth': {
    constructor: require('../../server/controllers/AuthenticationApiController'),
    tags: [ 'controller' ],
  },
};
