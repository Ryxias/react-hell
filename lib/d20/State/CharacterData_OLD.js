'use strict';

const CharacterDataCalculator = require('./CharacterDataCalculator_OLD');

/**
 *
 */
class CharacterData {
  constructor(data = {}, compute = {}) {
    this.data = data;
    this.compute = compute;
  }

  static getTemplate() {
    return new CharacterData(TEMPLATE_DATA, TEMPLATE_COMPUTE);
  }

  recalculateDerivedStatistics() {
    const calculator = new CharacterDataCalculator(this.data, this.compute);
    this.compute = calculator.calculateAll();
  }

  serialize() {
    return JSON.stringify({
      data: this.data,
      compute: this.compute,
    });
  }

  unseralize(json_string) {
    const json = JSON.parse(json_string);
    this.data = json.data;
    this.compute = json.compute;
  };
}




const TEMPLATE_DATA = {
  // the id is a unique id; a uuid of human
  id: 'aaaaaa-aaaa-aaaa-aaaa-aaaaaaaa',

  // basics are stats that are natural to your character, they rarely change
  basics: {
    name: 'Default Dude',
    race: 'human',
    size: 'M',
    face: 5,
    length: 5,
    reach: 5,
    speed: 30,
  },

  // FIXME (derek) maybe in the future we can record all the contributions on a per-level basis from each class?
  class_statistics: {
    fighter1: {
      base_attack_bonus: 1, fortitude_save: 2, reflex_save: 0, will_save: 0, feats: [ 'feat:power-attack' ],
    },
  },

  // ability scores
  ability_scores: {
    // All stat nodes are simply breakdowns based upon type.  The sub nodes are untyped;
    // The value of the stat is simply the sum of all of the nodes.
    strength: {
      base: 15,
    },
    dexterity: {
      base: 14,
    },
    constitution: {
      base: 13,
    },
    intelligence: {
      base: 12,
    },
    wisdom: {
      base: 10,
    },
    charisma: {
      base: 8,
    },
  },

  // class levels are class: Level mappings
  class_levels: {
    fighter: 1,
  },

  base_attack_bonus: {
    class: 1,
  },

  hit_point_rolls: {
    fighter1: 10,
  },

  damage: {
    lethal: 4,
    nonlethal: 4,
  },

  // AC nodes are compositions
  // When calculating AC, you can merge specific dimensions of the stat (omitting certain stats)
  // for things like flat-footed, touch, etc.
  armor_class: {
    base: 10,
    size: 0,
  },

  fortitude_save: {
    class: 2,
    race: 1,
  },

  reflex_save: {
    class: 0,
  },

  will_save: {
    class: 0,
    feat_iron_will: 2,
  },

  initiative: {
    feat: 4,
  },

  skills: {
    stealth: {
      ranks: 1,
      class_skill: false,
    },
  },

  feats: [
    'feat:power-attack'
  ],

  equipment: {
    // References a unique uuid to an item
    head: 'item:helmet:helmet-of-domination',

    // Nothing in hand
    main_hand: null,

    off_hand: 'item:weapon:longsword.medium.default',

    // inventory
    inventory: [

    ],
  },
};



/**
 * All of this data is DERIVED from the base data.  None of this should ever be modified by hand or
 * from an outside source OTHER than the CharacterDataCalculator
 */
const TEMPLATE_COMPUTE = {

  hit_dice: { stat: 0, calculation: {} },

  size: {
    attack: -5,
    armor_class: -5,
    hide: -5,
    stealth: -5,
  },

  ability_totals: {
    strength: { stat: 0, calculation: {} },
    dexterity: { stat:0, calculation: {} },
    constitution: { stat: 0, calculation: {} },
    intelligence: { stat: 0, calculation: {} },
    wisdom: { stat: 0, calculation: {} },
    charisma: { stat: 0, calculation: {} },
  },

  ability_modifiers: {
    strength: { stat: 0, calculation: {} },
    dexterity: { stat: 0, calculation: {} },
    constitution: { stat: 0, calculation: {} },
    intelligence: { stat: 0, calculation: {} },
    wisdom: { stat: 0, calculation: {} },
    charisma: { stat: 0, calculation: {} },
  },

  health: {
    max: { stat: 0, calculation: {} },
    current: { stat: 0, calculation: {} },
    current_nonlethal: { stat: 0, calculation: {} },
    death: { stat: 0, calculation: {} },
  },

  armor_class: {
    normal: { stat: 0, calculation: {} },
    flat_footed: { stat: 0, calculation: {} },
    touch: { stat: 0, calculation: {} },
    helpless: { stat: 0, calculation: {} },
  },

  saves: {
    fortitude: { stat: -5, calculation: {} },
    reflex: { stat: -5, calculation: {} },
    will: { stat: -5, calculation: {} },
  },

  combat_maneuver: {
    bonus: { stat: -5, calculation: {} },
    defense: { stat: -5, calculation: {} },
  },

  attack_bonuses: {
    melee: -5,
    ranged: -5,
  },

  skills: {
    stealth: {
      stat: 10,
      calculation: {
        ranks: 1,
        dexterity: 2,
        check_penalty: -2,
        not_class_skill: 1,
        size: 1,
      }
    },
  },

  attacks: {
    normal: {
      action: 'standard',
      script: 'standard_attack',
      damage: '1d99+0',
      attack: -5,
      calculation: {
        melee: -5,
        weapon: -1,
      },
      weapon: {
        equipment_id: 'item:weapon:default_longsword',
      },
      options: {
        power_attack: {
          attack: -2,
          damage: 2,
        },
      }
    },
  },

  equipment: {
    'item:weapon:default_longsword': {
      type: 'weapon',
      class: 'martial_weapon',
      damage: '1d8',
      damage_type: 'S',
      attack_bonus: 1,
    },

  },
};

module.exports = CharacterData;
