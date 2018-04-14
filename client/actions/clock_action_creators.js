'use strict';

const { TIMEZONE_ADDED, TIMEZONE_CHANGED, TIMEZONE_NOT_SELECTED } = require('./clock_actions');

function addTimezone(timezones, time_actives, new_timezone) {
  return {
    type: TIMEZONE_ADDED,
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
    type: TIMEZONE_CHANGED,
    timezones: newTimezones,
    time_actives: newTime_actives,
  };
}

function clearTimezone(timezones, time_actives, index) {
  const newTimezones = timezones.concat();
  newTimezones[index] = null;
  const newTime_actives = time_actives.concat();
  newTime_actives[index] = false;
  return {
    type: TIMEZONE_NOT_SELECTED,
    timezones: newTimezones,
    time_actives: newTime_actives,
  }
}

module.exports = {
  addTimezone,
  changeTimezone,
  clearTimezone,
};
