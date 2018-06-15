'use strict';

/**
 * A bang dream card
 *
 * The raw card data looks like:
 *
 * {
    id: 501,
    member: 6,
    i_rarity: 1,
    i_attribute: "Pure",
    name: "Go Ahead!",
    japanese_name: "猪突猛進っ！",
    release_date: "2017-03-16",
    is_promo: false,
    is_original: true,
    image: "https://i.bandori.party/u/c/501Kasumi-Toyama-Pure-Go-Ahead-aSHaFE.png",
    image_trained: null,
    art: "https://i.bandori.party/u/c/art/501Kasumi-Toyama-Pure-Go-Ahead-3JS1pC.png",
    art_trained: null,
    transparent: "https://i.bandori.party/u/c/transparent/501Kasumi-Toyama-Pure-Go-Ahead-8t70PA.png",
    transparent_trained: null,
    skill_name: "Looking for Excitement!",
    japanese_skill_name: "ドキドキ探し中！",
    i_skill_type: "Score up",
    i_side_skill_type: null,
    skill_template: "For the next {duration} seconds, score of all notes boosted by +{percentage}%",
    skill_variables: {
    duration: 5,
    percentage: 10
    },
    side_skill_template: null,
    full_skill: "For the next 5 seconds, score of all notes boosted by +10.0% ",
    performance_min: 666,
    performance_max: 1685,
    performance_trained_max: 0,
    technique_min: 861,
    technique_max: 2178,
    technique_trained_max: 0,
    visual_min: 1239,
    visual_max: 3136,
    visual_trained_max: 0,
    cameo_members: [ ]
    }
 */
class Card {
  constructor(raw_card_data) {
    this.card_data = raw_card_data;

    this.id = raw_card_data.id;
    this.member = raw_card_data.member;

    this.art = raw_card_data.art;
    this.art_trained = raw_card_data.art_trained;
  }

  getId() {
    return this.card_data.id;
  }

  getMemberId() {
    return this.member;
  }

  getImageUrl() {
    return this.art;
  }

  getTrainedImageUrl() {
    return this.art_trained || null;
  }
}
module.exports = Card;
