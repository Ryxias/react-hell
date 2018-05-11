'use strict';

import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'; // mock Redux store
import { configure, shallow, mount } from 'enzyme';  // shallow rendering to only render top level
import Adapter from 'enzyme-adapter-react-16';  // for Enzyme
import { Provider } from 'react-redux';

import ConnectedWorldClockContainer,
      { WorldClockContainer } from '../../../../client/components/WorldClock/WorldClockContainer';
import WorldClockSelection from '../../../../client/components/WorldClock/WorldClockSelection';
import WorldClockButtons from '../../../../client/components/WorldClock/WorldClockButtons';
import WorldClockDisplay from '../../../../client/components/WorldClock/WorldClockDisplay';

import clockReducers, { addTimezone, changeTimezone, clearTimezone, deleteTimezone, TIMEZONE_ADDED, TIMEZONE_CHANGED, TIMEZONE_NOT_SELECTED, TIMEZONE_DELETED } from '../../../../client/modules/clock';


/*
 * Because of testEnvironment variable in global jest config being 'node', jsdom-dependent methods
 * like 'mount' will not work unless we explicitly import and deploy jsdom into our individual DOM tests.
 * Reference: https://github.com/airbnb/enzyme/issues/341
 */

import jsdomGlobal from 'jsdom-global';
jsdomGlobal();

configure({ adapter: new Adapter() }); // Enzyme expects an adapter to be configured,
                                       // before using any of Enzyme's top level APIs, where `Adapter` is the adapter
                                       // corresponding to the library currently being tested.

describe('WorldClockContainer component (initial state)', () => {
  const stateDefault = {
    clock: {
      timezones: [""],
      regions: [""],
      time_actives: [false],
    },
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(stateDefault);
    container = shallow(<WorldClockContainer store={store}
                                             timezones={stateDefault.clock.timezones}
                                             regions={stateDefault.clock.regions}
                                             time_actives={stateDefault.clock.time_actives} />);
  });

  it('should render the WorldClockContainer component', () => {
    expect(container.length).toEqual(1);
  });

  it('should have WorldClockSelection child component when it is initially rendered', () => {
    expect(container.find(WorldClockSelection).length).toEqual(1);
  });

  it('should have WorldClockButtons child component when it is initially rendered', () => {
    expect(container.find(WorldClockButtons).length).toEqual(1);
  });

  it('should NOT have WorldClockDisplay child component when it is initially rendered', () => {
    expect(container.find(WorldClockDisplay).length).toEqual(0);
  });

  it('should have selectIndex prop properly passed into WorldClockSelection', () => {
    expect(typeof container.find(WorldClockSelection).prop('selectIndex') === "number").toBe(true);
  });

  it('should have addClock method prop properly passed into WorldClockButtons', () => {
    expect(typeof container.find(WorldClockButtons).prop('addClock') === "function").toBe(true);
  });
});

describe('WorldClockContainer component (active state)', () => {
  const stateDefault = {
    clock: {
      timezones: ["America/Los_Angeles"],
      regions: ["San Francisco"],
      time_actives: [true],
    },
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(stateDefault);
    container = shallow(<WorldClockContainer store={store}
                                             timezones={stateDefault.clock.timezones}
                                             regions={stateDefault.clock.regions}
                                             time_actives={stateDefault.clock.time_actives} />);
  });

  it('should render the WorldClockContainer component', () => {
    expect(container.length).toEqual(1);
  });

  it('should have WorldClockDisplay child component when states are active', () => {
    expect(container.find(WorldClockDisplay).length).toEqual(1);
  });

  it('should have timezone prop properly passed into WorldClockDisplay', () => {
    expect(container.find(WorldClockDisplay).prop('timezone')).toEqual(stateDefault.clock.timezones[0]);
  });

  it('should have region prop properly passed into WorldClockDisplay', () => {
    expect(container.find(WorldClockDisplay).prop('region')).toEqual(stateDefault.clock.regions[0]);
  });

  it('should have unixtimestamp prop properly passed into WorldClockDisplay', () => {
    expect(typeof container.find(WorldClockDisplay).prop('unixtimestamp') === "number").toBe(true);
  });
});

