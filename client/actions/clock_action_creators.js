'use strict';

const { CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } = require('./clock_actions');

function changeTimezone(offset) {
  let time = new Date();  // local time object
  let second = time.getUTCSeconds() < 10 ? '0' + time.getUTCSeconds().toString() : time.getUTCSeconds().toString();
  let militaryHour = time.getUTCHours() + parseInt(Math.floor(offset)) < 0 ? time.getUTCHours() + parseInt(Math.floor(offset)) + 24 : time.getUTCHours() + parseInt(Math.floor(offset));
  let minute = time.getUTCMinutes() < 10 ? '0' + time.getUTCMinutes().toString() : time.getUTCMinutes().toString();

  // Check for India time
  if (offset === "5.5") {
    if (time.getUTCMinutes() + 30 > 60) {
      minute = time.getUTCMinutes() - 30 < 10 ? '0' + (time.getUTCMinutes() - 30).toString() : (time.getUTCMinutes() - 30).toString();
      militaryHour += 1;
    } else {
      minute = time.getUTCMinutes() + 30 < 10 ? '0' + (time.getUTCMinutes() + 30).toString() : (time.getUTCMinutes() + 30).toString();
    }
  }

  // adjust for meridian time
  let meridian = '';
  let hour = militaryHour;
  if (militaryHour > 11) {
    meridian = 'PM';
    hour = militaryHour !== 12 ? hour - 12 : hour;
  } else {
    meridian = 'AM';
  }

  return {
    type: CHANGE_TIMEZONE,
    time_active: true,
    hour: hour,
    minute: minute,
    second: second,
    meridian: meridian,
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
