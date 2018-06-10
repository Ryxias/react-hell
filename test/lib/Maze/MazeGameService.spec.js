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
    function startGame() {
      return MazeGameService.getGameBySlackChannel('TEST123')
        .then(game => MazeGameService.startGame(game)
          .then(outcome => ({ outcome, game })));
    }

    it('returns success message', function() {
      return startGame()
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('Game started.');
        });
    });

    it('sets up the game data', function() {
      const MazeGameData = require('../../../lib/Maze/MazeGameData');
      const MazeRoom = require('../../../lib/Maze/MazeRoom');

      return startGame()
        .then(({ outcome, game }) => {
          const data = game.getData();

          expect(data).to.be.instanceOf(MazeGameData);
          expect(data.getRoomIds()).to.be.an('Array').that.has.length.above(0);
          expect(data.getRoomById(data.getRoomIds()[0])).to.be.instanceOf(MazeRoom);
        });
    });

    it('initializes game state', function() {
      const MazeGameState = require('../../../lib/Maze/MazeGameState');

      return startGame()
        .then(({ outcome, game }) => {
          const state = game.getState();

          expect(state).to.be.instanceOf(MazeGameState);
          expect(state.getCurrentRoomId()).to.be.ok;
        });
    });
  });

  describe('#look', function() {
    function look() {
      return MazeGameService.getGameBySlackChannel('TEST123')
        .then(game => MazeGameService.look(game)
          .then(outcome => ({ outcome, game })));
    }

    it('returns a description of your current room', function() {
      return look()
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('There is a room');
        });
    });
  });

  describe('#move', function() {
    function move(direction = 'north') {
      return MazeGameService.getGameBySlackChannel('TEST123')
        .then(game => MazeGameService.move(game, direction)
          .then(outcome => ({ outcome, game })));
    }

    it('moves you to the next room', function() {
      return move('east')
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('You went east');
        });
    });

    it('fails on invalid direction', function() {
      return move('aaaaa')
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('Invalid direction: aaaaa.');
        });
    });

    it('fails on a direction your room does not support', function() {
      return move('south')
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('You cannot move in that direction!');
        });
    });

    it('shows you victory if you reach the exit', function() {
      return move('east')
        .then(() => move('north'))
        .then(() => move('west'))
        .then(() => move('up'))
        .then(({ outcome, game }) => {
          expect(outcome.message).to.equal('Victory!');
        });
    });
  });
});
