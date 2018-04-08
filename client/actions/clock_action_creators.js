'use strict';

const { CHANGE_TIMEZONE, CLEAR_TIMEZONETEXT } = require('./clock_actions');

function changeTimezone(offset) {
  let time = new Date();  // local time object
  let second = time.getUTCSeconds();
  let militaryHour = time.getUTCHours() + parseInt(Math.floor(offset)) < 0 ? time.getUTCHours() + parseInt(Math.floor(offset)) + 24 : time.getUTCHours() + parseInt(Math.floor(offset));
  let minute = time.getUTCMinutes();

  // Check for India time
  if (offset === "5.5") {
    if (time.getUTCMinutes() + 30 > 60) {
      minute = time.getUTCMinutes() - 30;
      militaryHour += 1;
    } else {
      minute = time.getUTCMinutes() + 30;
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



// function increaseHour() {
//  return {
//    type: ACTIONS.INCREASE_HOUR,
//    hour: hour + 1,
//  };
// }
//
// function increaseMinute() {
//  return {
//    type: ACTIONS.INCREASE_MINUTE,
//    minute: minute + 1,
//  };
// }
//
// function increaseSecond() {
//   return {
//     type: ACTIONS.INCREASE_SECOND,
//     second: second + 1,
//   };
// }
//
// function increaseYear() {
//   return {
//     type: ACTIONS.INCREASE_YEAR,
//     year: year + 1,
//   };
// }
//
// function increaseMonth() {
//   return {
//     type: ACTIONS.INCREASE_MONTH,
//     month: month + 1,
//   };
// }
//
// function increaseDay() {
//   return {
//     type: ACTIONS.INCREASE_DAY,
//     day: day + 1,
//   };
// }
//
// function resetMonth() {
//   return {
//     type: ACTIONS.RESET_MONTH,
//     month: 1,
//   };
// }
//
// function resetDay() {
//   return {
//     type: ACTIONS.RESET_DAY,
//     day: 1,
//   };
// }


module.exports = {
  changeTimezone,
  clearTimezoneText,
  // increaseHour,
  // increaseMinute,
  // increaseSecond,
  // increaseYear,
  // increaseMonth,
  // increaseDay,
  // resetMonth,
  // resetDay,
};
