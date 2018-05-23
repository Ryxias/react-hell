'use strict';

const SchoolIdoluClient = require('../../SchoolIdo.lu/Client');
const ll_client = new SchoolIdoluClient();
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
class Gacha extends Script {
  handles(message) {
    return message.text().startsWith('!gacha');
  }

  run(message, output) {
    let message_text = message.text().toLowerCase();

    const command = ll_client.commandBuilder();

    if (message_text.includes('ur')) {
      command.setProbabilities('UR');
    }
    else if (message_text.includes('ssr')) {
      command.setProbabilities('SSR');
    }
    else if (message_text.includes('sr')) {
      command.setProbabilities('SR');
    }

    // idolization
    const return_idolized = (() => {
      const keywords = ['idlz', 'idolize', 'idolized'];
      let idolized = false;
      if (keywords.some(v => { return message_text.indexOf(v) >= 0; })) {
        idolized = true;
      }
      return idolized;
    })();

    // Love live group
    const aqours = ['aqours', 'aqua', 'aquors'];
    const mus = ['mu', 'mus', `mu's`, "μ's", "μ", "μs", '%CE%BC%27s'];
    if (aqours.some(v => { return message_text.indexOf(v) >= 0; })) {
      // There's at least one
      command.setIdolGroup('aqours');
    }
    else if (mus.some(v => { return message_text.indexOf(v) >= 0; })) {
      // There's at least one
      command.setIdolGroup('mus');
    }
    else {

      // Do some fuzzy character matching
      const characters = [
        'maki', 'umi', 'eli', 'nozomi', 'rin', 'hanayo', 'nico', 'honoka', 'kotori', 'trash',
        'hanamaru', 'yohane', 'yoshiko', 'mari', 'dia', 'kanan', 'chika', 'mikan', 'you', 'yousoro', 'riko',
        'ruby', 'wooby', 'zura', 'maru', 'zuramaru', 'hanamaru',
      ];
      characters.forEach(character => {
        if (message_text.includes(character)) {
          command.setCharacter(character);
        }
      })
    }

    return command.run()
      .then(card => {
        return output.reply('[' + card.getId() + '] ' + card.getName() + ' - ' + (return_idolized ? card.getIdolizedImageUrl() : card.getImageUrl()));
      });
  }
}

module.exports = Gacha;
