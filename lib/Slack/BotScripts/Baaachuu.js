'use strict';

const RegexpScript = require('./RegexpScript');

/**
 * The bot simply replies to all messages with the same text (he mimics you)
 */
class Baaachuu extends RegexpScript {
  constructor() {
    super(
      /^chuu$/,
      // (message, output) => { return output.reply('baaaaaaaaaa'); }
      (message, output) => {
        const lodash = require('lodash');
        const reactions = [
          'tem',
          'fast_parrot',
          'doogroll',
          'you-heh-animated',
        ];
        return output.react(lodash.sample(reactions));
      }
    );
  }
}
module.exports = Baaachuu;
