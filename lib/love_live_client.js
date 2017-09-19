//
// Love Live
//
class LoveLiveClient {
  constructor() {
    this.http = require('http');
    this.axios = require('axios');
    this.base_path = 'schoolido.lu';
  }

  /**
   * Returns a promise.  When resolved, returns an instance of a Card (below)
   *
   * @param card_id
   * @returns {Promise}
   */
  getCard(card_id) {
    this.doSchoolidoluCall('/api/cards/' + card_id + '/').then(
      (json_data) => {
        return new Card(json_data);
      }
    );
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
    return this.doSchoolidoluCall('/api/cacheddata/').then(
      (json_data) => {
        return json_data.cards_info.en_cards;
      }
    );
  }

  /**
   * Does a gacha pull with the typical probabilities
   *  - 1% UR
   *  - 4% SSR
   *  - 15% SR
   *  - 80% R
   *
   * @returns Card
   */
  gachaRCard(unit = 'Aqours') {
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

    return this.getRandomCardByRarity(rarity, unit);
  }

  /**
   * Gacha pull with the R rate
   */
  gachaSRCard(unit = 'Aqours') {
    const roll = Math.floor(Math.random() * 100); // 0 - 99
    let rarity = 'SR';
    if (roll < 10) {
      rarity = 'UR';
    } else if (roll < 30) {
      rarity = 'SSR';
    } else {
      rarity = 'SR';
    }

    return this.getRandomCardByRarity(rarity, unit);
  }

  /**
   * Rarity = "N", "R", "SR", "SSR", or "UR"
   *
   * @returns Card
   */
  getRandomCardByRarity(rarity = 'R', unit = 'Aqours') {
    // Entering mus in is likely to get messed up so type-cast it:
    let cleaned_unit = unit.toLowerCase();
    let selected_unit;
    switch (cleaned_unit) {
      case 'mu':
      case 'mus':
      case "mu's":
      case "μ's":
      case "μ":
      case "μs":
        // selected_unit = "μ's";
        selected_unit = '%CE%BC%27s';
        break;
      case "a-rise":
      case "arise":
        selected_unit = 'A-RISE';
        break;
      case "aqours":
      default:
        selected_unit = "Aqours";
        break;
    }
    return this.doSchoolidoluCall(
      '/api/cards/?rarity='+rarity+'&japan_only=false&ordering=random&page_size=1&idol_main_unit=' + selected_unit
    ).then(
      (json_data) => {
        if (!json_data.results[0]) {
          throw new Error("Invalid response received from schoolido.lu");
        }
        return new Card(json_data.results[0]);
      }
    );
  }

  /**
   * Invokes an HTTP call on the provided path, then passes the returned body
   * to the callback in JSON-parsed object form.
   */
  doSchoolidoluCall(path) {
    return this.axios.get(this.base_path + path);
    // return new Promise((resolve, reject) => {
    //   let request = this.http.get(
    //     {
    //       hostname: 'schoolido.lu',
    //       path: path,
    //     },
    //     (response) => {
    //       let { statusCode } = response;
    //       let data = '';
    //       if (statusCode >= 300 || statusCode < 200) {
    //         reject(new Error('Whoops, something went wrong during the API call! Error code was ' + statusCode));
    //       }
    //
    //       response.on('data', (chunk) => {
    //         data += chunk;
    //       });
    //       response.on('end', () => {
    //         resolve(JSON.parse(data));
    //       });
    //     }
    //   );
    //   request.on('error', (err) => reject(err));
    // });
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
    this.website_url = this.card_data['website_url'];
    this.rarity = this.card_data['rarity'];
    this.translated_collection = this.card_data['translated_collection'];
    this.main_unit = this.card_data['idol']['main_unit'];
    this.sub_unit = this.card_data['idol']['sub_unit'];
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

  getWebsiteUrl() {
    return this.website_url;
  }

  /**
   * N, R, SR, SSR, or UR
   */
  getRarity() {
    return this.rarity;
  }

  /**
   * "Animal", "Work", etc..
   */
  getCollection() {
    return this.translated_collection;
  }

  /**
   * μ's or Aqours
   */
  getMainUnit() {
    return this.main_unit;
  }

  /**
   * Bibi etc.
   */
  getSubUnit() {
    return this.sub_unit;
  }
}

module.exports = LoveLiveClient;
