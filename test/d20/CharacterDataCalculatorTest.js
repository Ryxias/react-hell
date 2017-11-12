'use strict';

require('../init');
const assert = require('assert');
const CharacterData = require(PROJECT_ROOT + '/lib/d20/State/CharacterData');
const CharacterDataCalculator = require(PROJECT_ROOT + '/lib/d20/State/CharacterDataCalculator');

describe('CharacterDataCalculator', function() {
  describe('using the template', function() {
    it('should be able to calculate hit dice', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.hit_dice.stat, 1);
    });

    it('should be able to calculate total scores', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.ability_totals.strength.stat, 15);
      assert.equal(character_data.compute.ability_totals.dexterity.stat, 14);
      assert.deepEqual(character_data.compute.ability_totals.dexterity.calculation, {base: 14});
    });

    it('should be able to calculate ability modifiers', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.ability_modifiers.strength.stat, 2);
      assert.equal(character_data.compute.ability_modifiers.dexterity.stat, 2);
      assert.equal(character_data.compute.ability_modifiers.constitution.stat, 1);
      assert.equal(character_data.compute.ability_modifiers.intelligence.stat, 1);
      assert.equal(character_data.compute.ability_modifiers.wisdom.stat, 0);
      assert.equal(character_data.compute.ability_modifiers.charisma.stat, -1);
    });

    it('should be able to calculate total hp', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.health.max.stat, 11);
      assert.equal(character_data.compute.health.current.stat, 7);
      assert.equal(character_data.compute.health.current_nonlethal.stat, 3);
      assert.equal(character_data.compute.health.death.stat, -13);
    });

    it('should be able to calculate armor class', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();
      
      assert.equal(character_data.compute.armor_class.normal.stat, 12);
      assert.equal(character_data.compute.armor_class.flat_footed.stat, 10);
      assert.equal(character_data.compute.armor_class.touch.stat, 12);
      assert.equal(character_data.compute.armor_class.helpless.stat, 5);
    });

    it('should be able to calculate saving throws', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.saves.fortitude.stat, 4);
      assert.equal(character_data.compute.saves.reflex.stat, 2);
      assert.equal(character_data.compute.saves.will.stat, 2);
    });

    it('should be able to calculate combat maneuver', function() {
      const character_data = CharacterData.getTemplate();
      character_data.recalculateDerivedStatistics();

      assert.equal(character_data.compute.combat_maneuver.bonus.stat, 3);
      assert.equal(character_data.compute.combat_maneuver.defense.stat, 15);
    });
  });

});
