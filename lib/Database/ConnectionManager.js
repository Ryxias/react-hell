'use strict';

const Sequelize = require('sequelize');
const Filesystem = require('fs');
const MODELS_DIRECTORY = __dirname + '/../../model/';

/**
 * An abstraction layer that sits on top of Sequelize.
 */
class ConnectionManager {

  constructor(mysql_config, is_production = true) {
    this.mysql_config = mysql_config;
    this.sequelize_connection = null;
    this.models = {};
    this.is_production = is_production;
  }

  authenticate() {
    return this.sequelize_connection.authenticate();
  }

  connect() {
    this.sequelize_connection = new Sequelize(
      this.mysql_config.db,
      this.mysql_config.user,
      this.mysql_config.password,
      {
        host: this.mysql_config.host,
        dialect: 'mysql',
        dialectOptions: {
          charset: 'utf8mb4',
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        logging: false,
        //logging:true,
        //logging:console.log,
      }
    );

    this.loadModels();
  }

  loadModels() {
    const model_files = [];
    Filesystem.readdirSync(MODELS_DIRECTORY).filter(filename => filename.match(/^[A-Z][a-zA-Z0-9]+\.js$/))
      .forEach(filename => {
        model_files.push(filename);
      });

    model_files.forEach(filename => {
      const model_name = filename.substring(0, filename.length - 3); // chop off .js
      const model_path = MODELS_DIRECTORY + model_name;
      this.models[model_name] = this.sequelize_connection.import(model_path);
    });
  }

  /**
   * Runs appropriate CREATE TABLE statements to initialize the database
   */
  createDatabaseIfNotExists() {
    // if (this.is_production) {
    //   throw new Error('This operation is not allowed on production');
    // }

    const connection = new Sequelize(
      '', // Leave blank so we don't attempt to connect to it
      this.mysql_config.user,
      this.mysql_config.password,
      {
        host: this.mysql_config.host,
        dialect: 'mysql',
        //operatorsAliases: Sequelize.Op,
        dialectOptions: {
          charset: 'utf8mb4',
        },
        pool: {
          max: 5,
          min: 0,
          idle: 10000,
        },
        logging: false,
      }
    );
    return connection.query(`CREATE DATABASE IF NOT EXISTS \`${this.mysql_config.db}\``);
  }


  /**
   * Synchronizes the database schema with the currently registered model definitions.
   * Sync'ing has CERTAIN LIMITATIONS, so be wary when using this method.
   *
   * Returns a promise to sync all models.  The promise returns nothing when resolved.
   *
   * For more information: http://docs.sequelizejs.com/class/lib/sequelize.js~Sequelize.html#instance-method-sync
   */
  sync(force = false) {
    // if (this.is_production) {
    //   return Promise.reject(new Error('This operation is not allowed on production'));
    // }

    const sync_options = {
      force:    force, // Pass true and it will drop tables and rebuild from scratch
      logging:  true,
      alter:    true,
    };

    const sync_queue = [];
    Object.keys(this.models).forEach(model_name => {
      const model = this.get(model_name);
      console.log(` ----- `);
      console.log(`Synchronizing Model ${model_name}...`);
      sync_queue.push(
        model.sync(sync_options).then(() => console.log(` > Done`))
      );
    });
    return Promise.all(sync_queue);
  }


  /**
   * http://docs.sequelizejs.com/manual/tutorial/transactions.html
   *
   * Opens an ACID transaction and returns it.
   * The callback must accept 1 argument--the instance of the opened database transaction.
   *
   * In order to invoke queries inside of transactions, you must provide it as an option: e.g.
   *
   *   Model.create({ .. }, {transaction: t})
   *
   * To rollback the entire transaction, throw an exception to reject the chain. Do not manually rollback.
   *
   * @param callback
   * @returns Sequelize transaction object
   */
  transaction(callback) {
    return this.sequelize_connection.transaction(callback);
  }

  /**
   * Shuts down all connections.  This ConnectionManager will no longer function until connect() is called again.
   */
  closeConnections() {
    this.models = {};
    if (this.sequelize_connection) {
      this.sequelize_connection.close();
      this.sequelize_connection = undefined;
    }
  }

  /**
   * Returns a connection
   */
  get(model) {
    if (!(model in this.models)) {
      throw new Error(`No such model: ${model}. Valid models were ${Object.keys(this.models)}`);
    }
    return this.models[model];
  }

}

module.exports = ConnectionManager;
