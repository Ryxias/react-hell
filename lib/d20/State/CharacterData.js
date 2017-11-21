'use strict';

const Registry = require('./CharacterDataModel');

class CharacterData {
  constructor(data, config = {}) {
    this.data = Object.assign({}, data);

    // A snapshot of the Character Data Model
    this.registry = Registry;

    this.verbose = config.verbose;
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
    this.log(`>> Triggered recalculation: ${parameter}`);

    const script = this.registry.getScript(parameter);
    this.setParameter(parameter, script(this.data));
  }

  setParameter(parameter, value) {
    const old_value = this.data[parameter] || -9999;
    if (typeof old_value === 'object' && typeof value === 'object') {
      if (JSON.stringify(old_value) === JSON.stringify(value)) {
        // Short circuit cuz the value didn't change
        return;
      }
    } else {
      if (old_value === value) {
        // Short circuit cuz the value didn't change
        return;
      }
    }

    this.log(`> ${parameter} value changed to ${value}`);

    this.data[parameter] = value;
    this.triggerValueChange(parameter);
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

  log(string) {
    if (this.verbose) {
      console.log(string);
    }
  }
}

CharacterData.getTemplate = function() {
  const EquipmentRepository = require('../Data/EquipmentRepository');
  const ClassRepository = require('../Data/ClassRepository');

  const template = {
    'foundation:ability_scores:strength': 15,
    'foundation:ability_scores:dexterity': 14,
    'foundation:ability_scores:constitution': 13,
    'foundation:ability_scores:intelligence': 12,
    'foundation:ability_scores:wisdom': 10,
    'foundation:ability_scores:charisma': 8,
    'foundation:class_levels': [
      ClassRepository.classLevelWith('FIGHTER', 1, {
        hp_roll: 10,
        skill_ranks: {
          climb: 1, stealth: 1, profession: 1,
        }
      }),
      ClassRepository.classLevelWith('FIGHTER', 2, {
        hp_roll: 7,
        skill_ranks: {
          jump: 2,
          stealth: 1,
        },
      }),
    ],
    'foundation:racial_levels': [
      ClassRepository.classLevelWith('ELIN', 1, {
        hp_roll: 2,
        skill_ranks: {
          bluff: 3, diplomacy: 3, knowledge_arcana: 3,
        },
      })
    ],
    'foundation:basics:race': 'elin_kind',
    'foundation:basics:race_templates': [
      {
        name: 'elin',
        type: 'race',
        adjustments: [
          { stat: 'reflex_save', value: 2, type: 'racial' },
        ],
        conditionals: [
          { stat: 'will_save', value: 2, condition: 'sleep', type: 'racial' },
          { stat: 'will_save', value: 4, condition: 'fear', type: 'morale' },
        ],
      }
    ],
    'foundation:basics:size': 'S',

    // Derived foundation attributes...
    // foundation:hit_dice
    // foundation:hit_points
    // foundation:ability_modifiers:*

    // Equipment
    'equipment': [
      {
        slot: 'wrists',
        item: EquipmentRepository.repo['item:amulet:amulet-of-wisdom-2'],
      },
      {
        slot: 'main_hand',
        item: EquipmentRepository.repo['item:weapon:longsword-1'],
      },
      {
        slot: 'armor',
        item: EquipmentRepository.repo['item:armor:leather-1'],
      },
      {
        slot: 'off_hand',
        item: EquipmentRepository.repo['item:shield:large-steel-shield-1'],
      },
      {
        slot: 'back',
        item: EquipmentRepository.repo['item:cape:cape-of-lies'],
      }
    ],

    // Skills (these are derived from the class/race levels)
    'foundation:class_skills': [ ],
    'foundation:skill_ranks': {

    },
    'accumulation:skill_ranks_per_level_breakdown': {

    },
    'accumulation:skill_ranks_per_level': 3,

  };

  return new CharacterData(template);
};

module.exports = CharacterData;
