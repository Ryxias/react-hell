'use strict';

// Actions

const TIMEZONE_ADDED = 'TIMEZONE_ADDED';
const TIMEZONE_CHANGED = 'TIMEZONE_CHANGED';
const TIMEZONE_NOT_SELECTED = 'TIMEZONE_NOT_SELECTED';

// Action Creators

export function addTimezone(timezones, time_actives, new_timezone) {
  return {
    type: TIMEZONE_ADDED,
    timezones: timezones.concat([new_timezone]),
    time_actives: time_actives.concat([false]),
  };
}

export function changeTimezone(timezones, time_actives, index, new_timezone) {
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

export function clearTimezone(timezones, time_actives, index) {
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

// Reducer

const stateDefault = {
  timezones: [""],
  time_actives: [false],
};

const handleAddTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

const handleChangeTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

const handleClearTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  time_actives: action.time_actives,
});

export default function reducer (state = stateDefault, action = {}) {
  switch(action.type) {
    case TIMEZONE_ADDED:
      return handleAddTimezone(state, action);
    case TIMEZONE_CHANGED:
      return handleChangeTimezone(state, action);
    case TIMEZONE_NOT_SELECTED:
      return handleClearTimezone(state, action);
    default:
      return state;
  }
}

