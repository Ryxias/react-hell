'use strict';

const Input = require('./Input');
const Output = require('./Output');

class Command {
  constructor(app_kernel) {
    if (new.target === Command) {
      throw new Error(`Don't instantiate Commands directly! You must extend this with a subclass before using it.`);
    }

    this._input = Input.fromCli();
    this._output = Output.console();
    this._app_kernel = app_kernel;
  }

  getName() {
    return this.constructor.name;
  }

  run() {
    console.log(`Running "${this.getName()}" command`);

    return Promise.resolve()
      .then(() => {
        if (!this.isEnabled()) {
          throw new Error(`The "${this.getName()}" command is not enabled on this environment`);
        }
      })
      .then(() => this.initialize(this._input, this._output))
      .then(() => this.execute(this._input, this._output))
      .then(() => this.complete(this._input, this._output))
      .catch(error => this.error(error, this._input, this._output));
  }

  getContainer() {
    return this._app_kernel.getContainer();
  }

  /**
   * Checks if the given command is enabled on the current environment. By default it is always enabled.
   *
   * Override me to disable this command for certain environments!
   */
  isEnabled() {
    return true;

    // You could have code like:
    // return this.getContainer().get('EnvironmentManager').isDevelopment();
  }

  /**
   * Promisified
   *
   * Performs setup operations, such as input validation or database queries. This is executed immediately prior
   * to the execute() contents. By default it does nothing.
   *
   * Override me to add more interesting functionality!
   */
  initialize(input, output) {
    return Promise.resolve();
  }

  /**
   * Promisified
   *
   * Subclasses should implement this. This is the "meat" of the code.
   */
  execute(input, output) {
    return Promise.reject('Not implemented');
  }

  /**
   * The default code executed upon a graceful completion of this command. That is, if the execute() method
   * properly resolves.
   *
   * Override me to add more interesting functionality, such as outputting results or whatnot!
   */
  complete(input, output) {
    process.exit(0);
  }

  /**
   * The default code executed when the command fails to properly execute. That is, if the execute() method
   * is rejected.
   *
   * Override me to add more interesting functionality, such as error messages or different exit codes!
   */
  error(error, input, output) {
    output.writeln(error);
    process.exit(1);
  }
}

module.exports = Command;
