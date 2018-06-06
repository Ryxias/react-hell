'use strict';

class HangmanService {
  constructor(HangmanGameStore, GossipStore) {
    this.HangmanGameStore = HangmanGameStore;
    this.GossipStore = GossipStore;
  }

  getGameBySlackChannel(slack_channel) {
    return this.HangmanGameStore.findBySlackChannel(slack_channel)
      .then(game => {
        if (game) {
          return game;
        }
        return this.HangmanGameStore.createForSlackChannel(slack_channel);
      })
  }

  startGame(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        if (game.active) {
          throw new Error('Cannot restart an active game. Finish the current one!');
        }

        // Generate new phrasing using a random gossip
        return this.GossipStore.findOneRandom();
      })
      .then(gossip => {
        const text = (() => {
          if (!gossip) {
            return 'PLACEHOLDER HANGMAN PHRASE';
          }
          return gossip.text;
        })();

        outcome.game = game;

        game.phrase = text;
        game.active = true;
        game.guesses = JSON.stringify([]);

        return game.save().then(() => outcome.message = 'New game started!');
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome); // Always return the outcome
  }

  show(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        const matches = this._generateMatches(game);
        outcome.message = matches.hangman_text;
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome);
  }

  guessLetter(game, letter) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        // Game not active
        if (!game.active) {
          throw new Error('No active game session! Type `!hangman start` to begin!');
        }

        // not a letter
        if (typeof letter !== 'string' || letter.length > 1) {
          throw new Error('Your guess is not a valid letter!');
        }

        // already guessed
        const guesses = JSON.parse(game.guesses);

        if (guesses.includes(letter)) {
          throw new Error(`You have already guessed "${letter}"!`);
        }

        // Add the guess
        guesses.push(letter);
        game.guesses = JSON.stringify(guesses);
        return game.save();
      })
      .then(() => {
        const matches = this._generateMatches(game);

        // correct guess
        if (this._isCorrectGuess(letter, game)) {
          // you're good!
          outcome.message = 'Correct. ' + matches.hangman_text;
          if (matches.letters_missing === 0) {
            outcome.message += '\nYou win!';
            game.active = false;
            return game.save();
          }
          return;
        }

        // incorrect guess
        outcome.message = 'Incorrect.' + matches.hangman_text;

        // ran out of guesses
        if (this._isOutOfGuesses(game)) {
          outcome.message = `You're out of guesses!\nYou lose.`;
          game.active = false;
          return game.save();
        }
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome);
  }

  answer(game, answer) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        const normalized_phrase = game.phrase.toLowerCase();
        if (answer.toLowerCase() === normalized_phrase) {
          game.active = false;
          return game.save().then(() => outcome.message = 'Correct! You win!');
        }
        outcome.message = 'Nope, good try!';
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome);
  }

  stopGame(game) {
    const outcome = { message: '?' };
    return Promise.resolve()
      .then(() => {
        game.active = false;
        return game.save().then(() => outcome.message = 'Game stopped.');
      })
      .catch(err => {
        outcome.error = err;
        outcome.message = err.message;
      })
      .then(() => outcome);
  }

  _isOutOfGuesses(game) {
    return JSON.parse(game.guesses).length > 10;
  }

  _isCorrectGuess(letter, game) {
    const normalized_phrase = game.phrase.toLowerCase();
    const normalized_letters = Array.from(normalized_phrase); // don't use .split - https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript
    return !!normalized_letters.find(_letter => letter === _letter);
  }

  _generateMatches(game) {
    const guesses = JSON.parse(game.guesses);
    const normalized_phrase = game.phrase.toLowerCase();
    const normalized_letters = Array.from(normalized_phrase); // don't use .split - https://stackoverflow.com/questions/4547609/how-do-you-get-a-string-to-a-character-array-in-javascript
    const game_letters = Array.from(game.phrase);

    let letters_missing = 0;
    const hangman_text = '`' + normalized_letters.map((letter, index) => {
      if (letter === ' ') {
        return ' ';
      }
      if (guesses.includes(letter)) {
        return game_letters[index];
      } else {
        letters_missing += 1;
        return '_';
      }
    }).reduce((letter, rest_of_string) => letter + rest_of_string, '') + '`';

    return {
      hangman_text,
      letters_missing,
      num_guesses: guesses.length,
    }
  }
}
module.exports = HangmanService;
