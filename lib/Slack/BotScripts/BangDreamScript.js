'use strict';

const Script = require('./Script');

/**
 * Usage syntax:
 *
 *  !bang
 */
class BangDreamScript extends Script {
  constructor(BangDreamClient) {
    super();
    this.BangDreamClient = BangDreamClient;
  }

  handles(message) {
    return message.text().startsWith('!bang');
  }

  run(message, output) {
    const message_text = message.text().toLowerCase();

    // trained
    const return_trained = (() => {
      const keywords = ['train', 'trained'];
      let trained = false;
      if (keywords.some(v => { return message_text.indexOf(v) >= 0; })) {
        trained = true;
      }
      return trained;
    })();

    return this.BangDreamClient.getRandomCard()
      .then(card => {
        const trained_image = card.getTrainedImageUrl() || card.getImageUrl();
        const image_url = return_trained ? trained_image : card.getImageUrl();
        return output.reply(`[${card.getId()}] - ${image_url}`);
      });
  }
}

module.exports = BangDreamScript;
