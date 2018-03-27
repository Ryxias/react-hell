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
      },
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
    '/': {
      get: [ 'app.controllers.react', 'index_action' ]
    },
    '/*': {
      get: [ 'app.controllers.react', 'redirect_back_to_index_action' ]
    },
  });

  return registry;
};
