'use strict';

//
// Synchronizes the database schema with the models that have been loaded
//   This is only intended to run on dev and will not work at all on production
//

const AppKernel = require('../../app/AppKernel');
const app_kernel = new AppKernel(process.env.NODE_ENV);
app_kernel.boot();

const SyncDbSchemaCommand = require('../../lib/Command/Commands/SyncDbSchemaCommand');
const command = new SyncDbSchemaCommand(app_kernel);

command.run();
