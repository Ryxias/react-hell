'use strict';

const { describe, beforeAll, afterEach } = require('jest');

module.exports = function() {
  return Promise.resolve()
    .then(() => {
      const app_kernel = require('./init');

      // https://medium.com/airbnb-engineering/unlocking-test-performance-migrating-from-mocha-to-jest-2796c508ec50
      // Jest does not provide before() or after() like in Mocha. Instead, we polyfill it
      // it like this.
      // global.context = describe;
      // global.before = beforeAll;
      // global.after = afterEach;
    });
};

