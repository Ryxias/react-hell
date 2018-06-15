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
  BangDreamClient: require('../../lib/BangDream/Client'),

  UserStore: require('../../lib/ModelStores/UserStore'),
  GossipStore: require('../../lib/ModelStores/GossipStore'),
  SlackUserStore: require('../../lib/ModelStores/SlackUserStore'),
  TokenStore: require('../../lib/ModelStores/TokenStore'),
  HangmanGameStore: require('../../lib/ModelStores/HangmanGameStore'),
  MazeGameStore: require('../../lib/ModelStores/MazeGameStore'),

  // Controllers

  HelloWorldController: {
    class: require('../../server/controllers/HelloWorldController'),
    tags: [ 'controller' ],
  },
  GossipApiController: {
    class: require('../../server/controllers/GossipApiController'),
    tags: [ 'controller' ],
  },
  DebugController: {
    class: require('../../server/controllers/DebugController'),
    tags: [ 'controller' ],
  },
  SifApiController: {
    class: require('../../server/controllers/SifApiController'),
    tags: [ 'controller' ],
  },
  ReactController: {
    class: require('../../server/controllers/ReactController'),
    tags: [ 'controller' ],
  },
  AuthenticationApiController: {
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

  HangmanService: require('../../lib/Hangman/HangmanService'),
  MazeGameService: require('../../lib/Maze/MazeGameService'),

  MazeRoomGenerator: require('../../lib/Maze/MazeRoomGenerator'),
};
