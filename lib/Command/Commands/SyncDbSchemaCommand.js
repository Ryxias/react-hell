'use strict';

const Command = require('../Framework/Command');

/**
 * Will best-effort attempt to synchronize your Mysql schema with the Sequelize models defined in the model/
 * directory.
 *
 * Generally, this works with a couple of exceptions; Adding new columns does not work elegantly (you will need
 * manually run migration scripts for that). Adding new tables and add indices is handled.
 *
 * If you don't care about the data on the environment, you can --force it.
 *
 *
 * Options:
 *
 *  --force
 *      When this option is provided, it will DROP YOUR TABLES AND REBUILD THEM. YOU WILL LOSE ALL OF YOUR DATA.
 *
 *      YOU HAVE BEEN WARNED.
 */
class SyncDbSchemaCommand extends Command {

  isEnabled() {
    const environment = this.getContainer().get('ConfigurationManager').get('NODE_ENV');

    return ['local', 'test'].includes(environment);
  }

  execute(input, output) {
    const ConnectionManager = this.getContainer().get('ConnectionManager');
    const SessionStore = this.getContainer().get('express.session_store');

    const force = input.hasOpt('force');

    if (force && this.getContainer().get('EnvironmentManager').isDev()) {
      throw new Error(`You probably don't want to --force this on dev.`);
    }

    // Wait until all sync promises resolve then exit
    output.writeln('Synchronizing models...');
    return ConnectionManager.createDatabaseIfNotExists()
      // create Sessions table
      .then(() => SessionStore.sync())
      // This step may fail because the models are sync'd in the wrong order (Foreign key problems)
      // Simply re-run the whole operation and it should work
      .then(() => ConnectionManager.sync(force))
      // Close connections
      .then(() => ConnectionManager.closeConnections())
      .then(() => output.writeln('Models synchronization completed'));
  }

}
module.exports = SyncDbSchemaCommand;
