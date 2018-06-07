'use strict';

//
const { ServiceContainer, FactoryLoader, JsonLoader } = require('service-container');
require('express-route-registry').useContainer(require('service-container'));

const service_container = new ServiceContainer();

const factory_loader = new FactoryLoader(service_container);

factory_loader.load(require('./config/express'));
factory_loader.load(require('./config/slackbots'));

const json_loader = new JsonLoader(service_container);
json_loader.load(require('./config/services.json'));

const { ControllerCompilerPass } = require('express-route-registry');
service_container.addCompilerPass(new ControllerCompilerPass());

// Freezing the container prevents downstream code from registering new services or modifying the container.
service_container.freeze();

// Compiling the container will materialize all of the service dependencies. This can be used to detect cycles
// as it will PROBABLY crash if there's a cycle or improperly generated dependency.
//
// Compiling the service container is slower and require more memory on startup but can detect for container
// configuration problems early on before the application loads.
service_container.compile();

module.exports = service_container;
