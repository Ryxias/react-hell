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
      adjustments: [
        { stat: 'fortitude_save', value: 1, type: 'no_type:class:fighter1' },
        { stat: 'base_attack_bonus', value: 1, type: 'no_type:class:fighter1' },
        { stat: 'hp_roll', value: 7, type: 'no_type:class:fighter1' },
      ],
      class_skills: [
        'climb', 'jump', 'swim',
      ],
      prototype: true,
    },
  }

};


module.exports = ClassRepository;
