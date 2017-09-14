'use strict';

/**
 * This class is intended to encapsulate all of the steps and side effects of booting and running
 * CSPA as an express app intended to run in a loop and keep the website alive.
 */
class ExpressApplication extends require('./BaseApplication') {

  appPackages() {
    // Packages that are express-only
    return [
      'express',
      'express-handlebars',
    ];
  }

  appBoot() {
    // include packages
    const express = this.loadPackage('express');

    // Setup Globals
    global.PROJECT_ROOT = this.loadPackage('fs').realpathSync(__dirname + '/..');
    global.Promise = this.loadPackage('bluebird'); // Replace native promise with bluebird because it's better

    // Setup middleware
    const { redirectHttpToHttps } = require(PROJECT_ROOT + '/init/custom_app_redirects');
    const { notFoundHandler, defaultErrorHandler } = require(PROJECT_ROOT + '/init/error_handlers');
    const staticsMiddleware = express.static(PROJECT_ROOT + '/public'); // Express to serve static files easily without nginx
    const appRouter = require(PROJECT_ROOT + './routes');
    const chuubot = require(PROJECT_ROOT + '/init/chuubot')(this.getConfig());

    // Initialize the express app
    const app = express();

    // View Engine
    app.engine('handlebars', this.loadPackage('express-handlebars')({ defaultLayout: 'base' }));
    app.set('view engine', 'handlebars');

    // Attach middleware
    app.use(redirectHttpToHttps);
    app.use('/statics', staticsMiddleware);
    app.use(appRouter);
    app.use(notFoundHandler);
    app.use(defaultErrorHandler);

    // Connect chuubot
    chuubot.connect();

    const runServer = () => {
      const port = 80;

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
