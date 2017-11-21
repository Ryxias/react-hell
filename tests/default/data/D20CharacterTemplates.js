'use strict';

const CharacterData = require('../../../lib/d20/State/CharacterData');
const EquipmentRepository = require('../../../lib/d20/Data/EquipmentRepository');
const ClassRepository = require('../../../lib/d20/Data/ClassRepository');

class CharacterTemplates {

  static elinFighter() {
    return CharacterData.getTemplate();
  }

  static commoner() {
    return new CharacterData(COMMONER);
  }

}

const COMMONER = {
  'foundation:ability_scores:strength': 10,
  'foundation:ability_scores:dexterity': 9,
  'foundation:ability_scores:constitution': 10,
  'foundation:ability_scores:intelligence': 9,
  'foundation:ability_scores:wisdom': 10,
  'foundation:ability_scores:charisma': 9,
  'foundation:class_levels': [
    ClassRepository.classLevelWith('FIGHTER', 1, {
      hp_roll: 4,
      skill_ranks: { profession: 1 }
    }),
  ],
  'foundation:basics:race': 'human',
  'foundation:basics:size': 'M',
  'equipment': [

  ],
  'inventory': [

  ],
};


module.exports = CharacterTemplates;
