'use strict';

const { ADD_TIMEZONE, CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } = require('./clock_actions');

function addTimezone(timezones, time_actives, new_timezone) {
  return {
    type: ADD_TIMEZONE,
    timezones: timezones.concat([new_timezone]),
    time_actives: time_actives.concat([false]),
  };
}

function changeTimezone(timezones, time_actives, index, new_timezone) {
  const newTimezones = timezones.concat();
  newTimezones[index] = new_timezone;
  const newTime_actives = time_actives.concat();
  newTime_actives[index] = true;
  return {
    type: CHANGE_TIMEZONE,
    timezones: newTimezones,
    time_actives: newTime_actives,
  };
}

function clearTimezoneText(timezones, time_actives, index) {
  const newTimezones = timezones.concat();
  newTimezones[index] = null;
  const newTime_actives = time_actives.concat();
  newTime_actives[index] = false;
  return {
    type: CLEAR_TIMEZONETEXT,
    timezones: newTimezones,
    time_actives: newTime_actives,
  }
}

module.exports = {
  addTimezone,
  changeTimezone,
  clearTimezoneText,
};
