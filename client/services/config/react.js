'use strict';

//
//
//
module.exports = service_container => {
  service_container.registerFactory('redux.configure_store', service_container => {
    return require('../../lib/configureStore');
  });

  service_container.registerFactory('redux.store', service_container => {
    return service_container.get('redux.configure_store')(
      {}, // pre loaded state
      true // skip logging
    );
  });
};
