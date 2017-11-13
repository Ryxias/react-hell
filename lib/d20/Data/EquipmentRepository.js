'use strict';


class EquipmentRepository {




}

EquipmentRepository.repo = {
  'item:weapon:longsword.medium.default': {
    type: 'weapon',
    weapon: {
      class: 'martial_weapon',
      damage: '1d8',
      damage_type: 'S',
      attack_bonus: 1,
    },
    item: {
      size: 'T',
      weight: 8,
      material: 'iron',
    },
    prototype: true,
  },
  'item:armor:leather.medium.default': {
    type: 'armor',
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
  'item:helmet:helmet-of-domination': {
    type: 'worn',
    worn: {
      slot: 'helmet',
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
};

module.exports = EquipmentRepository;
