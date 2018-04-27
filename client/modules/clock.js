'use strict';

// Actions

export const TIMEZONE_ADDED = 'TIMEZONE_ADDED';
export const TIMEZONE_DELETED = 'TIMEZONE_DELETED';
export const TIMEZONE_CHANGED = 'TIMEZONE_CHANGED';
export const TIMEZONE_NOT_SELECTED = 'TIMEZONE_NOT_SELECTED';

// Action Creators

export function addTimezone(timezones, regions, time_actives) {
  return {
    type: TIMEZONE_ADDED,
    timezones: timezones.concat(["None"]),
    regions: regions.concat(["Choose your city/region here"]),
    time_actives: time_actives.concat([false]),
  };
}

export function deleteTimezone(timezones, regions, time_actives, index) {
  const newTimezones = timezones.filter((e,i) => i !== index);
  const newRegions = regions.filter((e,i) => i !== index);
  const newTime_actives = time_actives.filter((e,i) => i !== index);
  return {
    type: TIMEZONE_DELETED,
    timezones: newTimezones,
    regions: newRegions,
    time_actives: newTime_actives,
  };
}

export function changeTimezone(timezones, regions, time_actives, index, new_timezone, new_region) {
  const newTimezones = timezones.map((e,i) => i === index ? new_timezone : e);
  const newRegions = regions.map((e,i) => i === index ? new_region : e);
  const newTime_actives = time_actives.map((e,i) => i === index ? true : e);
  return {
    type: TIMEZONE_CHANGED,
    timezones: newTimezones,
    regions: newRegions,
    time_actives: newTime_actives,
  };
}

export function clearTimezone(timezones, regions, time_actives, index) {
  const newTimezones = timezones.map((e,i) => i === index ? null : e);
  const newRegions = regions.map((e,i) => i === index ? null : e);
  const newTime_actives = time_actives.map((e,i) => i === index ? false : e);
  return {
    type: TIMEZONE_NOT_SELECTED,
    timezones: newTimezones,
    regions: newRegions,
    time_actives: newTime_actives,
  }
}

// Reducer

const stateDefault = {
  timezones: [""],
  regions: [""],
  time_actives: [false],
};

const handleAddTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  regions: action.regions,
  time_actives: action.time_actives,
});

const handleDeleteTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  regions: action.regions,
  time_actives: action.time_actives,
});

const handleChangeTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  regions: action.regions,
  time_actives: action.time_actives,
});

const handleClearTimezone = (state, action) => ({
  ...state,
  timezones: action.timezones,
  regions: action.regions,
  time_actives: action.time_actives,
});

export default function reducer (state = stateDefault, action = {}) {
  switch(action.type) {
    case TIMEZONE_ADDED:
      return handleAddTimezone(state, action);
    case TIMEZONE_DELETED:
      return handleDeleteTimezone(state, action);
    case TIMEZONE_CHANGED:
      return handleChangeTimezone(state, action);
    case TIMEZONE_NOT_SELECTED:
      return handleClearTimezone(state, action);
    default:
      return state;
  }
}

