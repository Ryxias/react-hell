'use strict';

const Registry = require('./CharacterDataModel');

class CharacterData {
  constructor(data) {
    this.data = data;

    // A snapshot of the Character Data Model
    this.registry = Registry;
  }

  recalculateAll() {
    // Brutal brute force of brute forces
    Object.keys(this.data).forEach(key => {
      this.triggerValueChange(key);
    });
  }

  getParameter(parameter) {
    return this.data[parameter];
  }

  /**
   * Assumes dependencies have been resolved already
   */
  recalculateValue(parameter) {
    const script = this.registry.getScript(parameter);
    this.setParameter(parameter, script(this.data));
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
    listeners.forEach(listener => this.recalculateValue(listener));
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
    'foundation:class_levels': [
      {
        name: 'fighter1',
        class: 'fighter',
        level: 1,
        fort_save: 2,
        ref_save: 0,
        will_save: 0,
        bab: 1,
        hit_die: 10,
        hp_roll: 10,
      },
      {
        name: 'fighter2',
        class: 'fighter',
        level: 2,
        fort_save: 1,
        ref_save: 0,
        will_save: 0,
        bab: 1,
        hit_die: 10,
        hp_roll: 7,
      },
    ],
    'foundation:racial_levels': [
      {
        name: 'elin1',
        race: 'elin_kind',
        level: 1,
        fort_save: 0,
        ref_save: 2,
        will_save: 2,
        bab: 0,
        hit_die: 6,
        hp_roll: 2,
      },
    ],
    'foundation:basics:race': 'elin_kind',
    'foundation:basics:size': 'S',

    // Derived foundation attributes...
    // foundation:hit_dice
    // foundation:hit_points
    // foundation:ability_modifiers:*

  };

  return new CharacterData(template);
};

module.exports = CharacterData;
