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

const SkillRepository = require('../Data/SkillRepository');
const { FOUNDATION, ACCUMULATION, EQUIPMENT, CONDITIONAL, INVENTORY, ADJUSTMENT } = require('./DataKeys');

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
  registry.register(ACCUMULATION.ABILITY_SCORES.STRENGTH, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.STRENGTH));
  registry.register(ACCUMULATION.ABILITY_SCORES.DEXTERITY, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.DEXTERITY));
  registry.register(ACCUMULATION.ABILITY_SCORES.CONSTITUTION, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.CONSTITUTION));
  registry.register(ACCUMULATION.ABILITY_SCORES.INTELLIGENCE, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.INTELLIGENCE));
  registry.register(ACCUMULATION.ABILITY_SCORES.WISDOM, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.WISDOM));
  registry.register(ACCUMULATION.ABILITY_SCORES.CHARISMA, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.CHARISMA));
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
// FIXME (derek) this entire section is wrong; derive from accumulations
{
  registry.register(ACCUMULATION.COMBAT_MANEUVER.BONUS, {
    script: data => {
      // The attack bonuses are NEGATIVE for cmb/cmd
      return data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] - int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register(ACCUMULATION.COMBAT_MANEUVER.DEFENSE, {
    script: data => {
      // The attack bonuses are NEGATIVE for cmb/cmd
      return 10 + data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] + data[FOUNDATION.ABILITY_MODIFIERS.DEXTERITY] - int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register(ACCUMULATION.ATTACK_BONUS.MELEE, {
    script: data => {
      return data[FOUNDATION.BASE_ATTACK_BONUS] + data[FOUNDATION.ABILITY_MODIFIERS.STRENGTH] + int(data[ADJUSTMENT.ATTACK_BONUS.SIZE]);
    },
    dependencies: [ FOUNDATION.BASE_ATTACK_BONUS, FOUNDATION.ABILITY_MODIFIERS.STRENGTH, ADJUSTMENT.ATTACK_BONUS.SIZE ],
  });
  registry.register(ACCUMULATION.ATTACK_BONUS.RANGED, {
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
  const buildArmorBreakdownSummationModelExcludeTypes = function(exclude_types) {
    const node = ADJUSTMENT.BREAKDOWNS.ARMOR_CLASS;
    return {
      script: data => {
        const breakdown = dict(data[node]);
        return Object.keys(breakdown).reduce((sum, type) => {
          if (exclude_types.includes(type)) {
            return sum;
          }
          const value = breakdown[type];
          return sum + value;
        }, 0);
      },
      dependencies: [ node ],
    }
  };

  registry.register(ACCUMULATION.ARMOR_CLASS.BASE, buildArmorBreakdownSummationModelExcludeTypes([]));
  registry.register(ACCUMULATION.ARMOR_CLASS.TOUCH, buildArmorBreakdownSummationModelExcludeTypes(['armor', 'armor_enhancement', 'shield', 'shield_enhancement', 'natural']));
  registry.register(ACCUMULATION.ARMOR_CLASS.FLAT_FOOTED, buildArmorBreakdownSummationModelExcludeTypes(['dexterity']));
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

  // Armor class
  registry.register(ADJUSTMENT.AGGREGATES.ARMOR_CLASS, {
    script: data => {
      const aggregation = [];

      // Push a base entry
      aggregation.push(addArmorEntry('base_armor_class', 'no_type:base', 10, ['immutable']));

      // Pull from base ability score
      aggregation.push(addArmorEntry('dexterity', 'dexterity', int(data[FOUNDATION.ABILITY_MODIFIERS.DEXTERITY]), ['dexterity']));

      // Pull from all equipment
      arr(data[EQUIPMENT]).forEach(equipment => {
        const item = equipment.item;
        arr(item.adjustments).forEach(adjustment => {
          const { attribute, type, value } = adjustment;
          if (attribute === 'armor_class') {
            let tags = [];
            // Might find this tag useful later...
            if (['armor', 'armor_enhancement', 'shield', 'shield_enhancement']) {
              tags.push('armor');
            }
            aggregation.push(addArmorEntry('equipment', type, value, tags));
          }
        });
      });

      // Size bonus
      aggregation.push(addArmorEntry('size', 'size', int(data[ADJUSTMENT.ARMOR_CLASS.SIZE]), ['size']));

      return aggregation;

      function addArmorEntry(from, type, value, tags) {
        return { from: from, stat: 'armor_class', type: type, value: value, tags: tags };
      }
    },
    dependencies: [ EQUIPMENT, FOUNDATION.ABILITY_MODIFIERS.DEXTERITY, ADJUSTMENT.ARMOR_CLASS.SIZE ],
  });

  // Saving Throws
  const buildSavingThrowAdjustmentAggregtorModel = function(save) {
    const [ base_node, ability_modifier_node ] = ((save) => {
      switch (save) {
        case 'fortitude_save':
          return [ FOUNDATION.SAVES.FORTITUDE, FOUNDATION.ABILITY_MODIFIERS.CONSTITUTION ];
          break;
        case 'reflex_save':
          return [ FOUNDATION.SAVES.REFLEX, FOUNDATION.ABILITY_MODIFIERS.DEXTERITY ];
          break;
        case 'will_save':
          return [ FOUNDATION.SAVES.WILL, FOUNDATION.ABILITY_MODIFIERS.WISDOM ];
          break;
      }
    })(save);
    return {
      script: data => {
        const aggregation = [];

        // Pull from base save
        aggregation.push(addEntry('base_save', save, 'no_type:base', int(data[base_node])));

        // Pull from base ability score
        aggregation.push(addEntry('base_ability_mod', save, 'no_type:base_ability_modifier', int(data[ability_modifier_node])));

        // Pull from all equipment
        arr(data[EQUIPMENT]).forEach(equipment => {
          const item = equipment.item;
          arr(item.adjustments).forEach(adjustment => {
            const { attribute, type, value } = adjustment;
            if (attribute === save) {
              aggregation.push(addEntry('equipment', save, type, value));
            }
          });
        });

        return aggregation;

        function addEntry(from, save, type, value) {
          return { from: from, stat: save, type: type, value: value };
        }
      },
      dependencies: [ base_node, ability_modifier_node, EQUIPMENT ],
    };
  };
  registry.register(ADJUSTMENT.AGGREGATES.FORTITUDE_SAVE, buildSavingThrowAdjustmentAggregtorModel('fortitude_save'));
  registry.register(ADJUSTMENT.AGGREGATES.REFLEX_SAVE, buildSavingThrowAdjustmentAggregtorModel('reflex_save'));
  registry.register(ADJUSTMENT.AGGREGATES.WILL_SAVE, buildSavingThrowAdjustmentAggregtorModel('will_save'));

  // Skills
  SkillRepository.allSkills().forEach(skill => {
    const ability_score_node = ((skill) => {
      const info = SkillRepository.lookup(skill);
      const key_ability = info.key_ability;
      return FOUNDATION.ABILITY_MODIFIERS[key_ability.toUpperCase()]; // brittle
    })(skill);

    registry.register(ADJUSTMENT.AGGREGATES.skill(skill), {
      script: data => {
        const aggregation = [];

        // First, the ranks
        const skill_ranks = dict(data[FOUNDATION.SKILL_RANKS]);
        const this_skill_ranks = int(skill_ranks[skill]);
        if (this_skill_ranks > 0) { // Can't have negative skill ranks
          aggregation.push(addEntry('skill_ranks', 'no_type:skill_ranks', this_skill_ranks));
        }

        // Then add 1 or 3 if it's a class skill
        if (this_skill_ranks >= 1) {
          if (arr(data[FOUNDATION.CLASS_SKILLS]).includes(skill)) {
            aggregation.push(addEntry('class_skill', 'no_type:class_bonus', 3));
          } else {
            aggregation.push(addEntry('cross_class_skill', 'no_type:class_bonus', 1));
          }
        }

        // Then add the ability mod
        aggregation.push(addEntry('ability_modifier', 'no_type:ability_mod', int(data[ability_score_node])));

        // Then add equipment crap
        arr(data[EQUIPMENT]).forEach(equipment => {
          const item = equipment.item;
          arr(item.adjustments).forEach(adjustment => {
            const { attribute, type, value } = adjustment;
            if (attribute === skill) {
              aggregation.push(addEntry('equipment', type, value));
            }
          });
        });

        return aggregation;

        // Helper
        function addEntry(from, type, value) {
          return { from: from, stat: skill, type: type, value: value };
        }
      },
      dependencies: [ EQUIPMENT, FOUNDATION.SKILL_RANKS, FOUNDATION.CLASS_SKILLS, ability_score_node ]
    });
  });

  // Attacks
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
  registry.register(ADJUSTMENT.BREAKDOWNS.ARMOR_CLASS, buildAggregateToBreakdownTransformationModel('armor_class'));
  registry.register(ADJUSTMENT.BREAKDOWNS.FORTITUDE_SAVE, buildAggregateToBreakdownTransformationModel('fortitude_save'));
  registry.register(ADJUSTMENT.BREAKDOWNS.REFLEX_SAVE, buildAggregateToBreakdownTransformationModel('reflex_save'));
  registry.register(ADJUSTMENT.BREAKDOWNS.WILL_SAVE, buildAggregateToBreakdownTransformationModel('will_save'));

  const buildAggregateToBreakdownTransformationModelForSkill = function(skill) {
    const skill_node = ADJUSTMENT.AGGREGATES.skill(skill);
    return {
      script: data => {
        const aggregation = arr(data[skill_node]);
        const breakdown = {}; // Example keys: 'enhancement', 'insight', etc

        aggregation.forEach(entry => {
          const { from, type, stat, value, tags } = entry;
          if (skill === stat) {
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
      dependencies: [ skill_node ],
    };
  };

  SkillRepository.allSkills().forEach(skill => {
    registry.register(ADJUSTMENT.BREAKDOWNS.skill(skill), buildAggregateToBreakdownTransformationModelForSkill(skill));
  });
}

// Accumulated saving throws
{
  registry.register(ACCUMULATION.SAVES.FORTITUDE, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.FORTITUDE_SAVE));
  registry.register(ACCUMULATION.SAVES.REFLEX, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.REFLEX_SAVE));
  registry.register(ACCUMULATION.SAVES.WILL, buildBreakdownSummationModel(ADJUSTMENT.BREAKDOWNS.WILL_SAVE));
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

// Get skill ranks and class skills
{
  registry.register(FOUNDATION.CLASS_SKILLS, {
    script: data => {
      // Smush together race and class levels
      const levels = arr(data[FOUNDATION.CLASS_LEVELS]).concat(arr(data[FOUNDATION.RACIAL_LEVELS]));
      return levels.reduce((class_skills, level) => {
        return class_skills.concat(arr(level.class_skills));
      }, []);
    },
    dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
  });
  registry.register(FOUNDATION.SKILL_RANKS, {
    script: data => {
      // Smush together race and class levels
      const levels = arr(data[FOUNDATION.CLASS_LEVELS]).concat(arr(data[FOUNDATION.RACIAL_LEVELS]));
      return levels.reduce((sum_skill_ranks, level) => {
        const level_skill_ranks = level.skill_ranks;

        const new_skill_ranks = Object.assign({}, sum_skill_ranks, level_skill_ranks);
        Object.keys(new_skill_ranks).forEach(key => {
          if (sum_skill_ranks[key] && level_skill_ranks[key]) {
            new_skill_ranks[key] = sum_skill_ranks[key] + level_skill_ranks[key];
          }
        });

        return new_skill_ranks;
      }, []);
    },
    dependencies: [ FOUNDATION.CLASS_LEVELS, FOUNDATION.RACIAL_LEVELS ],
  });
}

// Carrying capacity, carrying weight, encumbrance, and check penalties
{
  registry.register(ACCUMULATION.CARRYING_CAPACITY, {
    script: data => {
      // http://www.d20pfsrd.com/alignment-description/carrying-capacity/
      const strength_score = int(data[ACCUMULATION.ABILITY_SCORES.STRENGTH]);
      const { base_score, multiplier } = ((strength_score) => {
        let multiplier = 1;
        while (strength_score >= 30) {
          strength_score -= 10;
          multiplier *= 4;
        }
        return { base_score: strength_score, multiplier };
      })(strength_score);

      const size_multiplier = ((size) => {
        const map = {
          F: 0.125,
          D: 0.25,
          T: 0.5,
          S: 0.75,
          M: 1,
          L: 2,
          H: 4,
          G: 8,
          C: 16,
        };
        return map[size];
      })(data[FOUNDATION.BASICS.SIZE_CATEGORY]);

      const max_capacity = size_multiplier * ((base_score) => {
        const map = {
          1: 10, 2: 20, 3: 30, 4: 40, 5: 50, 6: 60, 7: 70, 8: 80, 9: 90, 10: 100,
          11: 115, 12: 130, 13: 150, 14: 175, 15: 200, 16: 230, 17: 260, 18: 300, 19: 350, 20: 400,
          21: 460, 22: 520, 23: 600, 24: 700, 25: 800, 26: 920, 27: 1040, 28: 1200, 29: 1400,
        };
        return map[base_score];
      })(base_score);
      const medium_capacity = Math.floor((2.0 * max_capacity) / 3.0);
      const light_capacity = Math.floor((max_capacity) / 3.0);

      return {
        heavy: max_capacity,
        medium: medium_capacity,
        light: light_capacity,
      }
    },
    dependencies: [ ACCUMULATION.ABILITY_SCORES.STRENGTH, FOUNDATION.BASICS.SIZE_CATEGORY ],
  });

  registry.register(ACCUMULATION.INVENTORY_WEIGHT, {
    script: data => {
      // Loop through equipment
      const equipment_weight = arr(data[EQUIPMENT]).reduce((weight_sum, equipment) => {
        const item = equipment.item;
        const item_data = item.item;
        return weight_sum + int(item_data.weight);
      }, 0);

      // Loop through inventory
      const inventory_weight = arr(data[INVENTORY]).reduce((weight_sum, inventory_item) => {
        const item_data = inventory_item.item;
        return weight_sum + int(item_data.weight);
      }, 0);

      return inventory_weight + equipment_weight;
    },
    dependencies: [ EQUIPMENT, INVENTORY ],
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
