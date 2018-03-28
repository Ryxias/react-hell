'use strict';

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

    // Boot the service container!
    switch (this.environment) {
      case 'react':
        this.service_container = require('../client/services/react_container');
        break;
      case 'production':
      case 'test':
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
