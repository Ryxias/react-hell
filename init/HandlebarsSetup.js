'use strict';

//
// Sets up handlebars in the express app
//


module.exports = (app) => {
  app.set('views', __dirname + '/../views');
  app.engine('handlebars', require('express-handlebars')({
    //defaultLayout: 'base_layout',
  }));
  app.set('view engine', 'handlebars');

  return app;
};
