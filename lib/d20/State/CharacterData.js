'use strict';

const Registry = require('./CharacterDataModel');

class CharacterData {
  constructor(data) {
    this.data = data;

    // A snapshot of the Character Data Model
    this.registry = Registry;
  }

  getParameter(parameter) {
    return this.data[parameter];
  }

  setParameter(parameter, value) {
    const old_value = this.data[parameter] || -9999;
    if (old_value !== value) {
      this.data[parameter] = value;
      this.triggerValueChange(parameter);
    }
  }

  triggerValueChange(parameter) {
    // Brute force; we use BFS and recalculate everything.  If there are cycles or back edges, god help us
    const listeners = this.registry.getListeners(parameter);
    listeners.forEach(listener => {
      const script = this.registry.getScript(listener);
      this.setParameter(listener, script(this.data));
    });
  }

  serialize() {
    return JSON.stringify(this.data);
  }


  unserialize(json_string) {
    this.data = JSON.parse(json_string);
  }
}

CharacterData.getTemplate = function() {
  const template = {
    'foundation:ability_scores:strength': 15,
    'foundation:ability_scores:dexterity': 14,
    'foundation:ability_scores:constitution': 13,
    'foundation:ability_scores:intelligence': 12,
    'foundation:ability_scores:wisdom': 10,
    'foundation:ability_scores:charisma': 8,
  };

  return new CharacterData(template);
};

module.exports = CharacterData;
