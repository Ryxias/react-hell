'use strict';

import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store'; // mock Redux store
import { configure, shallow, mount } from 'enzyme';  // shallow rendering to only render top level
import Adapter from 'enzyme-adapter-react-16';  // for Enzyme
import { Provider } from 'react-redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

import ConnectedGachaAppContainer,
{ GachaAppContainer } from '../../../../client/components/Gacha/GachaAppContainer';
import GachaButtons from '../../../../client/components/Gacha/GachaButtons';
import GachaContent from '../../../../client/components/Gacha/GachaContent';
import GachaLoadingScreen from '../../../../client/components/Gacha/GachaLoadingScreen';

import gachaReducers, { shareCard, resetGacha, startGachaRoll, SHARE_STARTED, SHARE_SUCCESS, SHARE_FAILURE,
                        RESET_GACHA, START_GACHA_ROLL, RECEIVE_GACHA_ROLL, START_OPEN_CARD, CARD_OPENED }
                        from '../../../../client/modules/gacha';

// Instantiate router context
const router = {
  history: {},
  route: {
    location: {},
    match: {},
  },
};

const createContext = () => ({
  context: { router },
  childContextTypes: { router: {} },
});

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

describe('GachaAppContainer component (initial state --- LOADING)', () => {
  const stateDefault = {
    gacha: {
      card: {
        card_ext_link: "http://schoolido.lu/cards/36/R-Yazawa-Nico-Smile/",
        card_idolized_image_url: "https://i.schoolido.lu/c/36idolizedNico.png",
        card_image_url: "https://i.schoolido.lu/c/36Nico.png",
        card_status: { name: "Yazawa Nico" },
        card_title: "[36] Yazawa Nico",
        envelope_image_closed: "envelope_r1.png",
        envelope_image_open: "envelope_r2.png",
        id: 36,
        open_sound: {},
        rarity: "R",
      },
      isLoading: true,
    },
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(stateDefault);
    container = mount(<Provider store={store}>
                        <GachaAppContainer
                          resetGacha={resetGacha}
                          startGachaRoll={startGachaRoll}
                          shareCard={shareCard}
                          card={stateDefault.gacha.card}
                          isLoading={stateDefault.gacha.isLoading} />
                      </Provider>);
  });

  it('should render the GachaAppContainer component', () => {
    expect(container.length).toEqual(1);
  });

  it('should have GachaLoadingScreen child component when it is initially rendered', () => {
    expect(container.find(GachaLoadingScreen).length).toEqual(1);
  });

  it('should NOT have GachaContent child component when it is initially rendered', () => {
    expect(container.find(GachaContent).length).toEqual(0);
  });
});

describe('GachaAppContainer component (initial state --- LOADED)', () => {
  const stateDefault = {
    gacha: {
      card: {
        card_ext_link: "http://schoolido.lu/cards/36/R-Yazawa-Nico-Smile/",
        card_idolized_image_url: "https://i.schoolido.lu/c/36idolizedNico.png",
        card_image_url: "https://i.schoolido.lu/c/36Nico.png",
        card_status: { name: "Yazawa Nico" },
        card_title: "[36] Yazawa Nico",
        envelope_image_closed: "envelope_r1.png",
        envelope_image_open: "envelope_r2.png",
        id: 36,
        open_sound: {},
        rarity: "R",
      },
      isLoading: false,
    },
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(stateDefault);
    container = mount(<Provider store={store}>
                        <GachaAppContainer
                          resetGacha={resetGacha}
                          startGachaRoll={startGachaRoll}
                          shareCard={shareCard}
                          card={stateDefault.gacha.card}
                          isLoading={stateDefault.gacha.isLoading} />
                      </Provider>);
  });

  it('should render the GachaAppContainer component', () => {
    expect(container.length).toEqual(1);
  });

  it('should NOT have GachaLoadingScreen child component when it is initially rendered', () => {
    expect(container.find(GachaLoadingScreen).length).toEqual(0);
  });

  it('should have GachaContent child component when it is initially rendered', () => {
    expect(container.find(GachaContent).length).toEqual(1);
  });

  it('should have card prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('card') === "object").toBe(true);
  });

  it('should have handleRerollGacha prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('handleRerollGacha') === "function").toBe(true);
  });

  it('should have handleShareWaifu prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('handleShareWaifu') === "function").toBe(true);
  });

  it('should have handleEnvelopeOpen prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('handleEnvelopeOpen') === "function").toBe(true);
  });

  it('should have handleIdolCardClick prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('handleIdolCardClick') === "function").toBe(true);
  });

  it('should have animationPhase prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('animationPhase') === "string").toBe(true);
  });

  it('should have animationPhase prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('animationPhase') === "string").toBe(true);
  });

  it('should have idolized prop properly passed into GachaContent', () => {
    expect(typeof container.find(GachaContent).prop('idolized') === "boolean").toBe(true);
  });
});

describe('ConnectedGachaAppContainer component --- ACTIONS', () => {
  const stateDefault = {
    gacha: {
      card: {
        card_ext_link: "http://schoolido.lu/cards/36/R-Yazawa-Nico-Smile/",
        card_idolized_image_url: "https://i.schoolido.lu/c/36idolizedNico.png",
        card_image_url: "https://i.schoolido.lu/c/36Nico.png",
        card_status: { name: "Yazawa Nico" },
        card_title: "[36] Yazawa Nico",
        envelope_image_closed: "envelope_r1.png",
        envelope_image_open: "envelope_r2.png",
        id: 36,
        open_sound: {},
        rarity: "R",
      },
      isLoading: false,
    },
  };
  const mockStore = configureStore();
  mockAxios.onGet('/api/sif/roll').reply(200, { data: stateDefault.gacha.card });
  let store, connectedContainer;

  beforeEach(() => {
    store = mockStore(stateDefault);
    connectedContainer = mount(<Provider store={store}>
                        <GachaAppContainer
                          resetGacha={resetGacha}
                          startGachaRoll={startGachaRoll}
                          shareCard={shareCard}
                          card={stateDefault.gacha.card}
                          isLoading={stateDefault.gacha.isLoading} />
                      </Provider>);
  });

  it('should render the ConnectedGachaAppContainer component', () => {
    expect(connectedContainer.length).toEqual(1);
  });

  
});
