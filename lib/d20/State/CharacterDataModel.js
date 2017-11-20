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

const FOUNDATION = {
  ABILITY_SCORES: {
    STRENGTH: 'foundation:ability_scores:strength',
    DEXTERITY: 'foundation:ability_scores:dexterity',
    CONSTITUTION: 'foundation:ability_scores:constitution',
    INTELLIGENCE: 'foundation:ability_scores:intelligence',
    WISDOM: 'foundation:ability_scores:wisdom',
    CHARISMA: 'foundation:ability_scores:charisma',
  },
  ABILITY_MODIFIERS: {
    STRENGTH: 'foundation:ability_modifiers:strength',
    DEXTERITY: 'foundation:ability_modifiers:dexterity',
    CONSTITUTION: 'foundation:ability_modifiers:constitution',
    INTELLIGENCE: 'foundation:ability_modifiers:intelligence',
    WISDOM: 'foundation:ability_modifiers:wisdom',
    CHARISMA: 'foundation:ability_modifiers:charisma',
  },
  SAVES: {
    FORTITUDE: 'foundation:saving_throws:fortitude',
    REFLEX: 'foundation:saving_throws:reflex',
    WILL: 'foundation:saving_throw:will',
  },
  SKILL_RANKS: {

  },
  BASE_ATTACK_BONUS: 'foundation:base_attack_bonus',
};
const ADJUSTMENT = {
  ABILITY_SCORES: {
    STRENGTH: 'adjustment:ability_scores:strength',
    DEXTERITY: 'adjustment:ability_scores:dexterity',
    CONSTITUTION: 'adjustment:ability_scores:constitution',
    INTELLIGENCE: 'adjustment:ability_scores:intelligence',
    WISDOM: 'adjustment:ability_scores:wisdom:type',
    CHARISMA: 'adjustment:ability_scores:charisma',
  },
  EQUIPMENT: {
    TOTAL_BONUSES: {
      STRENGTH: 'adjustment:equipment:bonuses:strength',
      DEXTERITY: 'adjustment:equipment:bonuses:dexterity',
      CONSTITUTION: 'adjustment:equipment:bonuses:constitution',
      INTELLIGENCE: 'adjustment:equipment:bonuses:intelligence',
      WISDOM: 'adjustment:equipment:bonuses:wisdom',
      CHARISMA: 'adjustment:equipment:bonuses:charisma',
    }
  },
  ATTACK_BONUS: {
    SIZE: 'adjustment:attack_bonus:size',
  },
  ARMOR_CLASS: {
    SIZE: 'adjustment:armor_class:size',
  }
};
const ACCUMULATION = {
  ABILITY_SCORES: {
    STRENGTH: 'accumulation:ability_scores:strength',
    DEXTERITY: 'accumulation:ability_scores:dexterity',
    CONSTITUTION: 'accumulation:ability_scores:constitution',
    INTELLIGENCE: 'accumulation:ability_scores:intelligence',
    WISDOM: 'accumulation:ability_scores:wisdom',
    CHARISMA: 'accumulation:ability_scores:charisma',
  }
};

const FOUN_DEXMOD = 'foundation:ability_modifiers:dexterity';
const FOUN_CONMOD = 'foundation:ability_modifiers:constitution';

const FOUN_CLASS_LV = 'foundation:class_levels';
const FOUN_RACE_LV  = 'foundation:racial_levels';
const FOUN_HD = 'foundation:hit_dice';
const FOUN_HP_ROLLS = 'foundation:hit_point_rolls';
const FOUN_HIT_POINTS = 'foundation:hit_points';

const ADJS_ATTACK_SIZE = 'adjustment:attack_bonus:size';
const ADJS_ARMOR_SIZE = 'adjustment:armor_class:size';

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
  registry.register(FOUNDATION.ABILITY_SCORES.STRENGTH, buildNullModel());
  registry.register(FOUNDATION.ABILITY_SCORES.DEXTERITY, buildNullModel());
  registry.register(FOUNDATION.ABILITY_SCORES.CONSTITUTION, buildNullModel());
  registry.register(FOUNDATION.ABILITY_SCORES.INTELLIGENCE, buildNullModel());
  registry.register(FOUNDATION.ABILITY_SCORES.WISDOM, buildNullModel());
  registry.register(FOUNDATION.ABILITY_SCORES.CHARISMA, buildNullModel());
}

