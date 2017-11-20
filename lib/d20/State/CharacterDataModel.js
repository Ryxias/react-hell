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

const ADJS_STR_ENH = 'adjustment.ability_scores:strength:enhancement';
const ADJS_DEX_ENH = 'adjustment.ability_scores:dexterity:enhancement';
const ADJS_CON_ENH = 'adjustment.ability_scores:constitution:enhancement';
const ADJS_INT_ENH = 'adjustment.ability_scores:intelligence:enhancement';
const ADJS_WIS_ENH = 'adjustment.ability_scores:wisdom:enhancement';
const ADJS_CHA_ENH = 'adjustment.ability_scores:charisma:enhancement';

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
    return this.listeners[stat];
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
  registry.register(ACCU_STR, buildSummationModel([FOUN_STR, ADJS_STR_ENH]));
  registry.register(ACCU_DEX, buildSummationModel([FOUN_DEX, ADJS_DEX_ENH]));
  registry.register(ACCU_CON, buildSummationModel([FOUN_CON, ADJS_CON_ENH]));
  registry.register(ACCU_INT, buildSummationModel([FOUN_INT, ADJS_INT_ENH]));
  registry.register(ACCU_WIS, buildSummationModel([FOUN_WIS, ADJS_WIS_ENH]));
  registry.register(ACCU_CHA, buildSummationModel([FOUN_CHA, ADJS_CHA_ENH]));

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


function buildNullModel() {
  return { script: null, dependencies: [] };
}
function buildSummationModel(dependencies) {
  return {
    script: (data) => {
      return dependencies.reduce(function(sum, value) {
        return sum + data[value];
      });
    },
    dependencies: dependencies,
  };
}

function buildAbilityModifierModel(dependency) {
  return {
    script: data => { return Math.floor((data[dependency] - 10) / 2.0) },
    dependencies: [ dependency ],
  };
}


module.exports = registry;
