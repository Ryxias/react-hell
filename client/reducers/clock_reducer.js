'use strict';

import CLOCK_ACTIONS from '../actions/clock_actions';

const stateDefault = {
  location: 'Choose your nearest city/region here',
};

const handleChangeLocation = (state, action) => ({
  location: action.location,
});

function clock(state = stateDefault, action) {
  switch(action.type) {
    case CLOCK_ACTIONS.CHANGE_LOCATION:
      return handleChangeLocation(state, action);
    case CLOCK_ACTIONS.INCREASE_HOUR:
      return;
    case CLOCK_ACTIONS.INCREASE_MINUTE:
      return;
    case CLOCK_ACTIONS.INCREASE_SECOND:
      return;
    default:
      return state;
  }
};

module.exports = clock;
