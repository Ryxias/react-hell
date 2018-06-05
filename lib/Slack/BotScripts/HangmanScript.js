'use strict';

const Script = require('./Script');

/**
 * Usage syntax:
 *
 *  !gacha [commands]
 *
 * Commands are a space-delimited, case-insensitive set of strings that disregard order.
 * Valid options:
 *
 *
 * - ur/ssr/sr/r
 *    Determines the rarity tier of the gacha percent. Defaults to R (rare)
 *
 * - aqours/mus/aqua
 *    Determines the unit of the gacha roll. Defaults to none; cards will be pulled from both.
 *
 * - individual character names/nicknames
 *    Explicitly choose to roll for one specific character
 *
 * - idolized/idlz
 *    Returns the idolized version
 *
 * Incompatible or conflicting compositions of filters will have indeterminate behavior.
 */
class HangmanScript extends Script {
  constructor(HangmanService) {
    super();
    this.HangmanService = HangmanService;
  }

  handles(message) {
    return message.text().startsWith('!hangman') || message.text().startsWith('!hm');
  }

  run(message, output) {
    const channel = message.getChannel();
    const message_text = message.text().toLowerCase();

    const command_parts = message_text.split(' ');
    const hm = command_parts[0];
    const operator = (command_parts[1] || '').toLowerCase();
    const letter = command_parts[2];

    return this.HangmanService.getGameBySlackChannel(channel)
      .then(game => {
        switch (operator) {
          case 'answer':
            const start = 2 + hm.length + operator.length;
            const answer = message_text.substring(start);
            return this.HangmanService.answer(game, answer);
          case 'show':
            return this.HangmanService.show(game);
          case 'add':
            return { message: 'TODO: add' };
          case 'start':
            return this.HangmanService.startGame(game);
          case 'guess':
          case '?':
          case 'try':
          case 'g':
            return this.HangmanService.guessLetter(game, letter);
          case 'stop':
            return this.HangmanService.stopGame(game);
          default:
            return { message: `Unrecognized command: ${operator}`};
        }
      })
      .then(outcome => output.reply(outcome.message));
  }
}

module.exports = HangmanScript;
