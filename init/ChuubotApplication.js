'use strict';

/**
 * This class is intended to encapsulate all of the configuration and whatever
 * needed to boot and run chuubot, standalone from the rest of the website.
 */
class ChuubotApplication extends require('./BaseApplication') {

  appBoot() {
    // Setup middleware
    const chuubot = require('../init/chuubot')(this.getConfig());

    chuubot.connect();
  }
}

module.exports = ChuubotApplication;
