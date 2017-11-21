'use strict';


class EquipmentRepository {

  static instanceOf(key) {
    if (key in EquipmentRepository.repo) {
      return EquipmentRepository.repo[key];
    }
    throw new Error(`No such item: ${key}`);
  }
}

EquipmentRepository.repo = {
  'item:weapon:longsword.medium.default': {
    type: 'weapon',
    name: 'Longsword',
    weapon: {
      class: 'martial_weapon',
      damage: '1d8',
      damage_type: 'S',
      attack_bonus: 1,
    },
    item: {
      size: 'S',
      weight: 8,
      material: 'iron',
    },
    prototype: true,
  },
  'item:weapon:longsword-1': {
    type: 'weapon',
    name: 'Longsword +1',
    weapon: {
      class: 'martial_weapon',
      damage: '1d8+1',
      damage_type: 'S',
      attack_bonus: 1,
    },
    item: {
      size: 'S',
      weight: 8,
      material: 'iron',
    },
    prototype: true,
  },
  'item:weapon:dagger': {
    type: 'weapon',
    name: 'Dagger',
    weapon: {
      class: 'simple_weapon',
      damage: '1d4',
      damage_type: 'S',
    },
    item: {
      size: 'F',
      weight: 0.25,
      material: 'iron',
    },
    prototype: true,
  },
  'item:armor:leather.medium.default': {
    type: 'armor',
    name: 'Leather Armor',
    armor: {
      class: 'light_armor',
      armor: 2,
      check_penalty: -1,
    },
    item: {
      size: 'S',
      weight: 20,
      material: 'iron',
    },
    prototype: true,
  },
  'item:armor:leather-1': {
    type: 'armor',
    name: 'Leather Armor +1',
    armor: {
      class: 'light_armor',
      armor: 2,
      check_penalty: -1,
      maximum_dex: 8,
    },
    item: {
      size: 'S',
      weight: 10,
      material: 'leather',
    },
    adjustments: [
      { attribute: 'armor_class', type: 'armor', value: 2 },
      { attribute: 'armor_class', type: 'armor_enhancement', value: 1 },
      { attribute: 'check_penalty', type: 'stacking', value: 1 },
    ],
    prototype: true,
  },
  'item:helmet:helmet-of-domination': {
    type: 'worn',
    name: 'The Helmet of Domination',
    worn: {
      slot: 'head',
      class: 'helmet',
      strength: 2,
      skills: [ 'skill:script:hello-world' ],
    },
    item: {
      size: 'T',
      weight: 2,
      material: 'cold_iron',
    },
    prototype: true,
  },

  'item:amulet:amulet-of-wisdom-2': {
    type: 'worn',
    name: 'Amulet of Wisdom (+2)',
    worn: {
      slot: 'wrists',
    },
    item: {
      size: 'D',
      weight: 1,
      material: 'crystal',
    },
    size: 'S',
    adjustments: [
      {attribute: 'wisdom', type: 'enhancement', value: 2}
    ],
    tags: [],
  },

  'item:amulet:amulet-of-wisdom-3': {
    type: 'worn',
    name: 'Amulet of Wisdom (+3)',
    worn: {
      slot: 'wrists',
    },
    item: {
      size: 'D',
      weight: 1,
      material: 'crystal',
    },
    size: 'S',
    adjustments: [
      {attribute: 'wisdom', type: 'enhancement', value: 3}
    ],
    tags: [],
  },

  'item:shield:large-steel-shield-1': {
    type: 'shield',
    name: 'Large Steel Shield +1',
    shield: {
      class: 'heavy_shield',
    },
    item: {
      size: 'S',
      weight: 5,
      material: 'steel',
    },
    adjustments: [
      { attribute: 'armor_class', type: 'shield', value: 2 },
      { attribute: 'armor_class', type: 'shield_enhancement', value: 1 },
      { attribute: 'check_penalty', type: 'stacking', value: 1 },
    ],
    prototype: true,
  },

  'item:cape:cape-of-lies': {
    type: 'worn',
    name: 'Cape of Lies',
    worn: {
      slot: 'back',
    },
    item: {
      size: 'S',
      weight: 1,
      material: 'spider_silk',
    },
    adjustments: [
      { attribute: 'bluff', type: 'insight', value: 2 },
      { attribute: 'diplomacy', type: 'insight', value: 2 },
    ],
    prototype: true,
  },

  'misc:small-rock': {
    type: 'misc',
    name: 'Small Rock',
    item: {
      size: 'D',
      weight: 0.8,
      material: 'stone',
    },
    prototype: true,
  },


};

module.exports = EquipmentRepository;
