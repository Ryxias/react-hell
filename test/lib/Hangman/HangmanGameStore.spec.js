'use strict';

import { expect } from 'chai';

describe('HangmanGameStore', function () {
  const service_container = require('../../../services/container');
  const HangmanGameStore = service_container.get('HangmanGameStore');

  describe('#findBySlackChannel', function () {
    let result = undefined;
    before(function () { // Should be before()
      return HangmanGameStore.findBySlackChannel('TEST-ASDFQWERTY')
        .then(res => result = res);
    });

    it('should return a result', function () {
      expect(result).to.not.be.undefined;
    });

    it('should contain a game_id', function () {
      expect(result.game_id).to.equal(`slack-channel:TEST-ASDFQWERTY`);
    });

    it('should contain a phrase', function () {
      expect(result.phrase).to.equal(`default`);
    });

    it('should contain a guess list', function () {
      expect(result.guesses).to.equal(``);
    });

    it('should contain a game state indicator', function () {
      expect(result.active).to.equal(false);
    });
  });

  describe('#createForSlackChannel', function () {
    let result = undefined;
    before(function () { // Should be before()
      return HangmanGameStore.createForSlackChannel('TEST-FOOBAR')
        .then(res => result = res);
    });

    it('should return a result', function () {
      expect(result).to.not.be.undefined;
    });

    it('should contain a game_id', function () {
      expect(result.game_id).to.equal(`slack-channel:TEST-FOOBAR`);
    });

    it('should contain a phrase', function () {
      expect(result.phrase).to.equal(`default`);
    });

    it('should contain a guess list', function () {
      expect(result.guesses).to.equal(``);
    });

    it('should contain a game state indicator', function () {
      expect(result.active).to.equal(false);
    });
  });
});
