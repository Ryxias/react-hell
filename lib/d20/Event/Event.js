'use strict';

/**
 * All things in the game are modelled as EVENTS.
 *
 * Events encapsulate something happening in the game world.  A single event comprises a script
 * (or the logic/rules of how the event is resolved) as well as all of the data necessary to
 * calculate the results of the event.
 *
 * Events resolve() into a Result, which may contain further Events.
 */


const StandardMeleeAttackEvent = {
  type: 'standard_melee_attack',
  attacker: 'character1',
  defender: 'character2',
  apply: [
    { type: 'main_hand_weapon' },
    { type: 'attacker_prone' },
    { type: 'defender_prone' },
    { type: 'power_attack', value: 4 },
  ],
  random_seed: 'adlifjaweoiuf',
};

const DeclareAttackEvent = {
  type: 'declare_standard_attack',
};



const ResolveDamageRoll = {
  type: 'resolve_melee_damage',
  attacker: 'character1',
};

const RecieveDamageEvent = {
  type: 'receive_damage',
  subject: 'character2',
  amount: 6,
  damage_type: 'slashing',
  apply: [

  ],
};
