'use strict';

const Card = require('./Card');

/**
 * Encapsulation of a list of cards.
 */
class Cards {
  constructor(raw_cards_data) {
    this.cards_data = raw_cards_data;
    this.list = [];
    this.populateList();
  }

  populateList() {
    if (this.cards_data) {
      this.cards_data.forEach(data => {
        let card = new Card(data);
        this.list.push(card);
      });
    }
    return this.list;
  }

  clearList() {
    this.list = [];
  }

  getList() {
    return this.list;
  }
}

module.exports = Cards;
