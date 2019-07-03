'use strict';

const lodash = require('lodash');
const Card = require('./Card');

/**
 * Bang dream API Client
 *
 * https://github.com/MagiCircles/BanGDream/wiki/API-Cards
 */
class Client {
  constructor() {
    this.axios = require('axios');
    this.base_path = 'http://bandori.party';

    this.memoized_last_page_id = null;
  }

  getCard(card_id) {
    return this.doBangDriCall(`/api/cards/${card_id}`)
      .then(json_data => {
        return new Card(json_data);
      })
      .catch(error => error);
  }

  getRandomCard() {
    return Promise.resolve()
      .then(() => {
        if (!this.memoized_last_page_id) {
          // Figure out what the last page is
          return this.doBangDriCall(`/api/cards`)
            .then(json_data => {
              const count = json_data.count;
              const results_per_page = json_data.results.length;

              this.memoized_last_page_id = Math.ceil(count / results_per_page);
            });
        }
      })
      .then(() => {
        // Now we definitely have the memoized_last_page_id
        // We cannot randomly pick a card id because there is a stupid id = 100001 "power card".
        // So we randomly pick a page then randomly pick a card in that page!
        const random_page = Math.ceil(Math.random() * this.memoized_last_page_id);

        return this.doBangDriCall(`/api/cards/?page=${random_page}`)
          .then(json_data => {
            const cards_data = json_data.results;
            const random_card_data = lodash.sample(cards_data);
            return new Card(random_card_data);
          });
      });
  }

  /**
   * Invokes an HTTP call on the provided path, then passes the returned body
   * to the callback in JSON-parsed object form.
   */
  doBangDriCall(path) {
    return this.axios.get(this.base_path + path)
      .then(response => {
        if (response.status >= 300 || response.status < 200) {
          throw new Error('Whoops');
        }
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }

}
module.exports = Client;
