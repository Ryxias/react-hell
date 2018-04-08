'use strict';

import { CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } from '../actions/clock_actions';

const stateDefault = {
  timezone: null,
};

const handleChangeTimezone = (state, action) => ({
  ...state,
  time_active: true,
  timezone: action.timezone,
});

const handleClearTimezoneText = (state, action) => ({
  ...state,
  time_active: false,
});

export function clockReducer(state = stateDefault, action) {
  switch(action.type) {
    case CHANGE_TIMEZONE:
      return handleChangeTimezone(state, action);
    case CLEAR_TIMEZONETEXT:
      return handleClearTimezoneText(state, action);
    default:
      return state;
  }
}

