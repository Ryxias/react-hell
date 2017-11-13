# Brainstorm Character Stats




Model Derived Stats as ...

{
  name: "ranged_attack_bonus",
  script: () => {
    // calculates the value
  },
  dependencies: [
    // array of other stats it "listens" to; any changes to these 
    // stats forces a recompute
  ],
}


For example: 
{
  name: "skill:stealth:total",
  script: () => {
    return stat('skill:stealth:ranks') + stat('skill:stealth:class') + stat('ability:dexterity:modifier')
         - stat('encumbrance:check_penalty')
  },
  dependencies: [
    'skill:stealth:ranks',
    'skill:stealth:class',
    'ability:dexterity:modifier',
    'encumbrance:check_penalty',
  ]
}

{
  name: "ability_score:strength",
  script: () => {
    return 
  }
}

