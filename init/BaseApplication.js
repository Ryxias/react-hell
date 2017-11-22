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

    // Convenient global method for debugging
    global.pp = function(thing) {
      console.log(require('util').inspect(thing, false, null));
    };

    // Load configurations
    this.config = require(PROJECT_ROOT + '/configuration_loader');
    this.sequelize = require(PROJECT_ROOT + '/init/sequelize')(this.getConfig().db);
    this.sequelize_models = require(PROJECT_ROOT + '/init/load_models')(this.getSequelizeConnection());

    // Do Application-specific custom boots
    this.appBoot();
  }
}

module.exports = BaseApplication;
