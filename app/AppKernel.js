'use strict';

class AppKernel {
  constructor(environment) {

  }

  boot() {
    global.Promise = this.loadPackage('bluebird');
    // Convenient global method for debugging
    global.pp = function(thing) {
      console.log(require('util').inspect(thing, false, null));
    };

    // Boot the service container!
    this.service_container = require('../services/container');

    this.service_container.get('express.server').start(); // Runs the server
  }


}

module.exports = AppKernel;
