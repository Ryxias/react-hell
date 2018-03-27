'use strict';

module.exports = service_container => {

  service_container.set('service_container', service_container);
  service_container.alias('ServiceContainer', 'service_container');

  // Configuration manager
  service_container.registerFactory('app.config', service_container => {
    const ConfigurationManager = require('../..//lib/Configuration/ConfigurationManager');
    return new ConfigurationManager(require('../../configuration_loader'));
  });
  service_container.alias('ConfigurationManager', 'app.config');

  // Database connection
  service_container.registerFactory('database.connection_manager', require('./database_connection'));
  service_container.alias('ConnectionManager', 'database.connection_manager');


  // This should probably be on express
  service_container.set('express.session', require('express-session'));
  service_container.registerFactory('express.session_store', service_container => {
    const ExpressSession = service_container.get('express.session');
    const connectSessionSequelize = require('connect-session-sequelize');

    const SessionConnect = connectSessionSequelize(ExpressSession.Store);

    return new SessionConnect({
      db: service_container.get('ConnectionManager').sequelize_connection,
    });
  });
  service_container.registerFactory('express.session_config', service_container => {
    return {
      name: 'chuuni.me',
      // proxy: true,  // Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
      resave: false,  // Forces the session to be saved back to the session store if set to 'true', even if the session was never modified during the request.
      // rolling: true,  // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
      saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store if set to 'true'.
      secret: service_container.get('ConfigurationManager').getValue('secret'),
      store: service_container.get('express.session_store'),
      cookie: {
        // expires: null,  // this will automatically be set via maxAge
        // httpOnly: production,  // Allows the use of Document.cookie in development mode, protects against Cross-Site Scripting (XSS) attacks
        maxAge: 300000,  // 5 minutes (in milliseconds)
        // path: '/',  // Designates a path that should exist in the requested source when sending the cookie header
        // secure: production,  // Does not necessarily encrypt cookie data as cookies are inherently insecure, see MDN documentation
        // sameSite: 'strict', // Protection against Cross-Site Request Forgery attacks if set to 'strict'
      }
    };
  });

  service_container.registerFactory('express.server', require('./express'));

  service_container.registerFactory('chuubot', require('../../init/chuubot'));


  service_container.autowire('database.model_validator', require('../../lib/Database/ModelValidator'));
  service_container.alias('ModelValidator', 'database.model_validator');

  // Model Stores
  {
    // FIXME (derek) in the future, we can automate this registration by scanning the /lib/ModelStores/ directory,
    // and registering them by classname.

    service_container.autowire('GenericGameStateStore', require('../../lib/ModelStores/GenericGameStateStore'));
  }


  // Controllers
  {
    const { ControllerCompilerPass } = require('express-route-registry');

    service_container.autowire('app.controllers.debug', require('../../server/controllers/DebugController')).addTag('controller');
    service_container.addCompilerPass(new ControllerCompilerPass());
  }
};
