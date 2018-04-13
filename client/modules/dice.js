'use strict';

// Actions
const DICE_ADDED = 'DICE_ADDED';
const DICE_CLEARED = 'DICE_CLEARED';
const DICE_ROLLED = 'DICE_ROLLED';

// Action Creators
export function addDice(die_size) {
  return {
    type: DICE_ADDED,
    dieSize: die_size,
  };
}

export function clearDice() {
  return {
    type: DICE_CLEARED,
  }
}

export function rollDice(dice) {
  // We have an impure action creator here... no big deal I guess
  const rolls = dice.map(die_size => Math.floor((Math.random() * die_size)) + 1);

  return {
    type: DICE_ROLLED,
    dice,
    rolls,
  };
}

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case DICE_ADDED: {
      const newState = Object.assign({}, state);
      const { dieSize } = action;

      newState.dice = newState.dice || [];
      newState.dice = newState.dice.concat(dieSize); // Dont use .push() because it mutates

      return newState;
    }
    case DICE_CLEARED: {
      const newState = Object.assign({}, state);
      newState.dice = [];
      newState.rolls = [];
      return newState;
    }
    case DICE_ROLLED: {
      const newState = Object.assign({}, state);
      const dice = action.dice;
      newState.rolls = action.rolls || [];
      newState.rollTotal = action.rolls.reduce((a,b) => a+b,0);

      // Perform deterministic statistical analysis of dice here
      const minimum  = dice.length || 0;
      const maximum  = dice.reduce((a,b) => a+b,0);
      const median   = (minimum + maximum) / 2;
      const num_dice = dice.length || 0;

      const distribution_distance = maximum - median; // Defines a "range" of data

      // Variance becomes a ratio of how far away from the median the roll is.
      // DISCLAIMER; this isn't the traditional definition of "variance"
      newState.variance = Math.abs(newState.rollTotal - median) / distribution_distance;
      newState.negative_variance = newState.rollTotal < median;

      // I used http://anydice.com/ to calculate some of this PURELY ANECDOTAL DATA
      // I used "at most" filter
      //
      // At 1d20, 5% is 20 and 15% is 18
      //     Range 1 - 20. Median 10.5, distribution 9.5. (which is 0.9999 and 0.789)
      // At 2d20, the 5% is around 7~ and 15% is around 12~
      //     Range 2 - 40. Median 21. Distribution 19. (which is .737 and .474 variance respectively)
      // At 3d20, the 5% is around 15~ and the 15% is around 21~
      //      Range 3 - 60. Median 31.5. Distribution 28.5. (0.579 and 0.368)
      // At 4d20, the 5% is around 23~ and the 15% is around 30~
      //      Range 4 - 80. Median 42. Distribution 38. (0.5 and 0.316)
      // At 6d20, the 5% is around 40~ and the 15% is around 48~
      //      Range 6 - 120. Median 63. Distribution 57. (0.40 and 0.263)
      // @ 10d20, the 5% is around 75~ and the 15% is around 86~
      //      Range 10 - 200. Median = 105. Distribution = 95. (0.315 and 0.200)

      // I used http://www.xuru.org/rt/PR.asp#Manually to manually plot a polynomial fit function
      const high_variance_threshold = ((num_dice) => {
        // y = -4.203703817·10-4 x5 + 1.096759285·10-2 x4 - 1.081851873·10-1 x3 + 5.172546373·10-1 x2 - 1.260950012 x + 1.63033334
        // With R^2 == 1 (basically)
        return ((-0.0004203703817 * Math.pow(num_dice, 5))
          + (0.01096759285 * Math.pow(num_dice, 4))
          - (0.1081851873 * Math.pow(num_dice, 3))
          + (0.5172546373 * Math.pow(num_dice, 2))
          - (1.260950012 * num_dice)
          + 1.63033334).toFixed(2);
      })(num_dice);

      // On a d20, this is getting a 18 or a 3
      // On a 6d6 this is getting a 36 - 21 = 15 * 0.7 = 10.5 + 21 (32)
      //const high_variance_threshold = 0.7;


      const very_high_variance_threshold = ((num_dice) => {
        // y = 5.282881595·10-4 x4 - 1.322810411·10-2 x3 + 1.233185216·10-1 x2 - 5.512797263·10-1 x + 1.441154375
        // R2 = 0.999915265
        // LOL :P
        return ((0.0005282881595 * Math.pow(num_dice, 4))
          - (0.01322810411 * Math.pow(num_dice, 3))
          + (0.1233185216 * Math.pow(num_dice, 2))
          - (0.5512797263 * num_dice)
          + 1.441154375).toFixed(2);
      })(num_dice);
      // On a d20 this is getting a 20 or a 1
      // On a 6d6 this is getting a 35 / 36
      // This is generally considered a very good or very bad roll!
      //const very_high_variance_threshold = 0.9;

      newState.high_variance_threshold = high_variance_threshold;
      newState.high_variance_roll_threshold = Math.ceil(median + (high_variance_threshold * distribution_distance));
      newState.very_high_variance_threshold = very_high_variance_threshold;
      newState.very_high_variance_roll_threshold = Math.ceil(median + (very_high_variance_threshold * distribution_distance));
      newState.high_variance = newState.variance >= high_variance_threshold;
      newState.very_high_variance = newState.variance >= very_high_variance_threshold;

      return newState;
    }
    default:
      return state;
  }
}

