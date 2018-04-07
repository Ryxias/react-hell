'use strict';

const ACTIONS = require('./clock_actions');

function changeLocation(location) {
  return {
    type: ACTIONS.CHANGE_LOCATION,
    location: location,
  };
}

function increaseHour() {
 return;
}

function increaseMinute() {
 return;
}

function increaseSecond() {
  return;
}

function increaseYear() {
  return;
}

function increaseMonth() {
  return;
}

function increaseDay() {
  return;
}

function resetMonth() {
  return;
}

function resetDay() {
  return;
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
