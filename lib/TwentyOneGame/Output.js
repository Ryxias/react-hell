'use strict';

class Output {
  /**
   * Pass callables for each of the public/private outputs
   * If no callables are passed it simply outputs to console.log()
   */
  constructor(public_output = null, private_output = null) {
    this.public_output = public_output || console.log;
    this.private_output = private_output || console.log;
  }

  send(message) {
    this.public_output(message);
  }

  privateSend(message) {
    this.private_output(message);
  }

}

module.exports = Output;
