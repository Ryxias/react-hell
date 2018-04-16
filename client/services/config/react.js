'use strict';

import GossipApiClient from '../../lib/GossipApiClient';
import AuthApiClient from '../../lib/AuthApiClient';

//
//
//
module.exports = service_container => {
  service_container.registerFactory('redux.configure_store', service_container => {
    return require('../../lib/configureStore');
  });

  service_container.registerFactory('redux.store', service_container => {
    return service_container.get('redux.configure_store')(
      // This is the initial redux state
      {
        alert: {},
        auth: {},
        dice: {},
        gacha: {},
        gossip: {},
        getContainer: () => service_container,
      },
      false // true = skip logging, false = do logging
    );
  });

  service_container
    .register('gossip_api_client', GossipApiClient)
    .setArguments([ '' ]);

  service_container
    .register('auth_api_client', AuthApiClient)
    .setArguments([ '' ]);
};
