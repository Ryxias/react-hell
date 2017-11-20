'use strict';

/**
 * This file exports a large JSON blob
 *
 * Each entry is of the form:
 *
 * [key] => {
 *   script:
 *      A function accepting (data) as its sole argument and returns the recalculated current key value.
 *      Can be NULL, signifying that the value is not intended to be calculate
 *
 *   dependencies:
 *      An array of keys of other scores that the current value depends on.  Any changes detected on these
 *      dependencies will force the current node to re-compute.
 *
 * }
 *
 *

 */

const FOUN_STR = 'foundation:ability_scores:strength';
const FOUN_DEX = 'foundation:ability_scores:dexterity';
const FOUN_CON = 'foundation:ability_scores:constitution';
const FOUN_INT = 'foundation:ability_scores:intelligence';
const FOUN_WIS = 'foundation:ability_scores:wisdom';
const FOUN_CHA = 'foundation:ability_scores:charisma';

const ADJS_STR = 'adjustment:ability_scores:strength';
const ADJS_DEX = 'adjustment:ability_scores:dexterity';
const ADJS_CON = 'adjustment:ability_scores:constitution';
const ADJS_INT = 'adjustment:ability_scores:intelligence';
const ADJS_WIS = 'adjustment:ability_scores:wisdom:type';
const ADJS_CHA = 'adjustment:ability_scores:charisma';

const ACCU_STR = 'accumulation:ability_scores:strength';
const ACCU_DEX = 'accumulation:ability_scores:dexterity';
const ACCU_CON = 'accumulation:ability_scores:constitution';
const ACCU_INT = 'accumulation:ability_scores:intelligence';
const ACCU_WIS = 'accumulation:ability_scores:wisdom';
const ACCU_CHA = 'accumulation:ability_scores:charisma';

const FOUN_STRMOD = 'foundation:ability_modifiers:strength';
const FOUN_DEXMOD = 'foundation:ability_modifiers:dexterity';
const FOUN_CONMOD = 'foundation:ability_modifiers:constitution';
const FOUN_INTMOD = 'foundation:ability_modifiers:intelligence';
const FOUN_WISMOD = 'foundation:ability_modifiers:wisdom';
const FOUN_CHAMOD = 'foundation:ability_modifiers:charisma';

const FOUN_CLASS_LV = 'foundation:class_levels';
const FOUN_RACE_LV  = 'foundation:racial_levels';
const FOUN_HD = 'foundation:hit_dice';
const FOUN_HP_ROLLS = 'foundation:hit_point_rolls';
const FOUN_HIT_POINTS = 'foundation:hit_points';

const ADJS_ATTACK_SIZE = 'adjustment:attack_bonus:size';
const ADJS_ARMOR_SIZE = 'adjustment:armor_class:size';

const FOUN_BAB = 'foundation:base_attack_bonus';

const SIZE_CATEGORY = 'foundation:basics:size';


class Registry {
  constructor() {
    this.scripts = {};
    this.dependencies = {};
    this.listeners = {};
  }

  register(stat, model) {
    const { script, dependencies } = model;

    this.scripts[stat] = script;
    this.dependencies[stat] = dependencies;

    dependencies.forEach(dependency => {
      this.listeners[dependency] = this.listeners[dependency] || [];
      this.listeners[dependency].push(stat);
    });
  }

  getScript(stat) {
    return this.scripts[stat];
  }

  getListeners(stat) {
    return this.listeners[stat] || [];
  }
}


const registry = new Registry();

// Register foundational ability scores
{
  // Foundation ability scores are not derived from anything
  registry.register(FOUN_STR, buildNullModel());
  registry.register(FOUN_DEX, buildNullModel());
  registry.register(FOUN_CON, buildNullModel());
  registry.register(FOUN_INT, buildNullModel());
  registry.register(FOUN_WIS, buildNullModel());
  registry.register(FOUN_CHA, buildNullModel());
}

