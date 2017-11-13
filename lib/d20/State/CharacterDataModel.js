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
 */

const BASE_STR = 'ability_scores:strength:base';
const BASE_DEX = 'ability_scores:dexterity:base';
const BASE_CON = 'ability_scores:constitution:base';
const BASE_INT = 'ability_scores:intelligence:base';
const BASE_WIS = 'ability_scores:wisdom:base';
const BASE_CHA = 'ability_scores:charisma:base';

const STRENGTH_SCORE = 'ability_scores:strength:modified';
const DEXTERITY_SCORE = 'ability_scores:dexterity:modified';
const CONSTITUTION_SCORE = 'ability_scores:constitution:modified';
const INTELLIGENCE_SCORE = 'ability_scores:intelligence:modified';
const WISDOM_SCORE = 'ability_scores:wisdom:modified';
const CHARISMA_SCORE = 'ability_scores:charisma:modified';

const STR_MOD = 'ability_modifiers:strength';
const DEX_MOD = 'ability_modifiers:dexterity';
const CON_MOD = 'ability_modifiers:constitution';
const INT_MOD = 'ability_modifiers:intelligence';
const WIS_MOD = 'ability_modifiers:wisdom';
const CHA_MOD = 'ability_modifiers:charisma';


function registerBaseAbilityScores(model) {
  [ BASE_STR, BASE_DEX, BASE_CON, BASE_INT, BASE_WIS, BASE_CHA ].forEach(base => {
    model[base] = {
      script: null,
      dependencies: [],
    };
  });
}

function registerAbilityTotals(model) {
  [ [STRENGTH_SCORE, BASE_STR ], [DEXTERITY_SCORE, BASE_DEX ], [CONSTITUTION_SCORE, BASE_CON],
    [INTELLIGENCE_SCORE, BASE_INT] , [WISDOM_SCORE, BASE_WIS], [CHARISMA_SCORE, BASE_CHA] ].forEach((score, base) => {
    model[score] = {
      script: (data) => {
        // FIXME (derek) Temporary buffs, Equipment
        return data[base];
      },
      dependencies: [base],
    };
  });
}

function registerAbilityModifiers(model) {
  [ [STR_MOD, STRENGTH_SCORE], [DEX_MOD, DEXTERITY_SCORE], [CON_MOD, CONSTITUTION_SCORE],
    [INT_MOD, INTELLIGENCE_SCORE], [WIS_MOD, WISDOM_SCORE], [CHA_MOD, CHARISMA_SCORE] ].forEach((mod, raw) => {
    model[mod] = {
      script: (data) => { return Math.floor((data[raw] - 10) / 2.0) },
      dependencies: [ raw ],
    }
  });
}

const model = {};

registerBaseAbilityScores(model);
registerAbilityTotals(model);
registerAbilityModifiers(model);

module.export = {
  model
};
