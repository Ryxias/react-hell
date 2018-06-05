'use strict';

describe('HangmanService', function() {
  const service_container = require('../../../../services/container');
  const HangmanService = service_container.get('HangmanService');
  const { HangmanGame } = service_container.get('HangmanGameStore');

  describe('#getGameBySlackChannel', function() {
    describe('with some random string', function() {
      let result = null;
      beforeAll(function() { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-ASDFQWERTY')
          .then(res => result = res);
      });

      it('returns a game, regardless of whether one exists or not', function() {
        expect(result).to.be.an.instanceOf(HangmanGame);
      });

      describe('the game', function() {
        let game = null;
        beforeAll(function() { // Should be before()
          game = result;
        });

        it('has a specific game_id', function() {
          expect(game.game_id).to.equal(`slack-channel:TEST-ASDFQWERTY`);
        });
      });
    });
  });

  describe('#startGame', function() {
    describe('with an inactive game', function() {
      let game = null;
      let result = null;
      beforeAll(function() { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            game = res;
            game.active = false;
            return game.save();
          })
          .then(() => HangmanService.startGame(game))
          .then(res => result = res);
      });

      it('tells us it worked', function() {
        expect(res.message).to.equal('New game started!');
      });

      it('makes the game active', function() {
        expect(game.active).to.be.true;
      });
    });
  });
});
