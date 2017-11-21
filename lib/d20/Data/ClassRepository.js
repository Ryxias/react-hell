'use strict';

class ClassRepository {

  static classLevelWith(class_name, level, other = {}) {
    const structure = Object.assign({}, ClassRepository.repo[class_name][level], other);
    structure.prototype = false;
    return structure
  }

}

ClassRepository.repo = {

  FIGHTER: {
    1: {
      name: 'fighter1',
      class: 'fighter',
      level: 1,
      fort_save: 2, // FIXME (Derek) maybe move these under "adjustments" to be consistent?
      ref_save: 0,
      will_save: 0,
      bab: 1,
      hit_die: 10,
      base_skill_points: 2,
      class_skills: [
        'climb', 'jump', 'swim',
      ],
      prototype: true,


    },
    2: {
      name: 'fighter2',
      class: 'fighter',
      level: 2,
      fort_save: 1,
      ref_save: 0,
      will_save: 0,
      bab: 1,
      hit_die: 10,
      base_skill_points: 2,
      class_skills: [
        'climb', 'jump', 'swim',
      ],
      prototype: true,
    },
  },

  // FIXME temporary hack put this in the wrong place
  ELIN: {
    1: {
      name: 'elin1',
      race: 'elin_kind',
      level: 1,
      fort_save: 0,
      ref_save: 2,
      will_save: 2,
      bab: 0,
      hit_die: 6,
      base_skill_points: 8,
      class_skills: [
        'bluff', 'diplomacy', 'fly', 'sense_motive',
      ],
      prototype: true,
    },
  },

};


module.exports = ClassRepository;
