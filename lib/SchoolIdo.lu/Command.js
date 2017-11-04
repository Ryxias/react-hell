'use strict';

class CommandBuilder {
  constructor(client) {
    this.command = {};
    this.client = client;
  }

  setProbabilities(probabilities = 'R') {
    this.command.probabilities = probabilities;
    return this;
  }

  setIdolGroup(group) {
    this.command.idol_group = group;
    return this;
  }

  setSubunit(subunit) {
    this.command.subunit = subunit;
    return this;
  }

  setCharacter(character) {
    this.command.character = character;
    return this;
  }

  build() {
    return this.command;
  }

  run() {
    return this.client.runGachaCommand(this.build());
  }
}

module.exports = CommandBuilder;
