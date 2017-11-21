'use strict';

const assert = require('assert');
const CharacterData = require('../../../../lib/d20/State/CharacterData');

// FIXME (derek) currently 'npm run test' doesn't run mocha recursively so this test gets skipped
//  port over the work we did over with James to make it run
describe('CharacterData', function() {
  describe('using the template', function() {
    it('should be able to do recalculation', function() {
      const subject = CharacterData.getTemplate();

      // this value isn't defined in the template.  Should be derived with recalculateAll()
      subject.recalculateAll();

      assert.equal(subject.getParameter('foundation:ability_modifiers:strength'), 2);
    });

    it('should be able to calculate ability scores and modifiers', function() {
      // Deprecated
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

      assert.equal(subject.getParameter('foundation:ability_scores:strength'), 15);
      assert.equal(subject.getParameter('accumulation:ability_scores:strength'), 15);
      assert.equal(subject.getParameter('foundation:ability_modifiers:strength'), 2);
    });

    it('should be able to accumulate foundation hp from class, race, and constitution', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();
      assert.equal(subject.getParameter('foundation:hit_points'), 22); // 10 + 7 + 2 (+1 con x 3 levels)
    });

    it('should be able to accumulate base attack bonus', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();
      assert.equal(subject.getParameter('foundation:base_attack_bonus'), 2);
    });

    it('should be able to accumulate combat maneuver stats', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();
      assert.equal(subject.getParameter('accumulation:combat_maneuver:bonus'), 3);
      assert.equal(subject.getParameter('accumulation:combat_maneuver:defense'), 15);
      assert.equal(subject.getParameter('accumulation:attack_bonus:melee'), 5);
      assert.equal(subject.getParameter('accumulation:attack_bonus:ranged'), 5);
    });

    it('should be able to accumulate equipment adjustments', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

      const value = subject.getParameter('adjustment:equipment:bonus_breakdowns:wisdom');
      assert.equal(value.enhancement, 2);
      assert.equal(subject.getParameter('adjustment:equipment:bonuses:wisdom'), 2);
    });

    it('should be able to incorporate equipment bonuses into actual ability scores', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

      // Guy has 10 wis and is wearing a +2 wis bracer
      assert.equal(subject.getParameter('accumulation:ability_scores:wisdom'), 12);
    });

    it('should be able to de-dupe non-stacking bonuses', function() {
      const subject = CharacterData.getTemplate();

      const bunch_of_gear = [
        {
          slot: 'wrists',
          item: {
            key: 'asdfqwertyyuo',
            slot: 'wrists',
            name: 'Amulet of Wisdom (+2)',
            type: 'equipment',
            size: 'S',
            adjustments: [
              {attribute: 'wisdom', type: 'enhancement', value: 2}
            ],
            tags: [],
          },
        },
        {
          slot: 'face...',
          item: {
            key: 'aoweifjwaoeifjaoweifj',
            slot: 'wrists',
            name: 'Amulet of Wisdom (+3)',
            type: 'equipment',
            size: 'S',
            adjustments: [
              {attribute: 'wisdom', type: 'enhancement', value: 3}
            ],
            tags: [],
          },
        }
      ];

      subject.setParameter('equipment', bunch_of_gear);

      // With 2 bracers, the one with the HIGHER wis score wins
      assert.equal(subject.getParameter('accumulation:ability_scores:wisdom'), 13);
    });

    it('should be able to calculate armor class', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

      // 2 dex, 1 size, 3 armor, 3 shield
      assert.equal(subject.getParameter('accumulation:armor_class:base'), 19);
      assert.equal(subject.getParameter('accumulation:armor_class:touch'), 13);
      assert.equal(subject.getParameter('accumulation:armor_class:flat_footed'), 17);
    });

    it('should be able to calculate foundation saving throws', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

      assert.equal(subject.getParameter('foundation:saving_throws:fortitude'), 3);
      assert.equal(subject.getParameter('foundation:saving_throws:reflex'), 2);
      assert.equal(subject.getParameter('foundation:saving_throws:will'), 2);
    });

    it('should be able to calculate adjustment aggregates and breakdowns for ability scores', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();

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
  });
});
