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
 * This class is responsible for all of the algorithms for calculating character stats.
 */

const { FOUNDATION, ACCUMULATION, EQUIPMENT, CONDITIONAL, ADJUSTMENT } = require('./DataKeys');

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
  // (old way)
  // registry.register(ACCUMULATION.ABILITY_SCORES.STRENGTH, buildSummationModel([FOUNDATION.ABILITY_SCORES.STRENGTH, ADJUSTMENT.ABILITY_SCORES.STRENGTH]));
  // registry.register(ACCUMULATION.ABILITY_SCORES.DEXTERITY, buildSummationModel([FOUNDATION.ABILITY_SCORES.DEXTERITY, ADJUSTMENT.ABILITY_SCORES.DEXTERITY]));
  // registry.register(ACCUMULATION.ABILITY_SCORES.CONSTITUTION, buildSummationModel([FOUNDATION.ABILITY_SCORES.CONSTITUTION, ADJUSTMENT.ABILITY_SCORES.CONSTITUTION]));
  // registry.register(ACCUMULATION.ABILITY_SCORES.INTELLIGENCE, buildSummationModel([FOUNDATION.ABILITY_SCORES.INTELLIGENCE, ADJUSTMENT.ABILITY_SCORES.INTELLIGENCE]));
  // registry.register(ACCUMULATION.ABILITY_SCORES.WISDOM, buildSummationModel([FOUNDATION.ABILITY_SCORES.WISDOM, ADJUSTMENT.ABILITY_SCORES.WISDOM]));
  // registry.register(ACCUMULATION.ABILITY_SCORES.CHARISMA, buildSummationModel([FOUNDATION.ABILITY_SCORES.CHARISMA, ADJUSTMENT.ABILITY_SCORES.CHARISMA]));

  registry.register(ACCUMULATION.ABILITY_SCORES.STRENGTH, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.STRENGTH));
  registry.register(ACCUMULATION.ABILITY_SCORES.DEXTERITY, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.DEXTERITY));
  registry.register(ACCUMULATION.ABILITY_SCORES.CONSTITUTION, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.CONSTITUTION));
  registry.register(ACCUMULATION.ABILITY_SCORES.INTELLIGENCE, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.INTELLIGENCE));
  registry.register(ACCUMULATION.ABILITY_SCORES.WISDOM, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.WISDOM));
  registry.register(ACCUMULATION.ABILITY_SCORES.CHARISMA, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.CHARISMA));

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
  registry.register(FOUNDATION.HP_ROLLS, {
    script: data => {
      const rolls = [];

      if (data[FOUNDATION.CLASS_LEVELS]) {
        data[FOUNDATION.CLASS_LEVELS].forEach(class_level => {
          rolls.push(class_level.hp_roll);
        });
      }

      if (data[FOUNDATION.RACIAL_LEVELS]) {
        data[FOUNDATION.RACIAL_LEVELS].forEach(racial_level => {
          rolls.push(racial_level.hp_roll);
        });
      }

      return rolls;
    },
    dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
  });
  registry.register(FOUNDATION.HIT_DICE, {
    script: data => {
      return arr(data[FOUNDATION.CLASS_LEVELS]).length + arr(data[FOUNDATION.RACIAL_LEVELS]).length;
    },
    dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
  });
  registry.register(FOUNDATION.HIT_POINTS, {
    script: data => {
      const hp_sum = arr(data[FOUNDATION.HP_ROLLS]).reduce((sum, value) => sum + value, 0);
      return hp_sum + (data[FOUNDATION.ABILITY_MODIFIERS.CONSTITUTION] * data[FOUNDATION.HIT_DICE]);
    },
    dependencies: [ FOUNDATION.HP_ROLLS, FOUNDATION.HIT_DICE, FOUNDATION.ABILITY_MODIFIERS.CONSTITUTION ],
  });
}

