'use strict';

/**
 * Eventually we can use this interface to extend to other forms of output buffering
 */
class Output {
  static console() {
    return new Output(console.log);
  }

  constructor(writer) {
    this._writing_function = writer;
  }

  writeln(line) {
    return this.write(line + `\n`);
  }

  write(text) {
    this._writing_function(text);
  }

}

module.exports = Output;
