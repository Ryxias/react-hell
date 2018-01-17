'use strict';

const SchoolIdoluClient = require('../SchoolIdo.lu/Client');
const ll_client = new SchoolIdoluClient();

class SlackConnector {

  static connectChuubot(chuu) {
    // gacha
    //   Provide `!gacha`
    //   You can add 'sr' or 'aqours' to change the mode of the bot
    chuu.on(/^!gacha/, (message, send) => {
      let message_text = message.text.toLowerCase();

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
          send('[' + card.getId() + '] ' + card.getName() + ' - ' + (return_idolized ? card.getIdolizedImageUrl() : card.getImageUrl()));
        });
    });
  }

}

module.exports = SlackConnector;
