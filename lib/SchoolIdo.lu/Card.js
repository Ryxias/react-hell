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

    this.attribute = this.card_data['attribute'];
    this.skill = this.card_data['skill'];
    this.skill_details = this.card_data['skill_details'];
    this.center_skill = this.card_data['center_skill'];
    this.center_skill_details = this.card_data['center_skill_details'];
    this.non_idolized_maximum_statistics_smile = this.card_data['non_idolized_maximum_statistics_smile'];
    this.non_idolized_maximum_statistics_pure = this.card_data['non_idolized_maximum_statistics_pure'];
    this.non_idolized_maximum_statistics_cool = this.card_data['non_idolized_maximum_statistics_cool'];
    this.idolized_maximum_statistics_smile = this.card_data['idolized_maximum_statistics_smile'];
    this.idolized_maximum_statistics_pure = this.card_data['idolized_maximum_statistics_pure'];
    this.idolized_maximum_statistics_cool = this.card_data['idolized_maximum_statistics_cool'];
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

  /**
   * Returns card statistical data for UI overlay
   */
  getCardStats() {
    return {
      name: this.name,
      collection: this.translated_collection,
      attribute: this.attribute,
      skill: this.skill,
      skill_details: this.skill_details,
      center_skill: this.center_skill,
      center_skill_details: this.center_skill_details,
      non_idolized_maximum_statistics_smile: this.non_idolized_maximum_statistics_smile,
      non_idolized_maximum_statistics_pure: this.non_idolized_maximum_statistics_pure,
      non_idolized_maximum_statistics_cool: this.non_idolized_maximum_statistics_cool,
      idolized_maximum_statistics_smile: this.idolized_maximum_statistics_smile,
      idolized_maximum_statistics_pure: this.idolized_maximum_statistics_pure,
      idolized_maximum_statistics_cool: this.idolized_maximum_statistics_cool,
    };
  }
}

module.exports = Card;
