'use strict';

import { CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT, INCREASE_HOUR, INCREASE_MINUTE, INCREASE_SECOND } from '../actions/clock_actions';

const stateDefault = {
  time_active: false,
  hour: null,
  minute: null,
  second: null,
  meridian: '',
};

const handleChangeTimezone = (state, action) => ({
  ...state,
  time_active: action.time_active,
  hour: action.hour,
  minute: action.minute,
  second: action.second,
  meridian: action.meridian,
});

const handleClearTimezoneText = (state, action) => ({
  ...state,
  time_active: action.time_active,
});

function clockReducer (state = stateDefault, action) {
  switch(action.type) {
    case CHANGE_TIMEZONE:
      return handleChangeTimezone(state, action);
    case CLEAR_TIMEZONETEXT:
      return handleClearTimezoneText(state, action);
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
