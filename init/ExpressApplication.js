'use strict';

/**
 * This class is intended to encapsulate all of the steps and side effects of booting and running
 * CSPA as an express app intended to run in a loop and keep the website alive.
 */
class ExpressApplication extends require('./BaseApplication') {

  appPackages() {
    // Packages that are express-only
    return [
      'express'
    ];
  }

  appBoot() {
    // check environment
    const production = process.env.NODE_ENV === 'production';

    // include packages
    const express = this.loadPackage('express');

    // Setup middleware
    const { redirectHttpToHttps } = require(PROJECT_ROOT + '/init/custom_app_redirects');
    const { notFoundHandler, defaultErrorHandler } = require(PROJECT_ROOT + '/init/error_handlers');
    const staticsMiddleware = express.static(PROJECT_ROOT + '/public'); // Express to serve static files easily without nginx
    const appRouter = require(PROJECT_ROOT + '/server/routes');
    const bodyParser = require('body-parser');
    const session = require('express-session');
    const SequelizeStore = require('connect-session-sequelize')(session.Store);
    const sessionStore = new SequelizeStore({
      db: this.sequelize,
    });
    const secret = this.config.secret;
    // const productionOnly = production;

    // Initialize the express app
    const app = express();

    const sessionSettings = {
      name: 'chuuni.me',
      // proxy: true,  // Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
      resave: false,  // Forces the session to be saved back to the session store if set to 'true', even if the session was never modified during the request.
      // rolling: true,  // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
      saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store if set to 'true'.
      secret: secret,
      store: sessionStore,
      cookie: {
        // expires: null,  // this will automatically be set via maxAge
        // httpOnly: productionOnly,  // Allows the use of Document.cookie in development mode, protects against Cross-Site Scripting (XSS) attacks
        maxAge: 300000,  // 5 minutes (in milliseconds)
        // path: '/',  // Designates a path that should exist in the requested source when sending the cookie header
        // secure: productionOnly,  // Does not necessarily encrypt cookie data as cookies are inherently insecure, see MDN documentation
        // sameSite: 'strict', // Protection against Cross-Site Request Forgery attacks if set to 'strict'
      },
    };

    // Attach middleware
    if (production) {
      app.use(redirectHttpToHttps);
    }
    app.use(session(sessionSettings));
    app.use(function(req, res, next) {
      req.session.username = 'david';
      req.session.save();
      console.log('Session value set to:', req.session.username);
      console.log('Session id:', req.sessionID);
      next();
    });
    app.use('/statics', staticsMiddleware);
    app.use(appRouter);
    app.use(bodyParser);
    app.use(notFoundHandler);
    app.use(defaultErrorHandler);

    // create/syncs the session db tables
    sessionStore.sync();

    const runServer = () => {
      const port = production ? 80 : this.config.port;

      // We only listen to port 80
      //   On AWS, the application is fronted by a load balancer which terminates all inbound connections
      //   and forwards them to the webservers on port 80.
      this.loadPackage('http').createServer(app).listen(port, () => {
        console.log('Server started, listening on port ' + port + '...');
      });
    };

    runServer();
  }
}

module.exports = ExpressApplication;
