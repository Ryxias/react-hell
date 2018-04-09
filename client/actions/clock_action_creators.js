'use strict';

const { CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } = require('./clock_actions');

function changeTimezone(new_timezone) {
  return {
    type: CHANGE_TIMEZONE,
    timezone: new_timezone,
    time_active: true,
  };
}

function clearTimezoneText() {
  return {
    type: CLEAR_TIMEZONETEXT,
    time_active: false,
  }
}

module.exports = {
  changeTimezone,
  clearTimezoneText,
};
