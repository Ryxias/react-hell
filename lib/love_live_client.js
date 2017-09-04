//
// Love Live
//
class LoveLiveClient {
  constructor() {
    this.http = require('http');
  }

  /**
   * Returns a promise.  When resolved, returns an instance of a Card (below)
   *
   * @param card_id
   * @returns {Promise}
   */
  getCard(card_id) {
    return new Promise((resolve, reject) => {
      let card_data = '';
      this.http.get(
        {
          hostname: 'schoolido.lu',
          port: 80,
          path: '/api/cards/' + card_id + '/',
        },
        (response) => {
          response.on('data', (chunk) => {
            card_data += chunk;
          });
          response.on('end', () => {
            resolve(new Card(card_data));
          });
        }
      );
    });
  }

  /**
   * Returns a random card id between 1 and 1284.
   *
   * @returns {Promise}
   */
  getRandomCard() {
    return this.getEnCardList().then((list) => {
      let index = Math.floor(Math.random() * list.length);
      let card_id = list[index];
      return this.getCard(card_id);
    });
  }

  /**
   * Returns an array of integer card ids that are available to enUS
   *
   * @returns {Promise}
   */
  getEnCardList() {
    return new Promise((resolve, reject) => {
      let data = '';
      this.http.get(
        {
          hostname: 'schoolido.lu',
          path: '/api/cacheddata/'
        },
        (response) => {
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(JSON.parse(data).cards_info.en_cards);
          });
        }
      );
    });
  }
}

/**
 * Encapsulation of a card.
 */
class Card {
  constructor(raw_card_data) {
    this.card_data = JSON.parse(raw_card_data);
    this.name = this.card_data['idol']['name'];
    this.image_url = this.card_data['card_image']; // Protocol-relative
  }

  getName() {
    return this.name;
  }

  getImageUrl(https = false) {
    return (https ? 'https' : 'http') + ':' + this.image_url;
  }
}

module.exports = LoveLiveClient;
