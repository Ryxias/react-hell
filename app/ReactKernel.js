'use strict';

class ReactKernel {
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
    this.service_container = require('../client/services/react_container');
  }


  getContainer() {
    return this.service_container;
  }

  shutdown() {
    this.service_container = null;
  }

}

module.exports = ReactKernel;
