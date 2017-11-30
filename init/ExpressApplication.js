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

    // Initialize the express app
    const app = express();

    // Attach middleware
    if (production) {
      app.use(redirectHttpToHttps);
    }
    app.use(this.getSession()(this.getSessionConfig()));
    app.use(function(req, res, next) {
      req.session.views = req.session.views + 1 || 1;
      req.session.save();
      next();
    });
    app.use('/statics', staticsMiddleware);
    app.use(appRouter);
    app.use(bodyParser);
    app.use(notFoundHandler);
    app.use(defaultErrorHandler);

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
