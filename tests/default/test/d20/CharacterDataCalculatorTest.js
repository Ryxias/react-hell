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
      const subject = CharacterData.getTemplate();

      subject.setParameter('adjustment:ability_scores:strength:enhancement', 2);

      assert.equal(subject.getParameter('adjustment:ability_scores:strength:enhancement'), 2);
      assert.equal(subject.getParameter('foundation:ability_scores:strength'), 15);
      assert.equal(subject.getParameter('accumulation:ability_scores:strength'), 17);
      assert.equal(subject.getParameter('foundation:ability_modifiers:strength'), 3);
    });

    it.only('should be able to accumulate foundation hp from class and race', function() {
      const subject = CharacterData.getTemplate();

      subject.recalculateAll();
      assert.equal(subject.getParameter('foundation:hit_points'), 22); // 10 + 7 + 2 (+1 con x 3 levels)
    });
  });

});
