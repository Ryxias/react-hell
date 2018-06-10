'use strict';

const Script = require('./Script');

/**
 * Usage syntax:
 *
 *  !maze [options]
 *
 * Options:
 *
 * - help
 * - start
 * - stop
 */
class HangmanScript extends Script {
  constructor(MazeGameService) {
    super();
    this.MazeGameService = MazeGameService;
  }

  handles(message) {
    return message.text().startsWith('!hangman') || message.text().startsWith('!hm');
  }

  run(message, output) {
    const channel = message.getChannel();
    const message_text = message.text().toLowerCase();

    const command_parts = message_text.split(' ');
    const mz = command_parts[0];
    const operator = (command_parts[1] || '').toLowerCase();

    return this.MazeGameService.getGameBySlackChannel(channel)
      .then(game => {
        switch (operator) {
          case 'help':
            return {
              message: `
Maze Game README!

Maze commands follow the pattern: !maze <command>. Valid commands:

- start
- stop
- look
- move [north|n|east|e|south|s|west|w]
`
            };
          case 'start':
            return this.MazeGameService.startGame(game);
          case 'look':
            return this.HangmanService.look(game);
          case 'move':
            const direction = command_parts[2];
            return this.HangmanService.move(game, direction);
          default:
            return { message: `Unrecognized command: ${operator}`};
        }
      })
      .then(outcome => output.reply(outcome.message));
  }
}

module.exports = HangmanScript;