// Foundation: Base attack bonus
{
  registry.register(FOUNDATION.BASE_ATTACK_BONUS, {
    script: data => {
      let bab = 0;
      (data[FOUNDATION.CLASS_LEVELS] || []).forEach(level => {
        bab += level.bab;
      });
      (data[FOUNDATION.RACIAL_LEVELS] || []).forEach(level => {
        bab += level.bab;
      });

      return bab;
    },
    dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
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
  registry.register(ADJUSTMENT.ATTACK_BONUS.SIZE, {
    script: data => getSizeModifier(data[FOUNDATION.BASICS.SIZE_CATEGORY], false),
    dependencies: [ FOUNDATION.BASICS.SIZE_CATEGORY ],
  });
  registry.register(ADJUSTMENT.ARMOR_CLASS.SIZE, {
    script: data => getSizeModifier(data[FOUNDATION.BASICS.SIZE_CATEGORY], false),
    dependencies: [ FOUNDATION.BASICS.SIZE_CATEGORY ],
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

  registry.register('accumulation:armor_class:base', ACSummationModel([ FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, ADJUSTMENT.ARMOR_CLASS.SIZE, ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.ARMOR_CLASS ]));
  registry.register('accumulation:armor_class:touch', ACSummationModel([ FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, ADJUSTMENT.ARMOR_CLASS.SIZE ])); // Needs deflection + other bonuses
  registry.register('accumulation:armor_class:flat_footed', ACSummationModel([ ADJUSTMENT.ARMOR_CLASS.SIZE, ADJUSTMENT.EQUIPMENT.TOTAL_BONUSES.ARMOR_CLASS ]));
}

// Derive Adjustments from equipment; this is an intermediary stat that's calculated first cuz =
// the totals are complicated as hell
{
  [
    'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
    'armor_class', 'fortitude_save', 'reflex_save', 'will_save', 'initiative',
  ].forEach(stat => {
    const breakdown_key = ADJUSTMENT.EQUIPMENT.bonus_breakdown(stat);

    registry.register(breakdown_key, {
      script: data => {
        const base = {}; // Example keys: 'enhancement', 'insight', etc

        const equipment_data = data[EQUIPMENT] || [];
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
      dependencies: [ EQUIPMENT ],
    });
    registry.register(ADJUSTMENT.EQUIPMENT.total_bonus(stat), {
      script: data => {
        const breakdown = dict(data[breakdown_key]);
        return Object.keys(breakdown).reduce((sum, type) => {
          return sum + breakdown[type];
        }, 0);
      },
      dependencies: [ breakdown_key ],
    });
  });
}

// Derive Base saving throws
{
  const buildLevelAggregatorModel = function(stat) {
    // stat must be "fort_save", "ref_save" or "will_save"
    return {
      script: data => {
        // Smush together race and class levels
        const levels = arr(data[FOUNDATION.CLASS_LEVELS]).concat(arr(data[FOUNDATION.RACIAL_LEVELS]));
        return levels.reduce((sum, level) => {
          return sum + int(level[stat]);
        }, 0);
      },
      dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
    };
  };

  registry.register(FOUNDATION.SAVES.FORTITUDE, buildLevelAggregatorModel('fort_save'));
  registry.register(FOUNDATION.SAVES.REFLEX, buildLevelAggregatorModel('ref_save'));
  registry.register(FOUNDATION.SAVES.WILL, buildLevelAggregatorModel('will_save'));
}

// Derive Adjustment Aggregates
{
  const buildAbilityScoreAdjustmentAggregatorModel = function(stat) {
    const base_node = FOUNDATION.ABILITY_SCORES[stat.toUpperCase()];
    return {
      script: data => {
        const aggregation = [];

        // Pull from base ability score
        aggregation.push(addEntry('base_ability_score', stat, 'no_type:base', int(data[base_node])));

        // Pull from all equipment
        arr(data[EQUIPMENT]).forEach(equipment => {
          const item = equipment.item;
          arr(item.adjustments).forEach(adjustment => {
            const { attribute, type, value } = adjustment;
            if (attribute === stat) {
              aggregation.push(addEntry('equipment', stat, type, value));
            }
          });
        });

        return aggregation;
      },
      dependencies: [ EQUIPMENT, base_node ]
    };

    function addEntry(from, stat, type, value) {
      return { from: from, stat: stat, type: type, value: value, tags: [ 'test_tag' ] };
    }
  };
  registry.register(ADJUSTMENT.AGGREGATES.STRENGTH, buildAbilityScoreAdjustmentAggregatorModel('strength'));
  registry.register(ADJUSTMENT.AGGREGATES.DEXTERITY, buildAbilityScoreAdjustmentAggregatorModel('dexterity'));
  registry.register(ADJUSTMENT.AGGREGATES.CONSTITUTION, buildAbilityScoreAdjustmentAggregatorModel('constitution'));
  registry.register(ADJUSTMENT.AGGREGATES.INTELLIGENCE, buildAbilityScoreAdjustmentAggregatorModel('intelligence'));
  registry.register(ADJUSTMENT.AGGREGATES.WISDOM, buildAbilityScoreAdjustmentAggregatorModel('wisdom'));
  registry.register(ADJUSTMENT.AGGREGATES.CHARISMA, buildAbilityScoreAdjustmentAggregatorModel('charisma'));
}

// Derive Adjustment Breakdowns
{
  const buildAggregateToBreakdownTransformationModel = function(aggregation_stat_node) {
    const full_stat_node = ADJUSTMENT.AGGREGATES[aggregation_stat_node.toUpperCase()];
    return {
      script: data => {
        const aggregation = arr(data[full_stat_node]);
        const breakdown = {}; // Example keys: 'enhancement', 'insight', etc

        aggregation.forEach(entry => {
          const { from, type, stat, value, tags } = entry;
          if (aggregation_stat_node === stat) {
            // So HERE is a nasty little tidbit: http://www.d20pfsrd.com/basics-ability-scores/glossary#TOC-Bonus
            // Bonuses typically overlap EXCEPT:
            //  * dodge bonuses
            //  * racial bonuses
            //  * MOST circumstance bonuses
            breakdown[type] = breakdown[type] || 0;
            if (['racial', 'dodge', 'circumstance'].includes(type)) {
              // Stacks
              breakdown[type] += value;
            } else {
              // No stack; Only take the higher value
              breakdown[type] = Math.max(breakdown[type], value);
            }
          }
        });
        return breakdown;
      },
      dependencies: [ full_stat_node ],
    };
  };

  registry.register(ADJUSTMENT.BREAKDOWNS.STRENGTH, buildAggregateToBreakdownTransformationModel('strength'));
  registry.register(ADJUSTMENT.BREAKDOWNS.DEXTERITY, buildAggregateToBreakdownTransformationModel('dexterity'));
  registry.register(ADJUSTMENT.BREAKDOWNS.CONSTITUTION, buildAggregateToBreakdownTransformationModel('constitution'));
  registry.register(ADJUSTMENT.BREAKDOWNS.INTELLIGENCE, buildAggregateToBreakdownTransformationModel('intelligence'));
  registry.register(ADJUSTMENT.BREAKDOWNS.WISDOM, buildAggregateToBreakdownTransformationModel('wisdom'));
  registry.register(ADJUSTMENT.BREAKDOWNS.CHARISMA, buildAggregateToBreakdownTransformationModel('charisma'));
}

// Derive True Adjustments
{
  const buildAggregateCombinerModel = function(node) {
    return {
      script: data => {
        const breakdown = dict(data[node]);
        return Object.keys(breakdown).reduce((sum, type) => {
          const value = breakdown[type];
          return sum + value;
        }, 0);
      },
      dependencies: [ node ],
    }
  };


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

function buildBreakdownSummationModel(node) {
  return {
    script: data => {
      const breakdown = dict(data[node]);
      return Object.keys(breakdown).reduce((sum, type) => {
        const value = breakdown[type];
        return sum + value;
      }, 0);
    },
    dependencies: [ node ],
  }
}

function int(value) {
  return value ? value : 0;
}

function arr(value) {
  return value ? value : [];
}

function dict(value) {
  return value ? value : {};
}

module.exports = registry;
