'use strict';

class SkillRepository {

  static allSkills() {
    return Object.keys(SkillRepository.repo);
  }

  static lookup(skill) {
    if (skill in SkillRepository.repo) {
      return SkillRepository.repo[skill];
    }
    throw new Error(`No such skill: ${skill}`);
  }
}

// http://www.d20pfsrd.com/skills/
SkillRepository.repo = {

  acrobatics: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: true,
  },

  appraise: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: true,
  },

  bluff: {
    armor_check: false,
    key_ability: 'charisma',
    untrained: true,
  },

  climb: {
    armor_check: true,
    key_ability: 'strength',
    untrained: true,
  },

  craft: { // FIXME Break this up to individual crafting skills
    armor_check: false,
    key_ability: 'intelligence',
    untrained: true,
  },

  diplomacy: {
    armor_check: false,
    key_ability: 'charisma',
    untrained: true,
  },

  disable_device: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: false,
  },

  disguise: {
    armor_check: false,
    key_ability: 'charisma',
    untrained: true,
  },

  escape_artist: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: true,
  },

  fly: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: true,
  },

  handle_animal: {
    armor_check: false,
    key_ability: 'charisma',
    untrained: false,
  },

  heal: {
    armor_check: false,
    key_ability: 'wisdom',
    untrained: false,
  },

  intimidate: {
    armor_check: false,
    key_ability: 'charisma',
    untrained: true,
  },

  knowledge_arcana: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_dungeoneering: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_engineering: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_geography: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_history: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_local: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_nature: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_nobility: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_planes: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  knowledge_religion: {
    armor_check: false,
    key_ability: 'intelligence',
    untrained: false,
  },

  linguistics: {
    key_ability: 'intelligence',
    gain_language: true,
    untrained: false,
  },

  perception: {
    key_ability: 'wisdom',
    untrained: true,
  },

  perform: { // FIXME break this up
    key_ability: 'charisma',
    untrained: true,
  },

  profession: { // FIXME break this up
    key_ability: 'wisdom',
    untrained: false,
  },

  ride: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: true,
  },

  sense_motive: {
    key_ability: 'wisdom',
    untrained: true,
  },

  sleight_of_hand: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: false,
  },

  spellcraft: {
    key_ability: 'intelligence',
    untrained: false,
  },

  stealth: {
    armor_check: true,
    key_ability: 'dexterity',
    untrained: true,
  },

  survival: {
    key_ability: 'wisdom',
    untrained: true,
  },

  swim: {
    armor_check: true,
    key_ability: 'strength',
    untrained: true,
  },

  use_magic_device: {
    key_ability: 'charisma',
    untrained: false,
  },
};

module.exports = SkillRepository;