// Register accumulated ability scores
{
  // FIXME (Derek) there are more adjustment types to add
  registry.register(ACCU_STR, buildSummationModel([FOUN_STR, ADJS_STR]));
  registry.register(ACCU_DEX, buildSummationModel([FOUN_DEX, ADJS_DEX]));
  registry.register(ACCU_CON, buildSummationModel([FOUN_CON, ADJS_CON]));
  registry.register(ACCU_INT, buildSummationModel([FOUN_INT, ADJS_INT]));
  registry.register(ACCU_WIS, buildSummationModel([FOUN_WIS, ADJS_WIS]));
  registry.register(ACCU_CHA, buildSummationModel([FOUN_CHA, ADJS_CHA]));

  registry.register(ADJS_STR, buildSummationModel(['adjustment.equipment.bonuses.strength']));
  registry.register(ADJS_DEX, buildSummationModel(['adjustment.equipment.bonuses.dexterity']));
  registry.register(ADJS_CON, buildSummationModel(['adjustment.equipment.bonuses.constitution']));
  registry.register(ADJS_INT, buildSummationModel(['adjustment.equipment.bonuses.intelligence']));
  registry.register(ADJS_WIS, buildSummationModel(['adjustment.equipment.bonuses.wisdom']));
  registry.register(ADJS_CHA, buildSummationModel(['adjustment.equipment.bonuses.charisma']));
}

// Register foundational ability modifiers
{
  registry.register(FOUN_STRMOD, buildAbilityModifierModel(ACCU_STR));
  registry.register(FOUN_DEXMOD, buildAbilityModifierModel(ACCU_DEX));
  registry.register(FOUN_CONMOD, buildAbilityModifierModel(ACCU_CON));
  registry.register(FOUN_INTMOD, buildAbilityModifierModel(ACCU_INT));
  registry.register(FOUN_WISMOD, buildAbilityModifierModel(ACCU_WIS));
  registry.register(FOUN_CHAMOD, buildAbilityModifierModel(ACCU_CHA));
}

// Register HP related stuff
{
  registry.register(FOUN_HP_ROLLS, {
    script: data => {
      const rolls = [];

      if (data[FOUN_CLASS_LV]) {
        data[FOUN_CLASS_LV].forEach(class_level => {
          rolls.push(class_level.hp_roll);
        });
      }

      if (data[FOUN_RACE_LV]) {
        data[FOUN_RACE_LV].forEach(racial_level => {
          rolls.push(racial_level.hp_roll);
        });
      }

      return rolls;
    },
    dependencies: [ FOUN_CLASS_LV, FOUN_RACE_LV ],
  });
  registry.register(FOUN_HD, {
    script: data => {
      return (data[FOUN_CLASS_LV] ? data[FOUN_CLASS_LV].length : 0) +
        (data[FOUN_RACE_LV] ? data[FOUN_RACE_LV].length : 0);
    },
    dependencies: [ FOUN_CLASS_LV, FOUN_RACE_LV ],
  });
  registry.register(FOUN_HIT_POINTS, {
    script: data => {
      const hp_sum = (data => {
        if (data[FOUN_HP_ROLLS]) {
          return data[FOUN_HP_ROLLS].reduce((sum, value) => sum + value);
        }
        return 0;
      })(data);

      return hp_sum + (data[FOUN_CONMOD] * data[FOUN_HD]);
    },
    dependencies: [ FOUN_HP_ROLLS, FOUN_HD, FOUN_CONMOD ],
  });
}

// Foundation: Base attack bonus
{
  registry.register(FOUN_BAB, {
    script: data => {
      let bab = 0;
      (data[FOUN_CLASS_LV] || []).forEach(level => {
        bab += level.bab;
      });
      (data[FOUN_RACE_LV] || []).forEach(level => {
        bab += level.bab;
      });

      return bab;
    },
    dependencies: [ FOUN_CLASS_LV, FOUN_RACE_LV ],
  })
}

// Accumulated: CMB, CMD, melee, ranged attacks
{
  registry.register('accumulation:combat_maneuver:bonus', {
    script: data => {
      // The attack bonuses are NEGATIVE for cmb/cmd
      return data[FOUN_BAB] + data[FOUN_STRMOD] - data[ADJS_ATTACK_SIZE] || 0;
    },
    dependencies: [ FOUN_BAB, FOUN_STRMOD, ADJS_ATTACK_SIZE ],
  });
  registry.register('accumulation:combat_maneuver:defense', {
    script: data => {
      // The attack bonuses are NEGATIVE for cmb/cmd
      return 10 + data[FOUN_BAB] + data[FOUN_STRMOD] + data[FOUN_DEXMOD] - data[ADJS_ATTACK_SIZE] || 0;
    },
    dependencies: [ FOUN_BAB, FOUN_STRMOD, FOUN_DEXMOD, ADJS_ATTACK_SIZE ],
  });
  registry.register('accumulation:attack_bonus:melee', {
    script: data => {
      return data[FOUN_BAB] + data[FOUN_STRMOD] + data[ADJS_ATTACK_SIZE];
    },
    dependencies: [ FOUN_BAB, FOUN_STRMOD, ADJS_ATTACK_SIZE ],
  });
  registry.register('accumulation:attack_bonus:ranged', {
    script: data => {
      return data[FOUN_BAB] + data[FOUN_STRMOD] + data[ADJS_ATTACK_SIZE];
    },
    dependencies: [ FOUN_BAB, FOUN_STRMOD, ADJS_ATTACK_SIZE ],
  });
}

