'use strict';

import { CHANGE_TIMEZONE, INCREASE_HOUR, INCREASE_MINUTE, INCREASE_SECOND } from '../actions/clock_actions';

const stateDefault = {
  hour: null,
  minute: null,
  second: null,
};

const handleChangeTimezone = (state, action) => ({
  ...state,
  hour: action.hour,
  minute: action.minute,
  second: action.second,
});

function clockReducer (state = stateDefault, action) {
  switch(action.type) {
    case CHANGE_TIMEZONE:
      return handleChangeTimezone(state, action);
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
