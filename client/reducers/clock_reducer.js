'use strict';

import { TIMEZONE_ADDED, TIMEZONE_CHANGED, TIMEZONE_NOT_SELECTED } from '../actions/clock_actions';

const stateDefault = {
  timezones: [""],
  time_actives: [false],
};

const handleAddTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

const handleChangeTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

const handleClearTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

export function clockReducer(state = stateDefault, action) {
  switch(action.type) {
    case TIMEZONE_ADDED:
      return handleAddTimezone(state, action);
    case TIMEZONE_CHANGED:
      return handleChangeTimezone(state, action);
    case TIMEZONE_NOT_SELECTED:
      return handleClearTimezone(state, action);
    default:
      return state;
  }
}

