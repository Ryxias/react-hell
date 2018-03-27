'use strict';

module.exports = service_container => {
  const path = require('path');

  // Express specific stuff
  // check environment
  const production = process.env.NODE_ENV === 'production';

// include packages
  const express = require('express');


  // Config stuff
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

  service_container.registerFactory('express.session_middleware', service_container => {
    const session = service_container.get('express.session');
    const sessionConfig = service_container.get('express.session_config');

    return session(sessionConfig);
  });

  service_container.registerFactory('express.server', service_container => {
    // Setup middleware
    const { redirectHttpToHttps } = require('../../init/custom_app_redirects');
    const { notFoundHandler, defaultErrorHandler } = require('../../init/error_handlers');
    const staticsMiddleware = express.static(path.resolve(__dirname + '/../../public')); // Express to serve static files easily without nginx
    const bodyParser = require('body-parser');

    // Initialize the express app
    const app = express();

    // Attach middleware
    if (production) {
      app.use(redirectHttpToHttps);
    }

    app.use(service_container.get('express.session_middleware'));
    app.use(function (req, res, next) {
      req.session.views = req.session.views + 1 || 1;
      req.session.save();
      next();
    });
    app.use('/statics', staticsMiddleware);

    const appRouter = require('express').Router();
    service_container.get('app.route_registry').registerAll(appRouter);
    app.use(appRouter);

    app.use(bodyParser);
    app.use(notFoundHandler);
    app.use(defaultErrorHandler);

    app.use('/test', (req, res, next) => res.send('omfg why'));

    const start = () => {
      const port = production ? 80 : service_container.get('ConfigurationManager').getValue('port');

      // We only listen to port 80
      //   On AWS, the application is fronted by a load balancer which terminates all inbound connections
      //   and forwards them to the webservers on port 80.
      require('http').createServer(app).listen(port, () => {
        console.log('AppKernel: Express server started, listening on port ' + port + '...');
      });
    };

    return {
      start,
    };
  });
};