// Base size bonus
{
  registry.register(ADJS_ATTACK_SIZE, {
    script: data => getSizeModifier(data[SIZE_CATEGORY], false),
    dependencies: [ SIZE_CATEGORY ],
  });
  registry.register(ADJS_ARMOR_SIZE, {
    script: data => getSizeModifier(data[SIZE_CATEGORY], false),
    dependencies: [ SIZE_CATEGORY ],
  });
}

// Derive Armor class stuff
{
  registry.register('accumulation.armor_class', {
    script: data => {

    },
    dependencies: [ FOUN_DEXMOD, ADJS_ARMOR_SIZE, ],
  });
}

// Derive Adjustments from equipment; this is an intermediary stat that's calculated first cuz =
// the totals are complicated as hell
{
  [
    'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
  ].forEach(stat => {
    const breakdown_key = `adjustment.equipment.bonus_breakdowns.${stat}`;

    registry.register(breakdown_key, {
      script: data => {
        const base = {}; // Example keys: 'enhancement', 'insight', etc

        const equipment_data = data.equipment || [];
        equipment_data.forEach(equipment => {
          const item = equipment.item;
          (item.adjustments || []).forEach(adjustment => {
            const { attribute, type, value } = adjustment;
            if (attribute === stat) {
              base[type] = Math.max(base[type] || 0, value);
            }
          });
        });
        return base;
      },
      dependencies: [ 'equipment' ],
    });
    registry.register(`adjustment.equipment.bonuses.${stat}`, {
      script: data => {
        const breakdown = data[breakdown_key];
        return Object.keys(breakdown).reduce((sum, type) => {
          return sum + breakdown[type];
        }, 0);
      },
      dependencies: [ breakdown_key ],
    });
  });

}

// Derive your attack conditions
{
  registry.register('accumulation.basic_attack', {
    script: data => {
      // If you're holding something in your main hand, it takes you basic attack

      return {
        attack_bonus: 1,
        damage: {
          dice_number: 1,
          dice_size: 8,
          modifier: 2,
          critical_range: 19,
          critical_multiplier: 2,
          type: 'slashing',
        },
        additional_effects: [
          { dice_number: 1, dice_size: 6, type: 'fire' }
        ],
        tags: [
          'race:elin',
          'good_aligned',
          'law_aligned',
          'magic_weapon',
          'melee_attack',
        ]
      };
    },
    dependencies: [ ],
  });

}

function getSizeModifier(size, large_positive = false) {
  const inversion = large_positive ? -1 : 1;
  const mod = (() => {
      switch (size) {
        case 'F':
          return 8;
        case 'D':
          return 4;
        case 'T':
          return 2;
        case 'S':
          return 1;
        case 'M':
          return 0;
        case 'L':
          return -1;
        case 'H':
          return -2;
        case 'G':
          return -4;
        case 'C':
          return -8;
        default:
          return -9999;
      }
    }
  )();
  return mod * inversion;
}
function buildNullModel() {
  return { script: null, dependencies: [] };
}

function buildSummationModel(dependencies) {
  return {
    script: (data) => {
      return dependencies.reduce(function(sum, value) {
        if (value in data) {
          return sum + int(data[value]);
        }
        return sum;
      }, 0);
    },
    dependencies: dependencies,
  };
}

function buildKvSummationModel(mappings) {
  return {
    script: data => {
      return Object.keys(mappings).reduce((sum, key) => {
        const value = mappings[key];
        if (key === value) {
          return sum + data[value];
        } else {
          return sum + value;
        }
      }, 0);
    },
    dependencies: Object.keys(mappings),
  };

}

function buildAbilityModifierModel(dependency) {
  return {
    script: data => { return Math.floor((int(data[dependency]) - 10) / 2.0) },
    dependencies: [ dependency ],
  };
}

function int(value) {
  return value ? value : 0;
}


module.exports = registry;
