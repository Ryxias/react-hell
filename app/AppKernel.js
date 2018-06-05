'use strict';

/**
 * This specifically pertains to the NodeJS/ECMAScript6-compatible application.
 *
 * We specifically split the ReactKernel out of this because otherwise Webpack may decide to bundle
 * up the entire backend Express application which... we don't want.
 */
class AppKernel {
  constructor(environment) {
    this.environment = environment;
  }

  boot() {
    global.Promise = require('bluebird');
    // Convenient global method for debugging
    global.pp = function(thing) {
      console.log(require('util').inspect(thing, false, null));
    };

    Promise.promisifyAll(require('bcryptjs'));

    if (!this.environment) {
      throw new Error('What environment are you on? Use `export NODE_ENV=xxx`!');
    }

    // Boot the service container!
    switch (this.environment) {
      case 'local':
      case 'production':
        this.service_container = require('../services/container');
        break;
      default:
        throw new Error(`Unrecognized environment: ${this.environment}.`);
    }
  }

  getContainer() {
    return this.service_container;
  }

  shutdown() {
    this.service_container = null;
  }
}

module.exports = AppKernel;
