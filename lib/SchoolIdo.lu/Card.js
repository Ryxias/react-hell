'use strict';

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

  getIdolizedImageUrl(https = true) {
    return (https ? 'https' : 'http') + ':'
      + (null !== this.idolized_image_url ? this.idolized_image_url : this.image_url);
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

module.exports = Card;
