import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'; // mock Redux store
import { configure, shallow } from 'enzyme';  // shallow rendering to only render top level
import Adapter from 'enzyme-adapter-react-16';  // for Enzyme

import ConnectedWorldClockContainer,
      { WorldClockContainer } from '../../../../client/components/WorldClock/WorldClockContainer';
import WorldClockSelection from '../../../../client/components/WorldClock/WorldClockSelection';
import WorldClockButtons from '../../../../client/components/WorldClock/WorldClockButtons';
import WorldClockDisplay from '../../../../client/components/WorldClock/WorldClockDisplay';

configure({ adapter: new Adapter() }); // Enzyme expects an adapter to be configured,
                                       // before using any of Enzyme's top level APIs, where `Adapter` is the adapter
                                       // corresponding to the library currently being tested.

test('Stub function for testing jest functionality', () => {
  expect(true).toBe(true);
});

describe('WorldClockContainer component', () => {
  const stateDefault = {
    timezones: [""],
    time_actives: [false],
  };
  const mockStore = configureStore();
  let store, container, connectedContainer;

  beforeEach(() => {
    store = mockStore(stateDefault);
    container = shallow(<WorldClockContainer store={store} timezones={stateDefault.timezones} time_actives={stateDefault.time_actives} />);
  });

  it('should render the WorldClockContainer component', () => {
    expect(container.length).toEqual(1);
  });

  it('should have ClockSelection child component when it is initially rendered', () => {
    expect(container.find(WorldClockSelection).length).toEqual(1);
  });

  it('should have ClockButtons child component when it is initially rendered', () => {
    expect(container.find(WorldClockButtons).length).toEqual(1);
  });

  it('should NOT have ClockDisplay child component when it is initially rendered', () => {
    expect(container.find(WorldClockDisplay).length).toEqual(0);
  });
});
