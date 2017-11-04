'use strict';

const Card = require('./Card');
const CommandBuilder = require('./Command');

class Client {
  constructor() {
    this.axios = require('axios');
    this.base_path = 'http://schoolido.lu';
  }

  /**
   * Returns a promise.  When resolved, returns an instance of a Card (below)
   *
   * @param card_id
   * @returns {Promise}
   */
  getCard(card_id) {
    return this.doSchoolidoluCall('/api/cards/' + card_id + '/').then(
      (json_data) => {
        return new Card(json_data);
      }
    );
  }

  commandBuilder() {
    return new CommandBuilder(this);
  }

  runGachaCommand(command) {
    let filters = {};
    filters.rarity = this.rollRarityFromProbability(command.probabilities);
    filters.idol_main_unit = this.mapIdolGroupToCleanIdolMainUnit(command.idol_group || '');
    filters.name = this.mapCharacterToCleanName(command.character || '');

    return this.doSchoolidoluCallWithFilters(filters)
      .then(
        (json_data) => {
          if (!json_data.results[0]) {
            throw new Error("Invalid response received from schoolido.lu");
          }
          return new Card(json_data.results[0]);
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
    let rarity = this.rollRarityFromProbability('R');

    return this.getRandomCardByRarity(rarity, unit);
  }

  /**
   * Gacha pull with the R rate
   */
  gachaSRCard(unit = 'Aqours') {
    let rarity = this.rollRarityFromProbability('SR');

    return this.getRandomCardByRarity(rarity, unit);
  }

  rollRarityFromProbability(probability = 'R') {
    switch(probability) {
      case 'UR': {
        return 'UR';
        break;
      }
      case 'SSR': {
        const roll = Math.floor(Math.random() * 100); // 0 - 99
        if (roll < 20) {
          return 'UR';
        } else  {
          return 'SSR';
        }
        break;
      }
      case 'BLUE':
      case 'SR': {
        const roll = Math.floor(Math.random() * 100); // 0 - 99
        if (roll < 10) {
          return 'UR';
        } else if (roll < 30) {
          return 'SSR';
        } else {
          return 'SR';
        }
      }
      case 'N': {
        // why.
        const roll = Math.floor(Math.random() * 100); // 0 - 99
        if (roll < 5) {
          return 'R';
        } else {
          return 'N';
        }
        break;
      }
      case 'GREEN':
      case 'R':
      default: {
        const roll = Math.floor(Math.random() * 100); // 0 - 99
        if (roll < 1) {
          return 'UR';
        } else if (roll < 5) {
          return 'SSR';
        } else if (roll < 20) {
          return 'SR';
        } else {
          return 'R';
        }
        break;
      }
    }
  }

  mapCharacterToCleanName(character) {
    switch (character) {
      case 'dia':
        return 'Kurosawa+Dia';
        break;
      case 'mari':
        return 'Ohara+Mari';
        break;
      case 'kanan':
        return 'Matsuura+Kanan';
        break;
      case 'chika':
      case 'mikan':
        return 'Takami+Chika';
        break;
      case 'you':
      case 'yousoro':
        return 'Watanabe+You';
        break;
      case 'riko':
        return 'Sakurauchi+Riko';
        break;
      case 'yohane':
      case 'yoshiko':
        return 'Tsushima+Yoshiko';
        break;
      case 'maru':
      case 'zura':
      case 'zuramaru':
      case 'hanamaru':
        return 'Kunikida+Hanamaru';
        break;
      case 'ruby':
      case 'wooby':
        return 'Kurosawa+Ruby';
        break;
      case 'eli':
        return 'Ayase+Eli';
        break;
      case 'nozomi':
        return 'Toujou+Nozomi';
        break;
      case 'trash':
      case 'nico':
        return 'Yazawa+Nico';
        break;
      case 'kotori':
        return 'Minami+Kotori';
        break;
      case 'honoka':
      case 'honkers':
        return 'Kousaka+Honoka';
        break;
      case 'umi':
        return 'Sonoda+Umi';
        break;
      case 'rin':
        return 'Hoshizora+Rin';
        break;
      case 'maki':
        return 'Nishikino+Maki';
        break;
      case 'hanayo':
        return 'Koizumi+Hanayo';
        break;
    }
  }

  mapIdolGroupToCleanIdolMainUnit(idol_group) {
    let cleaned_unit = idol_group.toLowerCase();
    switch (cleaned_unit) {
      case 'mu':
      case 'mus':
      case "mu's":
      case "μ's":
      case "μ":
      case "μs":
        // return "μ's";
        return '%CE%BC%27s';
        break;
      case "a-rise":
      case "arise":
        return 'A-RISE';
        break;
      case "aqours":
        return "Aqours";
      default:
        return null;
        break;
    }
  }

  /**
   * Rarity = "N", "R", "SR", "SSR", or "UR"
   *
   * @returns Card
   */
  getRandomCardByRarity(rarity = 'R', unit = 'Aqours') {
    // Entering mus in is likely to get messed up so type-cast it:
    let selected_unit = this.mapIdolGroupToCleanIdolMainUnit(unit);

    // return this.doSchoolidoluCall(
    //   '/api/cards/?rarity='+rarity+'&japan_only=false&ordering=random&page_size=1&idol_main_unit=' + selected_unit
    return this.doSchoolidoluCallWithFilters(
      {
        rarity: rarity,
        idol_main_unit: selected_unit,
      }
    ).then(
      (json_data) => {
        if (!json_data.results[0]) {
          throw new Error("Invalid response received from schoolido.lu");
        }
        return new Card(json_data.results[0]);
      }
    );
  }

  doSchoolidoluCallWithFilters(filters) {
    const defaults = {
      rarity: null,
      idol_main_unit: null,
      japan_only: 'false', // intentionally a string
      ordering: 'random',
      page_size: 1,
    };
    const query_parameters = Object.assign({}, defaults, filters);

    const base_path = '/api/cards/';
    let full_path = base_path + '?';
    Object.keys(query_parameters).forEach(key => {
      if (query_parameters[key] !== undefined && query_parameters[key] !== null) {
        full_path += `${key}=${query_parameters[key]}&`;
      }
    });

    return this.doSchoolidoluCall(full_path);
  };

  /**
   * Invokes an HTTP call on the provided path, then passes the returned body
   * to the callback in JSON-parsed object form.
   */
  doSchoolidoluCall(path) {
    console.log('schoolido.lu call: ' + path);
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
