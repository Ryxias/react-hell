'use strict';

const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk').default;
const { createLogger } = require('redux-logger');
const rootReducer = require('../reducers/reducers');

function configureStore(preloadedState, forceSkipLogging = false) {
  let middleware = [ thunkMiddleware ];

  if (!forceSkipLogging) {
    const loggerMiddleware = createLogger({
      predicate: (getState, action) => true
    });
    middleware = [ ...middleware, loggerMiddleware ];
  }

  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(...middleware)
  )
}

module.exports = configureStore;
