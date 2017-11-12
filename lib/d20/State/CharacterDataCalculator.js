'use strict';

/**
 * This class is a service solely used to compute the data used in the CharacterData class
 *
 * Due to potential DB class in the future and the potential heavyweight compute operations in here,
 * every method in this class is promisified.
 *
 * All methods in this class must be idempotent, although they may also be dependent on the results of
 * one another (in a DAG, hopefully)
 */
class CharacterDataCalculator {

  constructor(data, compute, options = {}) {
    this.data = data;
    this.compute = compute;
    this.options = {};

    this.calculations = {}; // FIXME (derek) in the future maybe calculate remembers it made calculations and doesn't dupe calcs

    this.calculate_dependencies = options.calculate_dependencies;
  }

  /**
   * Returns a mutated character data entry
   */
  calculateAll() {
    this.calculateHitDice();
    this.calculateAbilityModifiers();
    this.calculateAbilityTotals();
    this.calculateHealth();
    this.calculateArmorClass();
    this.calculateSavingThrows();
    this.calculateCombatManeuvers();

    return this.compute;
  }

  /**
   * HD is a combination of race HD and class levels
   */
  calculateHitDice() {
    // FIXME (derek) no race representation yet
    this.compute.hit_dice = { stat: combineMatrix(this.data.class_levels), calculation: this.data.class_levels };
  }

  calculateAbilityTotals() {
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
      const calculation = this.data.ability_scores[ability] || {};
      this.compute.ability_totals[ability] = { stat: combineMatrix(calculation), calculation: calculation };
    });

    // TODO glean through inventory for this stuff
  }

  /**
   * Depends on ability totals
   */
  calculateAbilityModifiers() {
    if (this.calculate_dependencies) {
      this.calculateAbilityTotals();
    }

    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(ability => {
      const calculations = { [ability]: Math.floor((this.compute.ability_totals[ability].stat - 10) / 2.0) };
      this.compute.ability_modifiers[ability] = statCalculation(calculations);
    });
  }

  /**
   * Depends on ability modifiers and hit dice
   */
  calculateHealth() {
    if (this.calculate_dependencies) {
      this.calculateHitDice();
      this.calculateAbilityTotals();
    }

    const max_calculations = this.data.hit_point_rolls;
    max_calculations.constitution_bonus = this.compute.hit_dice.stat * this.compute.ability_modifiers.constitution.stat;

    this.compute.health.max = statCalculation(max_calculations);

    const current_calculations = {
      'compute.health.current': this.compute.health.max.stat,
      lethal_damage: -1 * this.data.damage.lethal,
    };
    this.compute.health.current = statCalculation(current_calculations);

    const nonlethal_calculations = Object.assign({}, current_calculations);
    nonlethal_calculations.nonlethal_damage = -1 * this.data.damage.nonlethal;

    this.compute.health.current_nonlethal = statCalculation(nonlethal_calculations);

    this.compute.health.death = statCalculation({constitution: -1 * this.compute.ability_totals.constitution.stat});
  }

  calculateArmorClass() {
    const armor_calculations = this.data.armor_class;
    // Add size
    //armor_calculations.size = -1; // FIXME

    // Add dex
    armor_calculations.dexterity = this.compute.ability_modifiers.dexterity.stat;
    //armor_calculations.encumbrance_dexterity_penalty = -1; // FIXME
    // FIXME (derek) add equipment here
    this.compute.armor_class.normal = statCalculation(armor_calculations);
    this.compute.armor_class.flat_footed = statCalculation(armor_calculations, ['dexterity', 'encumbrance_dexterity_penalty']);
    this.compute.armor_class.touch = statCalculation(armor_calculations, ['armor', 'shield', 'natural']);

    const helpless_calculations = Object.assign({}, armor_calculations);
    helpless_calculations.dexterity = -5;
    helpless_calculations.encumbrance_dexterity_penalty = 0;
    this.compute.armor_class.helpless = statCalculation(helpless_calculations);
  }

  calculateSavingThrows() {
    // FIXME (derek) look through equipment, races, and feats
    const fort_calculations = this.data.fortitude_save;
    fort_calculations.constitution = this.compute.ability_modifiers.constitution.stat;
    this.compute.saves.fortitude = statCalculation(fort_calculations);

    const reflex_calculation = this.data.reflex_save;
    reflex_calculation.dexterity = this.compute.ability_modifiers.dexterity.stat;
    this.compute.saves.reflex = statCalculation(reflex_calculation);

    const will_calculation = this.data.will_save;
    will_calculation.wisdom = this.compute.ability_modifiers.wisdom.stat;
    this.compute.saves.will = statCalculation(will_calculation);
  }

  calculateCombatManeuvers() {
    const bonus_calculations = {
      base_attack: combineMatrix(this.data.base_attack_bonus),
      strength: this.compute.ability_modifiers.strength.stat,
    };
    this.compute.combat_maneuver.bonus = statCalculation(bonus_calculations);

    const defense_calculations = Object.assign({}, bonus_calculations);
    defense_calculations.base = 10;
    defense_calculations.dexterity = this.compute.ability_modifiers.dexterity.stat;
    this.compute.combat_maneuver.defense = statCalculation(defense_calculations);
  }
}

function statCalculation(matrix, ignore = []) {
  //FIXME (derek) slice out the ignores
  const calc = Object.assign({}, matrix);
  ignore.forEach(key => { delete calc[key]; });
  return { stat: combineMatrix(calc), calculation: calc };
}

function combineMatrix(matrix) {
  let stat = 0;
  Object.keys(matrix).forEach(key => {
    stat += matrix[key];
  });
  return stat;
}

module.exports = CharacterDataCalculator;
