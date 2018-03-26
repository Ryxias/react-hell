'use strict';

module.exports = service_container => {
  const path = require('path');

  // Express specific stuff
  // check environment
  const production = process.env.NODE_ENV === 'production';

// include packages
  const express = require('express');

// Setup middleware
  const {redirectHttpToHttps} = require('../../init/custom_app_redirects');
  const {notFoundHandler, defaultErrorHandler} = require('../../init/error_handlers');
  const staticsMiddleware = express.static(path.resolve(__dirname + '/../../public')); // Express to serve static files easily without nginx
  const appRouter = require('../../server/routes');
  const bodyParser = require('body-parser');

  // Initialize the express app
  const app = express();

  // Attach middleware
  if (production) {
    app.use(redirectHttpToHttps);
  }

  const session = service_container.get('express.session');
  const sessionConfig = service_container.get('express.session_config');

  app.use(session(sessionConfig));
  app.use(function (req, res, next) {
    req.session.views = req.session.views + 1 || 1;
    req.session.save();
    next();
  });
  app.use('/statics', staticsMiddleware);
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
};
