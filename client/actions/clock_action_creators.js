'use strict';

const ACTIONS = require('./clock_actions');

function changeLocation(location) {
  return {
    type: ACTIONS.CHANGE_LOCATION,
    location: location,
  };
}

function increaseHour() {
 return {
   type: ACTIONS.INCREASE_HOUR,
   hour: hour + 1,
 };
}

function increaseMinute() {
 return {
   type: ACTIONS.INCREASE_MINUTE,
   minute: minute + 1,
 };
}

function increaseSecond() {
  return {
    type: ACTIONS.INCREASE_SECOND,
    second: second + 1,
  };
}

function increaseYear() {
  return {
    type: ACTIONS.INCREASE_YEAR,
    year: year + 1,
  };
}

function increaseMonth() {
  return {
    type: ACTIONS.INCREASE_MONTH,
    month: month + 1,
  };
}

function increaseDay() {
  return {
    type: ACTIONS.INCREASE_DAY,
    day: day + 1,
  };
}

function resetMonth() {
  return {
    type: ACTIONS.RESET_MONTH,
    month: 1,
  };
}

function resetDay() {
  return {
    type: ACTIONS.RESET_DAY,
    day: 1,
  };
}


module.exports = {
  changeLocation,
  increaseHour,
  increaseMinute,
  increaseSecond,
  increaseYear,
  increaseMonth,
  increaseDay,
  resetMonth,
  resetDay,
};
