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
            resolve(new Card(JSON.parse(card_data)));
          });
        }
      );
    });
  }

  /**
   * Returns a random card available on enUS
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

  /**
   * Does a gacha pull with the typical probabilities
   *  - 1% UR
   *  - 4% SSR
   *  - 15% SR
   *  - 80% R
   *
   * @returns {Promise}
   */
  gachaRCard() {
    const roll = Math.floor(Math.random() * 100); // 0 - 99
    let rarity = 'N';
    if (roll < 1) {
      rarity = 'UR';
    } else if (roll < 5) {
      rarity = 'SSR';
    } else if (roll < 20) {
      rarity = 'SR';
    } else {
      rarity = 'R';
    }

    return this.getRandomCardByRarity(rarity);
  }

  /**
   * Rarity = "N", "R", "SR", "SSR", or "UR"
   *
   * @returns {Promise}
   */
  getRandomCardByRarity(rarity = 'R') {
    return new Promise((resolve, reject) => {
      let data = '';
      this.http.get(
        {
          hostname: 'schoolido.lu',
          path: '/api/cards/?rarity='+rarity+'&japan_only=false&ordering=random&page_size=1'
        },
        (response) => {
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            resolve(new Card(JSON.parse(data).results[0]));
          });
        }
      );
    })
  }
}

/**
 * Encapsulation of a card.
 */
class Card {
  constructor(raw_card_data) {
    this.card_data = raw_card_data;
    this.id = this.card_data['id'];
    this.name = this.card_data['idol']['name'];
    this.image_url = this.card_data['card_image']; // Protocol-relative, sometimes null
    this.idolized_image_url = this.card_data['card_idolized_image'];
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getImageUrl(https = true) {
    return (https ? 'https' : 'http') + ':'
      + (null !== this.image_url ? this.image_url : this.idolized_image_url);
  }
}

module.exports = LoveLiveClient;
