# d20 Game Design

This document talks about our roadmap for the d20 stuff.

## The Engine

The first step is building a workable d20 engine.  The most base component here is character stat management;
an enhancement to the [Pathfinder Autosheet](https://docs.google.com/spreadsheets/d/1eHaZJb4cH1P3q6riAj3tVZMeIdWcrPITAjfQVUaEJl8/edit#gid=1867984558).

Beyond character stat management are basic scripts that allow the management of turns, hit points, spell effects.
All of these scripts can be manual but ultimately builds to...

## The DM Tool

The d20 Engine would service a web-based tool that Dungeon Masters can use for the management of characters.
In its first iteration I imagine the following would be in-scope:

* Management of turn/initiative, position, character state/effects

And these would be out-of-scope:

* Management of rounds/times/actions
* Enforcement of game rules

The huge benefit here is that instead of referring to a character sheet and being confused between the character
sheet and temp effects, there would be no question what stats were.


## The Text-based Rogue-like

With a refined tool to battle-test the engine, we can move forward to build a real game.

The initial idea is a very hard PvE game, with primarily single-player elements, but with some loose multiplayer
connections, similar to Demon's Souls.

Players create a character (or have one generated for them).  They go into a dungeon and attempt to progress.
Eventually, they get killed and have to restart.  Just like any rogue-like, death is permanent.

Upon restarting the game, they must create a new character.  If they enter the same dungeon and progress up to 
the same point where they first died, they will find the corpse, and be able to pick up items.
