'use strict';

const { CHANGE_TIMEZONE } = require('./clock_actions');

function changeTimezone(offset) {
  let time = new Date();  // local time object
  let second = time.getUTCSeconds();
  let hour = time.getUTCHours() + parseInt(Math.floor(offset)) < 0 ? time.getUTCHours() + parseInt(Math.floor(offset)) + 24 : time.getUTCHours() + parseInt(Math.floor(offset));
  let minute = time.getUTCMinutes();

  // Check for India time
  if (offset === "5.5") {
    if (time.getUTCMinutes() + 30 > 60) {
      minute = time.getUTCMinutes() - 30;
      hour += 1;
    } else {
      minute = time.getUTCMinutes() + 30;
    }
  }

  return {
    type: CHANGE_TIMEZONE,
    hour: hour,
    minute: minute,
    second: second,
  };
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
  // increaseHour,
  // increaseMinute,
  // increaseSecond,
  // increaseYear,
  // increaseMonth,
  // increaseDay,
  // resetMonth,
  // resetDay,
};
