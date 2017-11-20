'use strict';

require('../init');
const assert = require('assert');
const CharacterData = require('../../lib/d20/State/CharacterData');

// FIXME (derek) currently 'npm run test' doesn't run mocha recursively so this test gets skipped
//  port over the work we did over with James to make it run
describe('CharacterData', function() {
  describe('using the template', function() {
    it('should be able to calculate ability scores', function() {
      const subject = CharacterData.getTemplate();

      pp(subject);

      subject.setParameter('')
    });
  });

});
