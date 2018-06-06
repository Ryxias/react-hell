'use strict';

/**
 * This is currently tightly coupled to the command line interface
 */
class Input {
  static fromCli() {
    return new Input(process.argv);
  }

  constructor(argv) {
    this.argv = argv.slice(0); // Copy so we dont mess up the original
  }

  getArgs() {
    let copy = this.argv.slice(0);
    return copy.splice(2);
  }

  arg(index) {
    return this.getArgs()[index];
  }

  /**
   * Returns TRUE if the cli provided the given option. (e.g. there exits a --{option} in the command)
   *
   * @param option
   * @returns {boolean}
   */
  hasOpt(option) {
    const optSyntax = `--${option}`;
    return !!this.getArgs().find(arg => arg.startsWith(optSyntax));
  }

  /**
   * Returns the value of a the given option. (e.g. if --username="your name." is provided, then getOpt('username')
   * returns "your name."). Returns NULL if the option was omitted or if the option has no value.
   *
   * @param option
   * @returns {null}
   */
  getOpt(option) {
    const optSyntax = `--${option}=`;
    const opt = this.getArgs().find(arg => arg.startsWith(optSyntax));
    if (opt) {
      return opt.replace(optSyntax, '');
    }
    return null;
  }
}
module.exports = Input;
