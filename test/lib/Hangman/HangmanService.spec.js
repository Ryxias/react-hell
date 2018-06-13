'use strict';

import { expect } from 'chai';

describe('HangmanService', function () {
  const service_container = require('../../../services/container');
  const HangmanService = service_container.get('HangmanService');
  const {HangmanGame} = service_container.get('HangmanGameStore');

  describe('#getGameBySlackChannel', function () {
    describe('with some random string', function () {
      let result = null;
      before(function () {
        return HangmanService.getGameBySlackChannel('TEST-ASDFQWERTY')
          .then(res => result = res);
      });

      it('returns a game, regardless of whether one exists or not', function () {
        expect(result).to.be.an.instanceOf(HangmanGame);
      });

      describe('the game', function () {
        let game = null;
        before(function () { // Should be before()
          game = result;
        });

        it('has a specific game_id', function () {
          expect(game.game_id).to.equal(`slack-channel:TEST-ASDFQWERTY`);
        });

        it('should have a specific default phrase', function () {
          expect(game.phrase).to.equal(`default`);
        });

        it('should have no guesses initially', function () {
          expect(game.guesses).to.equal(``);
        });

        it('should not be active initially', function () {
          expect(game.active).to.be.false;
        });
      });
    });
  });

  describe('#startGame', function () {
    describe('with an inactive game', function () {
      let game = null;
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            game = res;
            game.active = false;
            return game.save();
          })
          .then(() => HangmanService.startGame(game))
          .then(res => result = res);
      });

      it('tells us it worked', function () {
        expect(result.error).to.be.undefined;
        expect(result.message).to.equal('New game started!');
      });

      it('makes the game active', function () {
        expect(game).to.be.ok;
        expect(game.active).to.be.true;
      });

      it('should have a random phrase', function () {
        expect(game.phrase).to.have.lengthOf.at.least(1);
      });

      it('should have no guesses initially', function () {
        expect(game.guesses).to.equal(`[]`);
      });
    });

    describe('with an active game', function () {
      let game = null;
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            game = res;
            game.active = true;
            return game.save();
          })
          .then(() => HangmanService.startGame(game))
          .then(res => result = res);
      });

      it('should error out', function () {
        expect(result.error).to.be.an.instanceOf(Error);
      });
    });
  });

  describe('#show', function () {
    describe('without guesses', function () {
      const game = {
        phrase: `hello world`,
        active: true,
        guesses: `[]`,
      };
      let result = null;
      before(function() {
        HangmanService.show(game)
          .then(res => result = res);
      });

      it('should show result from no guesses', function () {
        expect(result.error).to.be.undefined;
        expect(result.message).to.equal('`_____ _____`');
      });
    });

    describe('with guesses', function () {
      const game = {
        phrase: `hello world`,
        active: true,
        guesses: `["e","o","l"]`,
      };
      let result = null;
      before(function() {
        HangmanService.show(game)
          .then(res => result = res);
      });

      it('should show result from guesses', function () {
        expect(result.error).to.be.undefined;
        expect(result.message).to.equal('`_ello _o_l_`');
      });
    });
  });

  describe('#guessLetter', function () {
    describe('with an inactive game', function () {
      let game = null;
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            game = res;
            game.active = false;
            return game.save();
          })
          .then(() => HangmanService.guessLetter(game, 'a'))
          .then(res => result = res);
      });

      it('should error out', function () {
        expect(result.error).to.be.an.instanceOf(Error);
      });
    });

    describe('with an active game', function () {
      describe('with an invalid letter', function () {
        let game = null;
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              game = res;
              game.active = true;
              return game.save();
            })
            .then(() => HangmanService.guessLetter(game, 0))
            .then(res => result = res);
        });

        it('should error out', function () {
          expect(result.error).to.be.an.instanceOf(Error);
        });
      });

      describe('with an already guessed letter', function () {
        let game = null;
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              game = res;
              game.active = true;
              game.guesses = `["a"]`;
              return game.save();
            })
            .then(() => HangmanService.guessLetter(game, 'a'))
            .then(res => result = res);
        });

        it('should error out', function () {
          expect(result.error).to.be.an.instanceOf(Error);
        });
      });

      describe('with incorrect guess', function () {
        describe('with less than maximum number of guesses', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `[]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'z'))
              .then(res => result = res);
          });

          it('should tell user guess is incorrect', function () {
            expect(result.message).to.equal('Incorrect.`___________ _______ ______`');
          });

          it('should keep the incorrect guess saved', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.guesses).to.equal(`["z"]`);
              });
          });

          it('should keep game active', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(true);
              });
          });
        });

        describe('with maximum number of guesses', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `["Q","W","E","R","T","Y","1","2","3","4"]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'z'))
              .then(res => result = res);
          });

          it('should tell user the game is over', function () {
            expect(result.message).to.equal(`You're out of guesses!\nYou lose.`);
          });

          it('should make game inactive', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(false);
              });
          });
        });
      });

      describe('with correct guess', function () {
        describe('with letters left to guess', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `[]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'a'))
              .then(res => result = res);
          });

          it('should inform the user the guess was correct', function () {
            expect(result.message).to.equal('Correct. `__A________ _A___A_ ___A__`');
          });

          it('should keep game active', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(true);
              });
          });
        });

        describe('with no letters left to guess', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `["p","l","c","e","h","o","d","r","n","g","m","s"]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'a'))
              .then(res => result = res);
          });

          it('should inform the user the game was won', function () {
            expect(result.message).to.equal(`Correct. \`PLACEHOLDER HANGMAN PHRASE\`\nYou win!`);
          });

          it('should make game inactive', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(false);
              });
          });
        });
      });
    });
  });

  describe('#guessLetter', function () {
    describe('with an inactive game', function () {
      let game = null;
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            game = res;
            game.active = false;
            return game.save();
          })
          .then(() => HangmanService.guessLetter(game, 'a'))
          .then(res => result = res);
      });

      it('should error out', function () {
        expect(result.error).to.be.an.instanceOf(Error);
      });
    });

    describe('with an active game', function () {
      describe('with an invalid letter', function () {
        let game = null;
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              game = res;
              game.active = true;
              return game.save();
            })
            .then(() => HangmanService.guessLetter(game, 0))
            .then(res => result = res);
        });

        it('should error out', function () {
          expect(result.error).to.be.an.instanceOf(Error);
        });
      });

      describe('with an already guessed letter', function () {
        let game = null;
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              game = res;
              game.active = true;
              game.guesses = `["a"]`;
              return game.save();
            })
            .then(() => HangmanService.guessLetter(game, 'a'))
            .then(res => result = res);
        });

        it('should error out', function () {
          expect(result.error).to.be.an.instanceOf(Error);
        });
      });

      describe('with incorrect guess', function () {
        describe('with less than maximum number of guesses', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `[]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'z'))
              .then(res => result = res);
          });

          it('should tell user guess is incorrect', function () {
            expect(result.message).to.equal('Incorrect.`___________ _______ ______`');
          });

          it('should keep the incorrect guess saved', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.guesses).to.equal(`["z"]`);
              });
          });

          it('should keep game active', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(true);
              });
          });
        });

        describe('with maximum number of guesses', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `["Q","W","E","R","T","Y","1","2","3","4"]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'z'))
              .then(res => result = res);
          });

          it('should tell user the game is over', function () {
            expect(result.message).to.equal(`You're out of guesses!\nYou lose.`);
          });

          it('should make game inactive', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(false);
              });
          });
        });
      });

      describe('with correct guess', function () {
        describe('with letters left to guess', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `[]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'a'))
              .then(res => result = res);
          });

          it('should inform the user the guess was correct', function () {
            expect(result.message).to.equal('Correct. `__A________ _A___A_ ___A__`');
          });

          it('should keep game active', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(true);
              });
          });
        });

        describe('with no letters left to guess', function () {
          let result = null;
          before(function () { // Should be before()
            return HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                game.active = true;
                game.guesses = `["p","l","c","e","h","o","d","r","n","g","m","s"]`;
                return game.save();
              })
              .then((game) => HangmanService.guessLetter(game, 'a'))
              .then(res => result = res);
          });

          it('should inform the user the game was won', function () {
            expect(result.message).to.equal(`Correct. \`PLACEHOLDER HANGMAN PHRASE\`\nYou win!`);
          });

          it('should make game inactive', function () {
            HangmanService.getGameBySlackChannel('TEST-#startGame')
              .then(res => {
                let game = res;
                expect(game.active).to.equal(false);
              });
          });
        });
      });
    });
  });

  describe('#answer', function () {
    describe('when the user answers incorrectly', function () {
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            let game = res;
            game.active = true;
            game.guesses = `[]`;
            return game.save();
          })
          .then((game) => HangmanService.answer(game, 'placeholder roulette phrase'))
          .then(res => result = res);
      });

      it('should inform the user was incorrect', function () {
        expect(result.message).to.equal('Nope, good try!');
      });

      it('should keep the game active', function() {
        HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            let game = res;
            expect(game.active).to.equal(true);
          });
      });
    });

    describe('when the user answers correctly', function () {
      let result = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            let game = res;
            game.active = true;
            game.guesses = `[]`;
            return game.save();
          })
          .then((game) => HangmanService.answer(game, 'placeholder hangman phrase'))
          .then(res => result = res);
      });

      it('should inform the user was incorrect', function () {
        expect(result.message).to.equal('Correct! You win!');
      });

      it('should make game inactive', function() {
        HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            let game = res;
            expect(game.active).to.equal(false);
          });
      });
    });
  });

  describe('#stopGame', function () {
    let result = null;
    before(function () { // Should be before()
      return HangmanService.getGameBySlackChannel('TEST-#startGame')
        .then(res => {
          let game = res;
          game.active = true;
          game.guesses = `[]`;
          return game.save();
        })
        .then((game) => HangmanService.stopGame(game))
        .then(res => result = res);
    });

    it('should inform the user the game was stopped', function () {
      expect(result.message).to.equal('Game stopped.');
    });


    it('should make game inactive', function () {
      HangmanService.getGameBySlackChannel('TEST-#startGame')
        .then(res => {
          let game = res;
          expect(game.active).to.equal(false);
        });
    });
  });

  describe('Utility Methods', function () {
    describe('_isOutOfGuesses', function () {
      let game;
      it('should return false if less than 10', function () {
        game = { guesses: `["a","b","c","d"]` };
        expect(HangmanService._isOutOfGuesses(game)).to.equal(false);
      });

      it('should return true if at least 10', function () {
        game = { guesses: `["a","b","c","d","e","f","g","h","i","j"]` };
        expect(HangmanService._isOutOfGuesses(game)).to.equal(false);
      });
    });

    describe('_isCorrectGuess', function () {
      let game = null;
      before(function () { // Should be before()
        return HangmanService.getGameBySlackChannel('TEST-#startGame')
          .then(res => {
            let game = res;
            game.active = true;
            game.guesses = `[]`;
            return game.save();
          })
          .then(res => game = res);
      });

      it('should return false if incorrect letter guess', function () {
        expect(HangmanService._isCorrectGuess('z', game)).to.equal(false);
      });

      it('should return true if correct letter guess', function () {
        expect(HangmanService._isCorrectGuess('a', game)).to.equal(true);
      });
    });

    describe('_generateMatches', function () {
      describe('with no guesses', function () {
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              let game = res;
              game.active = true;
              game.guesses = `[]`;
              return game.save();
            })
            .then((game) => HangmanService._generateMatches(game))
            .then(res => result = res);
        });

        it('should not reveal any letters', function () {
          expect(result.hangman_text).to.equal('`___________ _______ ______`');
        });
      });

      describe('with guesses', function () {
        let result = null;
        before(function () { // Should be before()
          return HangmanService.getGameBySlackChannel('TEST-#startGame')
            .then(res => {
              let game = res;
              game.active = true;
              game.guesses = `["p","h","r","a","s","e"]`;
              return game.save();
            })
            .then((game) => HangmanService._generateMatches(game))
            .then(res => result = res);
        });

        it('should reveal letters', function () {
          expect(result.hangman_text).to.equal('`P_A_EH___ER HA___A_ PHRASE`');
        });
      });
    });
  });

});
