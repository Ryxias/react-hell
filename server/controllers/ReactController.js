'use strict';

const { Controller } = require('express-route-registry');

class ReactController extends Controller {
  index_action(req, res, next) {
    const path = require('path');
    const file = path.resolve(__dirname + `/../../public/index.html`);

    return res.status(200).sendFile(file);
  }

  redirect_back_to_index_action(req, res, next) {
    res.redirect('/');
  }
}
module.exports = ReactController;
