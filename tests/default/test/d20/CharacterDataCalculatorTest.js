'use strict';

const DataKeys = require('../../../../lib/d20/State/DataKeys');
const EquipmentRepository = require('../../../../lib/d20/Data/EquipmentRepository');
const assert = require('assert');
const CharacterData = require('../../../../lib/d20/State/CharacterData');

// FIXME (derek) currently 'npm run test' doesn't run mocha recursively so this test gets skipped
//  port over the work we did over with James to make it run
describe('CharacterData', function() {
  describe('using the template', function() {
    const subject = CharacterData.getTemplate();
    subject.recalculateAll();

    it('should be able to do recalculation', function() {
      // this value isn't defined in the template.  Should be derived with recalculateAll()
      assert.equal(subject.getParameter('foundation:ability_modifiers:strength'), 2);
    });

    it('should be able to calculate ability scores and modifiers', function() {
      assert.equal(subject.getParameter('foundation:ability_scores:strength'), 15);
      assert.equal(subject.getParameter('accumulation:ability_scores:strength'), 15);
      assert.equal(subject.getParameter('foundation:ability_modifiers:strength'), 2);
    });

    it('should be able to incorporate equipment bonuses into actual ability scores', function() {
      // Guy has 10 wis and is wearing a +2 wis bracer
      assert.equal(subject.getParameter('accumulation:ability_scores:wisdom'), 12);
    });

    it('should be able to accumulate foundation hp from class, race, and constitution', function() {
      assert.equal(subject.getParameter('foundation:hit_points'), 22); // 10 + 7 + 2 (+1 con x 3 levels)
    });

    it('should be able to accumulate base attack bonus', function() {
      assert.equal(subject.getParameter('foundation:base_attack_bonus'), 2);
    });

    it('should be able to accumulate combat maneuver stats', function() {
      assert.equal(subject.getParameter('accumulation:combat_maneuver:bonus'), 3);
      assert.equal(subject.getParameter('accumulation:combat_maneuver:defense'), 15);
      assert.equal(subject.getParameter('accumulation:attack_bonus:melee'), 5);
      assert.equal(subject.getParameter('accumulation:attack_bonus:ranged'), 5);
    });

    it('should be able to de-dupe non-stacking bonuses', function() {
      const subject2 = CharacterData.getTemplate();

      const bunch_of_gear = [
        {
          slot: 'wrist-1',
          item: EquipmentRepository.repo['item:amulet:amulet-of-wisdom-2'],
        },
        {
          slot: 'wrist-2',
          item: EquipmentRepository.repo['item:amulet:amulet-of-wisdom-3'],
        }
      ];

      subject2.setParameter('equipment', bunch_of_gear);

      // With 2 bracers, the one with the HIGHER wis score wins
      assert.equal(subject2.getParameter('accumulation:ability_scores:wisdom'), 13);
    });

    it('should be able to calculate armor class aggregates', function() {
      // Get the breakdown
      const armor_aggregation = subject.getParameter('adjustment:aggregates:combat:armor_class');
      assert.equal(armor_aggregation.length, 7);
      assert.equal(armor_aggregation[0].from, 'base_armor_class');
      assert.equal(armor_aggregation[0].value, 10);
      assert.equal(armor_aggregation[0].type, 'no_type:base');
      assert.equal(armor_aggregation[0].stat, 'armor_class');

      assert.equal(armor_aggregation[1].from, 'dexterity');
      assert.equal(armor_aggregation[1].value, '2');

      assert.equal(armor_aggregation[2].from, 'equipment');
      assert.equal(armor_aggregation[2].type, 'armor');
      assert.equal(armor_aggregation[3].type, 'armor_enhancement');
      assert.equal(armor_aggregation[4].type, 'shield');
      assert.equal(armor_aggregation[5].type, 'shield_enhancement');
      assert.equal(armor_aggregation[6].type, 'size');
    });

    it('should be able to calculate armor class breakdown', function() {
      // Breakdown
      const armor_breakdown = subject.getParameter('adjustment:breakdown:combat:armor_class');
      assert.equal(armor_breakdown.dexterity, 2);
      assert.equal(armor_breakdown.armor, 2);
      assert.equal(armor_breakdown.armor_enhancement, 1);
      assert.equal(armor_breakdown.shield, 2);
      assert.equal(armor_breakdown.shield_enhancement, 1);
      assert.equal(armor_breakdown.size, 1);
      assert.equal(armor_breakdown['no_type:base'], 10);
    });

    it('should be able to calculate armor class accumulations', function() {
      // 10 + 2 dex, 1 size, 3 armor, 3 shield
      assert.equal(subject.getParameter('accumulation:armor_class:base'), 19);
      assert.equal(subject.getParameter('accumulation:armor_class:touch'), 13);
      assert.equal(subject.getParameter('accumulation:armor_class:flat_footed'), 17);
    });

    it('should be able to calculate adjustment aggregates and breakdowns for ability scores', function() {
      const strength_aggregate = subject.getParameter('adjustment:aggregates:ability_scores:strength');
      assert.equal(strength_aggregate.length, 1);
      assert.deepEqual(strength_aggregate[0], {
        from: 'base_ability_score',
        stat: 'strength',
        type: 'no_type:base',
        value: 15,
        tags: [ 'test_tag' ],
      });

      const wisdom_aggregate = subject.getParameter('adjustment:aggregates:ability_scores:wisdom');
      assert.equal(wisdom_aggregate.length, 2); // Guy is wearing a amulet of +2
      assert.deepEqual(wisdom_aggregate[1], {
        from: 'equipment',
        stat: 'wisdom',
        type: 'enhancement',
        value: 2,
        tags: [ 'test_tag' ],
      });

      const wisdom_breakdown = subject.getParameter('adjustment:breakdown:ability_scores:wisdom');
      assert.deepEqual(wisdom_breakdown, { 'no_type:base': 10, enhancement: 2 });
    });

    it('should be able to calculate foundation saving throws', function() {
      assert.equal(subject.getParameter(DataKeys.FOUNDATION.SAVES.FORTITUDE), 3);
      assert.equal(subject.getParameter(DataKeys.FOUNDATION.SAVES.REFLEX), 2);
      assert.equal(subject.getParameter(DataKeys.FOUNDATION.SAVES.WILL), 2);
    });

    it('should be able to calculate save aggregation', function() {
      const fortitude_aggregation = subject.getParameter(DataKeys.ADJUSTMENT.AGGREGATES.FORTITUDE_SAVE);

      assert.equal(fortitude_aggregation[0].from, 'base_save');
      assert.equal(fortitude_aggregation[0].value, 3);
      assert.equal(fortitude_aggregation[1].from, 'base_ability_mod');
      assert.equal(fortitude_aggregation[1].value, 1);
    });

    it('should be able to calculate save breakdown', function() {
      const fortitude_breakdown = subject.getParameter(DataKeys.ADJUSTMENT.BREAKDOWNS.FORTITUDE_SAVE);
      const reflex_breakdown = subject.getParameter(DataKeys.ADJUSTMENT.BREAKDOWNS.REFLEX_SAVE);
      const will_breakdown = subject.getParameter(DataKeys.ADJUSTMENT.BREAKDOWNS.WILL_SAVE);

      assert.deepEqual(fortitude_breakdown, { 'no_type:base': 3, 'no_type:base_ability_modifier': 1 });
      assert.deepEqual(reflex_breakdown, { 'no_type:base': 2, 'no_type:base_ability_modifier': 2 });
      assert.deepEqual(will_breakdown, { 'no_type:base': 2, 'no_type:base_ability_modifier': 1 });
    });

    it('should be able to calculate class skills', function() {
      const class_skills = subject.getParameter(DataKeys.FOUNDATION.CLASS_SKILLS);

      assert.deepEqual(class_skills, [ 'climb', 'jump', 'swim', 'climb',
        'jump', 'swim', 'bluff', 'diplomacy', 'fly', 'sense_motive' ]);
    });
  });
});
