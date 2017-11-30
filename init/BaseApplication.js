/**
 * Defines the framework of an application that runs without any intelligent ability
 * to accept I/O.  Interactions are defined by extending this application class.
 *
 * Subclasses are responsible for appending any additional forms of configuration or
 * require packages by overriding the `appPackages` and `appBoot` methods.
 */
class BaseApplication {
  constructor(config = {}) {
    this.config = config;
    this.packages = [];
  }

  /**
   * Override me!
   */
  appPackages() {
    return [];
  }

  /**
   * Override me!
   */
  appBoot() {
    return true;
  }

  getConfig() {
    return this.config;
  }

  getSequelizeConnection() {
    return this.sequelize;
  }

  getSequelizeModels() {
    return this.sequelize_models;
  }

  getSession() {
    return this.session;
  }

  getSessionStore() {
    return this.sessionStore;
  }

  getSessionConfig() {
    return this.sessionConfig;
  }

  warmPackage(package_name) {
    this.packages[package_name] = require(package_name);
  }

  loadPackage(package_name) {
    if (!this.packages[package_name]) {
      console.log('Warning: Package loaded at runtime: ' + package_name);
      this.warmPackage(package_name);
    }
    return this.packages[package_name];
  }

  boot() {
    // Step 1, warming up the package cache
    //   Performs up-front warms up of the package cache to ensure the entire application can compile
    //   and is not missing any requirements;  Prevents metastable website where only certain control
    //   paths will fail.
    //
    //   Loading packages should be done through this.loadPackage() instead of require.
    [
      ...this.appPackages(),
      'bluebird',
      'fs',
      'http',
      'path',
    ].forEach((package_name) => {
      this.warmPackage(package_name);
    });

    // Step 1.5, set up some relatively safe globals
    global.PROJECT_ROOT = this.loadPackage('fs').realpathSync(__dirname + '/..');
    global.Promise = this.loadPackage('bluebird');

    // Load configurations
    this.config = require(PROJECT_ROOT + '/configuration_loader');
    this.sequelize = require(PROJECT_ROOT + '/init/sequelize')(this.getConfig().db);
    this.sequelize_models = require(PROJECT_ROOT + '/init/load_models')(this.getSequelizeConnection());
    this.session = require('express-session');
    this.sessionStore = new (require('connect-session-sequelize')(this.getSession().Store))({
      db: this.getSequelizeConnection(),
    });
    this.sessionConfig = {
      name: 'chuuni.me',
      // proxy: true,  // Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
      resave: false,  // Forces the session to be saved back to the session store if set to 'true', even if the session was never modified during the request.
      // rolling: true,  // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown.
      saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store if set to 'true'.
      secret: this.getConfig().secret,
      store: this.getSessionStore(),
      cookie: {
        // expires: null,  // this will automatically be set via maxAge
        // httpOnly: production,  // Allows the use of Document.cookie in development mode, protects against Cross-Site Scripting (XSS) attacks
        maxAge: 300000,  // 5 minutes (in milliseconds)
        // path: '/',  // Designates a path that should exist in the requested source when sending the cookie header
        // secure: production,  // Does not necessarily encrypt cookie data as cookies are inherently insecure, see MDN documentation
        // sameSite: 'strict', // Protection against Cross-Site Request Forgery attacks if set to 'strict'
      },
    };

    // Do Application-specific custom boots
    this.appBoot();
  }
}

module.exports = BaseApplication;
