'use strict';

//
// Route index
//   The global route configuration file
//
module.exports = service_container => {

  // Route Registry
  // FIXME Eventually move this file to a compiler pass?
  const { RouteRegistry } = require('express-route-registry');
  const registry = new RouteRegistry();
  registry.setContainer(service_container);

  // Middleware
  const apiRequiresLoggedIn = service_container.get('express.api_requires_logged_in_middleware');
  const gossipApiParameterConverter = service_container.get('express.gossip_api_parameter_converter');
  const requiresGossipMiddleware = service_container.get('express.requires_gossip_middleware');

  // Routes
  registry.routeBuilder({
    '/api': {
      '/sif/': {
        '/roll': {
          get: {
            name: 'sif_api_roll',
            service_id: 'app.controllers.sif_api',
            action: 'get_roll_gacha_action',
          },
        },
        '/share': {
          middleware: [ apiRequiresLoggedIn ],
          post: {
            service_id: 'app.controllers.sif_api',
            action: 'share_roll_action',
          }
        },
      },
    },
  });

  registry.routeBuilder({
    '/api': {
      '/login': {
        post: [ 'app.controllers.auth', 'login_action' ]
      },
      '/logout': {
        middleware: [ apiRequiresLoggedIn ],
        post: [ 'app.controllers.auth', 'logout_action' ]
      },
      '/whoami': {
        get: [ 'app.controllers.auth', 'whoami_action' ]
      },
      '/register': {
        post: [ 'app.controllers.auth', 'register_action' ]
      },
      '/change_password': {
        middleware: [ apiRequiresLoggedIn ],
        post: [ 'app.controllers.auth', 'change_password_action' ]
      },
      '/slack_token': {
        middleware: [ apiRequiresLoggedIn ],
        post: [ 'app.controllers.auth', 'request_slack_connector_token_action' ]
      },
    }
  });

  registry.routeBuilder({
    '/api': {
      '/gossips': {
        middleware: [ apiRequiresLoggedIn ],
        get: [ 'app.controllers.gossip_api', 'index_action' ],
        '/:gossip_id(\\d+)': {
          param: [ 'gossip_id', gossipApiParameterConverter ],
          middleware: [ requiresGossipMiddleware ],
          get: [ 'app.controllers.gossip_api', 'get_single_gossip_action' ],
          patch: [ 'app.controllers.gossip_api', 'edit_single_gossip_action' ],
          delete: [ 'app.controllers.gossip_api', 'delete_single_gossip_action' ],
        }
      },
    },
  });

  registry.routeBuilder({
    '/api': {
      '/*': {
        get: (req, res, next) => {
          return res.status(404).send({ message: 'Bwuh? Where in the world am I??' });
        }
      }
    },
  });

  registry.routeBuilder({
    '/_debug/': { // hopefully hard to guess
      '/routes': {
        get: [ 'app.controllers.debug', 'get_all_routes_action' ],

        '/match': {
          get: [ 'app.controllers.debug', 'get_match_routes_action' ],
        }
      },
    },
  });

  registry.routeBuilder({
    '/helloworld': {
      get: [ 'app.controllers.helloworld', 'index_action' ],
    },
    '/health': {
      get: [ 'app.controllers.helloworld', 'health_check_action' ],
    }
  });

  registry.routeBuilder({
    '/*': {
      get: [ 'app.controllers.react', 'index_action' ]
    },
  });

  return registry;
};
