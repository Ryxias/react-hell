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
  console.log('what is timezones?', timezones);
  console.log('what is time_actives?', time_actives);
  console.log('what is index?', index);
  console.log('what is new_timezone?', new_timezone);
  const newTimezones = timezones.concat();
  newTimezones[index] = new_timezone;
  console.log('what is newTimezones?', newTimezones);
  const newTime_actives = time_actives.concat();
  newTime_actives[index] = true;
  console.log('what is newTime_actives?', newTime_actives);
  return {
    type: CHANGE_TIMEZONE,
    timezones: newTimezones,
    time_actives: newTime_actives,
  };
}

function clearTimezoneText(index) {
  const newTime_actives = time_actives.concat();
  newTime_actives[index] = false;
  return {
    type: CLEAR_TIMEZONETEXT,
    time_active: newTime_actives,
  }
}

module.exports = {
  addTimezone,
  changeTimezone,
  clearTimezoneText,
};
