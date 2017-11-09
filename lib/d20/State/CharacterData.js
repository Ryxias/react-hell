'use strict';

class CharacterData {
  constructor() {
    this.data = TEMPLATE_DATA;
  }

  getHitDice() {
    const class_levels = this.data.class_levels || {};
    let HD = 0;
    Object.keys(class_levels).forEach(key => {
      HD += class_levels[key];
    });
    return HD;
  }

  getArmorClass() {
    const armor_class_stat = this.data.armor_class || {};
    let AC = 0;
    Object.keys(armor_class_stat).forEach(key => {
      AC += armor_class_stat[key];
    });
    return AC;
  }

  getMaximumHitPoints() {

  }

  calculateAbilityModifiers() {
    this.data.ability_modifiers = {};
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
      const stat_array = this.data.ability_scores.strength || {};
      let stat = 0;
      Object.keys(stat_array).forEach(key => {
        stat += stat_array[key];
      });
      this.data.ability_modifier[ability] = Math.floor((stat - 10) / 2.0);
    });
  }
}


const TEMPLATE_DATA = {
  // the id is a unique id; a uuid of human
  id: 'aaaaaa-aaaa-aaaa-aaaa-aaaaaaaa',

  // basics are stats that are natural to your character, they rarely change
  basics: {
    name: 'Default Dude',
    race: 'human',
    size: 'M',
  },

  // ability scores
  ability_scores: {
    // All stat nodes are simply breakdowns based upon type.  The sub nodes are untyped;
    // The value of the stat is simply the sum of all of the nodes.
    strength: {
      base: 10,
    },
    dexterity: {
      base: 10,
    },
    constitution: {
      base: 10,
    },
    intelligence: {
      base: 10,
    },
    wisdom: {
      base: 10,
    },
    charisma: {
      base: 10,
    },
  },

  ability_modifiers: {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0
  },

  // class levels are class: Level mappings
  class_levels: {
    fighter: 1,
  },

  hit_point_rolls: {
    rolls: [
      10
    ],
  },

  hit_points: {
    rolls: 10,
    constitution_modifier: 0,
  },

  // AC nodes are compositions
  // When calculating AC, you can merge specific dimensions of the stat (omitting certain stats)
  // for things like flat-footed, touch, etc.
  armor_class: {
    base: 10,
    ability_modifier: 0,
    size: 0,
    conditional: {

    }
  },

  fortitude_save: {
    base: 0,
  },

  reflex_save: {
    base: 0,
  },

  will_save: {
    base: 0,
  },

  initiative: {
    base: 0,
  },

  equipment: {
    // References a unique uuid to an item
    head: 'aaaa-bbbb-1234-5678-000000',
  },
};
