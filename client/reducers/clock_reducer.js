'use strict';

import { CHANGE_LOCATION, INCREASE_HOUR, INCREASE_MINUTE, INCREASE_SECOND } from '../actions/clock_actions';

const stateDefault = {
  offset: null,
};

const handleChangeLocation = (state, action) => ({
  ...state,
  offset: action.offset,
});

function clockReducer (state = stateDefault, action) {
  switch(action.type) {
    case CHANGE_LOCATION:
      return handleChangeLocation(state, action);
    case INCREASE_HOUR:
      return;
    case INCREASE_MINUTE:
      return;
    case INCREASE_SECOND:
      return;
    default:
      return state;
  }
};

module.exports = clockReducer;
