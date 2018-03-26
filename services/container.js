'use strict';

//
const { ServiceContainer } = require('service-container');
require('express-route-registry').useContainer(require('service-container'));

const service_container = new ServiceContainer();

require('./config/services')(service_container);

// Freezing the container prevents downstream code from registering new services or modifying the container.
service_container.freeze();

// Compiling the container will materialize all of the service dependencies. This can be used to detect cycles
// as it will PROBABLY crash if there's a cycle or improperly generated dependency.
//
// Compiling the service container is slower and require more memory on startup but can detect for container
// configuration problems early on before the application loads.
service_container.compile();

module.exports = service_container;
