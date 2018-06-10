'use strict';

const { expect } = require('chai');

describe('MazeGameService', function() {
  const container = require('../../../services/container');
  const MazeGameService = container.get('MazeGameService');

  describe('getGameBySlackChannel', function() {
    it('creates or fetches a game', function() {
      return MazeGameService.getGameBySlackChannel('TEST123')
        .then(game => {
          const MazeGame = container.get('ConnectionManager').get('MazeGame');
          expect(game).to.be.instanceOf(MazeGame);
          expect(game.game_id).to.equal('slack-channel:TEST123');
          expect(game.data).to.be.ok;
          expect(game.state).to.be.ok;
          expect(game.log).to.be.ok;
        });
    });
  });

  describe('#startGame', function() {
    function test() {
      return MazeGameService.getGameBySlackChannel('TEST123')
        .then(game => MazeGameService.startGame(game)
          .then(outcome => ({ outcome, game })));
    }

    it('returns success message', function() {
      return test()
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('Game started.');
        });
    });

    it('sets up the game data', function() {
      const MazeGameData = require('../../../lib/Maze/MazeGameData');
      const MazeRoom = require('../../../lib/Maze/MazeRoom');

      return test()
        .then(({ outcome, game }) => {
          const data = game.getData();

          expect(data).to.be.instanceOf(MazeGameData);
          expect(data.getRoomIds()).to.be.an('Array').that.has.length.above(0);
          expect(data.getRoomById(data.getRoomIds()[0])).to.be.instanceOf(MazeRoom);
        });
    });

    it('initializes game state', function() {
      const MazeGameState = require('../../../lib/Maze/MazeGameState');

      return test()
        .then(({ outcome, game }) => {
          const state = game.getState();

          expect(state).to.be.instanceOf(MazeGameState);
          expect(state.getCurrentRoomId()).to.be.ok;
        });
    });
  });

});
