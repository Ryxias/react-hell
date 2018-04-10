'use strict';

import { ADD_TIMEZONE, CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } from '../actions/clock_actions';

const stateDefault = {
  timezones: [null],
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

const handleClearTimezoneText = (state, action) => ({
  ...state,
  time_actives: action.time_actives,
});

export function clockReducer(state = stateDefault, action) {
  switch(action.type) {
    case ADD_TIMEZONE:
      return handleAddTimezone(state, action);
    case CHANGE_TIMEZONE:
      return handleChangeTimezone(state, action);
    case CLEAR_TIMEZONETEXT:
      return handleClearTimezoneText(state, action);
    default:
      return state;
  }
}