describe('ConnectedWorldClockContainer component (active state) --- ACTIONS', () => {
  const stateDefault = {
    clock: {
      timezones: ["America/Los_Angeles", "Pacific/Honolulu", "Asia/Tokyo"],
      regions: ["San Francisco", "Hawaii", "Japan"],
      time_actives: [true, true, true, true],
    },
  };
  const mockStore = configureStore();
  let store, connectedContainer;

  beforeEach(() => {
    store = mockStore(stateDefault);
    connectedContainer = mount(
      <Provider store={store}>
        <ConnectedWorldClockContainer
          timezones={stateDefault.clock.timezones}
          regions={stateDefault.clock.regions}
          time_actives={stateDefault.clock.time_actives} />
      </Provider>);
  });

  it('should render the WorldClockContainer component', () => {
    expect(connectedContainer.length).toEqual(1);
  });

  it('should get appropriate actions for each dispatch', () => {
    let action;
    store.dispatch(addTimezone(stateDefault.clock.timezones, stateDefault.clock.regions, stateDefault.clock.time_actives));
    store.dispatch(changeTimezone(stateDefault.clock.timezones, stateDefault.clock.regions, stateDefault.clock.time_actives, 0, "America/New_York", "New York"));
    store.dispatch(clearTimezone(stateDefault.clock.timezones, stateDefault.clock.regions, stateDefault.clock.time_actives, 0));
    store.dispatch(deleteTimezone(stateDefault.clock.timezones, stateDefault.clock.regions, stateDefault.clock.time_actives, 0));
    action = store.getActions();
    expect(action[0].type).toBe(TIMEZONE_ADDED);
    expect(action[1].type).toBe(TIMEZONE_CHANGED);
    expect(action[2].type).toBe(TIMEZONE_NOT_SELECTED);
    expect(action[3].type).toBe(TIMEZONE_DELETED);
  });
});

describe('ConnectedWorldClockContainer component (active state) --- REDUCERS', () => {
  const stateDefault = {
    clock: {
      timezones: ["America/Los_Angeles", "Pacific/Honolulu", "Asia/Tokyo"],
      regions: ["San Francisco", "Hawaii", "Japan"],
      time_actives: [true, true, true],
    },
  };
  const mockStore = configureStore();
  let store;

  beforeEach(() => {
    store = mockStore(stateDefault);
  });

  it('should run the appropriate reducer for TIMEZONE_ADDED action', () => {
    let state = stateDefault.clock;
    const action = {
      type: TIMEZONE_ADDED,
      timezones: state.timezones.concat(["None"]),
      regions: state.regions.concat(["Choose your city/region here"]),
      time_actives: state.time_actives.concat([false]),
    };
    state = clockReducers(state, action);
    expect(state).toEqual({
        timezones: ["America/Los_Angeles", "Pacific/Honolulu", "Asia/Tokyo", "None"],
        regions: ["San Francisco", "Hawaii", "Japan", "Choose your city/region here"],
        time_actives: [true, true, true, false],
    });
  });

  it('should run the appropriate reducer for TIMEZONE_CHANGED action', () => {
    let state = stateDefault.clock;
    const action = {
      type: TIMEZONE_CHANGED,
      timezones: state.timezones.map((e,i) => i === 0 ? "America/New_York" : e),
      regions: state.regions.map((e,i) => i === 0 ? "New York" : e),
      time_actives: state.time_actives.map((e,i) => i === 0 ? true : e),
    };
    state = clockReducers(state, action);
    expect(state).toEqual({
      timezones: ["America/New_York", "Pacific/Honolulu", "Asia/Tokyo"],
      regions: ["New York", "Hawaii", "Japan"],
      time_actives: [true, true, true],
    });
  });

  it('should run the appropriate reducer for TIMEZONE_NOT_SELECTED action', () => {
    let state = stateDefault.clock;
    const action = {
      type: TIMEZONE_NOT_SELECTED,
      timezones: state.timezones.map((e,i) => i === 0 ? "None" : e),
      regions: state.regions.map((e,i) => i === 0 ? "Choose your city/region here" : e),
      time_actives: state.time_actives.map((e,i) => i === 0 ? false : e),
    };
    state = clockReducers(state, action);
    expect(state).toEqual({
      timezones: ["None", "Pacific/Honolulu", "Asia/Tokyo"],
      regions: ["Choose your city/region here", "Hawaii", "Japan"],
      time_actives: [false, true, true],
    });
  });

  it('should run the appropriate reducer for TIMEZONE_DELETED action', () => {
    let state = stateDefault.clock;
    const action = {
      type: TIMEZONE_DELETED,
      timezones: state.timezones.filter((e,i) => i !== 0),
      regions: state.regions.filter((e,i) => i !== 0),
      time_actives: state.time_actives.filter((e,i) => i !== 0),
    };
    state = clockReducers(state, action);
    expect(state).toEqual({
      timezones: ["Pacific/Honolulu", "Asia/Tokyo"],
      regions: ["Hawaii", "Japan"],
      time_actives: [true, true],
    });
  });
});

