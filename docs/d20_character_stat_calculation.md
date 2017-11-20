# d20 Character Stat Calculation

This document describes the way character stats are accumulated in d20 Pathfinder, and how the
d20 stat calculation engine algorithm for calculating this stuff works.


## The Stats

### Accumulated Stats


* Final Hit points
* Specific saving throws vs. certain types 
* Specific armor class vs. certain types
* Damage reduction
* Spell resistance



## Layers

Stats are calculated in "Layers".  Each layer comprises effects that together cannot affect one another, but work
in tandem to accumulate stat totals. 

In general, follow this formula:

```
Accumulations = Foundations + Adjustments + Conditionals
```




### Accumulations

#### Hit points

#### Skills

#### Saves

#### Armor Class

#### Initiative

#### Attacks



### Conditionals

Conditional effects are not universally applied; they only happen when an *external* condition is met.  As such,
they only trigger when events occur that contain a particular tag.

Speaking of which, all events that occur contain tags.  Simple events such as a melee attack from a dwarf could
contain tags such as "dwarf" and "melee" and "axe".  Damage types are also sent as tags; "slashing".  Size can 
also be sent "medium".  In total, all events comprise many different tags.

Conditional effects listen on and are triggered by the existence or value of certain tags.  For example, dwarves
gain a +4 armor class vs. giants.  When an incoming attack comes with the tag "giant", the dwarf's conditional AC
effect triggers, granting an immediate +4 to armor class versus that event.  Neat!


#### Natural Inbound Attack Types
The aforementioned 

#### Spell or Effect Types
For example, elves' bonus on saves versus enchantment and sleep effects.



### Adjustments
Adjustments are the next layer of attributes.  These exist typically as:

* Temporary or semi-permanent **non-conditional** effects
* Effects unique to the current individual
* Modifiers

Adjustments are never base stats.

#### Damage

#### Temporary or Semi-permanent Personal Buffs

#### Equipment and Held Items


### Foundations

The foundations layer comprises stats that are intrinsic to the character itself; stats that can (almost) never change,
and stats that are never temporarily modified.

Foundation stats **almost never** have *types*.  They are not modifiers; they are base values.

#### Class Levels

* base saves
* hit points
* variety of other crap
* skill points

#### Racial Hit Die

* hit points
* base saves
* skill points

#### Base Race


* Certain conditionals

Races also contribute to these stats upon first selection, but we consider this a one-time contribution and
thus we don't factor this into the runtime calculation aspect.

* age
* base size 
* base ability scores
* base natural attack



#### Base ability scores

#### Base Size

#### Ability Modifiers

This is the strange one.  Ability modifiers are derived from Accumulated ability scores, which may be subject
to temporary modifiers.  However, the ability modifiers themselves are not modifiable in any permanent fashion,
and have no type.  As such, they are treated as foundational attributes, cascaded from the accumulated 
ability scores.

