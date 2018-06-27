'use strict';

const RegexpScript = require('./RegexpScript');

/**
 * The bot simply replies to all messages with the same text (he mimics you)
 */
class Baaachuu extends RegexpScript {
  constructor() {
    super(
      /^chuu$/,
      (message, output) => {
        const lodash = require('lodash');
        const reactions = [
          'tem',
          'fast_parrot',
          'doogroll',
          'you-heh-animated',
          'thinkface-intensifies',
          'riko-wtf',
          'bugcatokno',

          'BAAAA',
        ];
        const reaction = lodash.sample(reactions);

        if (reaction === 'BAAA') {
          return output.reply('baaaaaaaaaa');
        } else {
          return output.react(reaction);
        }
      }
    );
  }
}
module.exports = Baaachuu;