// Register accumulated ability scores
{
  // FIXME (Derek) there are more adjustment types to add
  registry.register(ACCUMULATION.ABILITY_SCORES.STRENGTH, buildSummationModel([FOUNDATION.ABILITY_SCORES.STRENGTH, ADJUSTMENT.ABILITY_SCORES.STRENGTH]));
  registry.register(ACCUMULATION.ABILITY_SCORES.DEXTERITY, buildSummationModel([FOUNDATION.ABILITY_SCORES.DEXTERITY, ADJUSTMENT.ABILITY_SCORES.DEXTERITY]));
  registry.register(ACCUMULATION.ABILITY_SCORES.CONSTITUTION, buildSummationModel([FOUNDATION.ABILITY_SCORES.CONSTITUTION, ADJUSTMENT.ABILITY_SCORES.CONSTITUTION]));
  registry.register(ACCUMULATION.ABILITY_SCORES.INTELLIGENCE, buildSummationModel([FOUNDATION.ABILITY_SCORES.INTELLIGENCE, ADJUSTMENT.ABILITY_SCORES.INTELLIGENCE]));
  registry.register(ACCUMULATION.ABILITY_SCORES.WISDOM, buildSummationModel([FOUNDATION.ABILITY_SCORES.WISDOM, ADJUSTMENT.ABILITY_SCORES.WISDOM]));
  registry.register(ACCUMULATION.ABILITY_SCORES.CHARISMA, buildSummationModel([FOUNDATION.ABILITY_SCORES.CHARISMA, ADJUSTMENT.ABILITY_SCORES.CHARISMA]));

  registry.register(ADJUSTMENT.ABILITY_SCORES.STRENGTH, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.STRENGTH]));
  registry.register(ADJUSTMENT.ABILITY_SCORES.DEXTERITY, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.DEXTERITY]));
  registry.register(ADJUSTMENT.ABILITY_SCORES.CONSTITUTION, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.CONSTITUTION]));
  registry.register(ADJUSTMENT.ABILITY_SCORES.INTELLIGENCE, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.INTELLIGENCE]));
  registry.register(ADJUSTMENT.ABILITY_SCORES.WISDOM, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.WISDOM]));
  registry.register(ADJUSTMENT.ABILITY_SCORES.CHARISMA, buildSummationModel([ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.CHARISMA]));
}

// Register foundational ability modifiers
{
  registry.register(FOUNDATION.ABILITY_MODIFIERS.STRENGTH, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.STRENGTH));
  registry.register(FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.DEXTERITY));
  registry.register(FOUNDATION.ABILITY_MODIFIERS.CONSTITUTION, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.CONSTITUTION));
  registry.register(FOUNDATION.ABILITY_MODIFIERS.INTELLIGENCE, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.INTELLIGENCE));
  registry.register(FOUNDATION.ABILITY_MODIFIERS.WISDOM, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.WISDOM));
  registry.register(FOUNDATION.ABILITY_MODIFIERS.CHARISMA, buildAbilityModifierModel(ACCUMULATION.ABILITY_SCORES.CHARISMA));
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
  registry.register(FOUNDATION.BASE_ATTACK_BONUS, {
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
      return data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] - int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register('accumulation:combat_maneuver:defense', {
    script: data => {
      // The attack bonuses are NEGATIVE for cmb/cmd
      return 10 + data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] + data[FOUNDATION.ABILITY_MODIFIERS.DEXTERITY] - int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register('accumulation:attack_bonus:melee', {
    script: data => {
      return data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] + int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register('accumulation:attack_bonus:ranged', {
    script: data => {
      return data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] + int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, ADJUSTMENT.ATTACK_BONUS.SIZE ],
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
  const ACSummationModel = function(dependencies) {
    const base_model = buildSummationModel(dependencies);
    base_model.old_script = base_model.script;
    base_model.script = ((data) => {
      return base_model.old_script(data) + 10;
    });
    return base_model;
  };
  const equipment_armor_bonus_node = 'adjustment:equipment:bonuses:armor_class';

  registry.register('accumulation:armor_class:base', ACSummationModel([ FOUN_DEXMOD, ADJS_ARMOR_SIZE, equipment_armor_bonus_node ]));
  registry.register('accumulation:armor_class:touch', ACSummationModel([ FOUN_DEXMOD, ADJS_ARMOR_SIZE ])); // Needs deflection + other bonuses
  registry.register('accumulation:armor_class:flat_footed', ACSummationModel([ ADJS_ARMOR_SIZE, equipment_armor_bonus_node ]));
}

// Derive Adjustments from equipment; this is an intermediary stat that's calculated first cuz =
// the totals are complicated as hell
{
  [
    'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
    'armor_class',
  ].forEach(stat => {
    const breakdown_key = `adjustment:equipment:bonus_breakdowns:${stat}`;

    registry.register(breakdown_key, {
      script: data => {
        const base = {}; // Example keys: 'enhancement', 'insight', etc

        const equipment_data = data['equipment'] || [];
        equipment_data.forEach(equipment => {
          const item = equipment.item;
          (item.adjustments || []).forEach(adjustment => {
            const { attribute, type, value } = adjustment;
            if (attribute === stat) {
              // So HERE is a nasty little tidbit: http://www.d20pfsrd.com/basics-ability-scores/glossary#TOC-Bonus
              // Bonuses typically overlap EXCEPT:
              //  * dodge bonuses
              //  * racial bonuses
              //  * MOST circumstance bonuses
              base[type] = base[type] || 0;
              if (['racial', 'dodge', 'circumstance'].includes(type)) {
                // Stacks
                base[type] += value;
              } else {
                // No stack; Only take the higher value
                base[type] = Math.max(base[type], value);
              }
            }
          });
        });
        return base;
      },
      dependencies: [ 'equipment' ],
    });
    registry.register(`adjustment:equipment:bonuses:${stat}`, {
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
  registry.register('accumulation:basic_attack', {
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
