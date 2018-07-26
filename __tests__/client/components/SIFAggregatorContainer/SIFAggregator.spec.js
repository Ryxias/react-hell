'use strict';

import React from 'react';
import configureStore from 'redux-mock-store'; // mock Redux store
import { configure, shallow, mount } from 'enzyme';  // shallow rendering to only render top level
import Adapter from 'enzyme-adapter-react-16';  // for Enzyme
import { Provider } from 'react-redux';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import jest from 'jest-mock';

const mockAxios = new MockAdapter(axios);

import SIFAggregatorContainer from '../../../../client/components/SIFAggregator/SIFAggregatorContainer';
import SIFTwitterContainer from '../../../../client/components/SIFAggregator/SIFTwitterContainer';
import ConnectedSIFNewCardsContainer, { SIFNewCardsContainer } from '../../../../client/components/SIFAggregator/SIFNewCardsContainer';

import aggregatorReducers, {
  fetchList, filterCards, FETCH_STARTED, FETCH_SUCCESS,
  CARDS_FILTERED
} from '../../../../client/modules/aggregator';

/**
 * Because of testEnvironment variable in global jest config being 'node', jsdom-dependent methods
 * like 'mount' will not work unless we explicitly import and deploy jsdom into our individual DOM tests.
 * Reference: https://github.com/airbnb/enzyme/issues/341
 */

import jsdomGlobal from 'jsdom-global';
import {SHARE_SUCCESS} from "../../../../client/modules/gacha";
import {RECEIVE_GACHA_ROLL} from "../../../../client/modules/gacha";
import {SHARE_STARTED} from "../../../../client/modules/gacha";
import {RESET_GACHA} from "../../../../client/modules/gacha";
import {START_GACHA_ROLL} from "../../../../client/modules/gacha";
jsdomGlobal();

configure({ adapter: new Adapter() }); // Enzyme expects an adapter to be configured,
                                       // before using any of Enzyme's top level APIs, where `Adapter` is the adapter
                                       // corresponding to the library currently being tested.

describe('SIFAggregatorContainer component (initial state)', () => {
  let container;

  beforeEach(() => {
    container = shallow(<SIFAggregatorContainer />);
  });

  it('should render the SIFAggregatorContainer component', () => {
    expect(container.length).toEqual(1);
  });
});

describe('SIFTwitterContainer component (initial state)', () => {
  let container;

  beforeEach(() => {
    container = shallow(<SIFTwitterContainer />);
  });

  it('should render the SIFTwitterContainer component', () => {
    expect(container.length).toEqual(1);
  });
});

describe('SIFAggregator --- ACTIONS', () => {

  const middleware = [ thunk ];
  const mockStore = configureStore(middleware);
  let store;
  // Mock Actions
  const mockActions = {
    fetchStarted: {type: FETCH_STARTED, loading: true},
    fetchSuccess: {type: FETCH_SUCCESS, "cards": {
        "results": [
          {
            "id": 1643,
            "game_id": 1657,
            "idol": {
              "name": "Watanabe You",
            },
            "translated_collection": "Mermaids",
            "attribute": "Cool",
            "release_date": "2018-07-15",
            "minimum_statistics_smile": 1980,
            "minimum_statistics_pure": 3200,
            "minimum_statistics_cool": 3860,
            "non_idolized_maximum_statistics_smile": 2810,
            "non_idolized_maximum_statistics_pure": 4030,
            "non_idolized_maximum_statistics_cool": 4690,
            "idolized_maximum_statistics_smile": 3090,
            "idolized_maximum_statistics_pure": 4310,
            "idolized_maximum_statistics_cool": 4970,
            "skill": "Perfect Lock",
            "skill_details": "For every 30 notes, there is a 55% chance of turning all goods and greats in the next 3 seconds into perfects. (Level 1)",
            "center_skill": "Cool Heart",
            "center_skill_details": "Cool increases (+6%)",
            "card_image": "//i.schoolido.lu/c/1643You.png",
            "card_idolized_image": "//i.schoolido.lu/c/1643idolizedYou.png",
            "website_url": "http://schoolido.lu/cards/1643/SR-Watanabe-You-Mermaids-Cool/",
          },
        ],
      }, loading: false},
    cardsFiltered: {type: CARDS_FILTERED},
  };

  describe('fetchList', () => {

    beforeEach(() => {
      const stateDefault = {
        aggregator: {
          cards: {
            "results": [
              {
                "id": 1643,
                "game_id": 1657,
                "idol": {
                  "name": "Watanabe You",
                },
                "translated_collection": "Mermaids",
                "attribute": "Cool",
                "release_date": "2018-07-15",
                "minimum_statistics_smile": 1980,
                "minimum_statistics_pure": 3200,
                "minimum_statistics_cool": 3860,
                "non_idolized_maximum_statistics_smile": 2810,
                "non_idolized_maximum_statistics_pure": 4030,
                "non_idolized_maximum_statistics_cool": 4690,
                "idolized_maximum_statistics_smile": 3090,
                "idolized_maximum_statistics_pure": 4310,
                "idolized_maximum_statistics_cool": 4970,
                "skill": "Perfect Lock",
                "skill_details": "For every 30 notes, there is a 55% chance of turning all goods and greats in the next 3 seconds into perfects. (Level 1)",
                "center_skill": "Cool Heart",
                "center_skill_details": "Cool increases (+6%)",
                "card_image": "//i.schoolido.lu/c/1643You.png",
                "card_idolized_image": "//i.schoolido.lu/c/1643idolizedYou.png",
                "website_url": "http://schoolido.lu/cards/1643/SR-Watanabe-You-Mermaids-Cool/",
              },
            ],
          },
          filtered_list: [],
          loading: false,
        },
      };
      mockAxios.onGet("/api/sif/fetch").reply(() => {
        return [200, stateDefault.aggregator.cards];
      });
      store = mockStore(stateDefault);
    });

    it('should fetch list of positive length', () => {
      return store.dispatch(fetchList()).then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions).toContainEqual(mockActions.fetchStarted);
        expect(expectedActions).toContainEqual(mockActions.fetchSuccess);
      });
    });
  });

  // describe('filterList', () => {
  //   beforeEach(() => {
  //     const stateDefault = {
  //       aggregator: {
  //         cards: {
  //           "results": [
  //             {
  //               "id": 1643,
  //               "game_id": 1657,
  //               "idol": {
  //                 "name": "Watanabe You",
  //               },
  //               "translated_collection": "Mermaids",
  //               "attribute": "Cool",
  //               "release_date": "2018-07-15",
  //               "minimum_statistics_smile": 1980,
  //               "minimum_statistics_pure": 3200,
  //               "minimum_statistics_cool": 3860,
  //               "non_idolized_maximum_statistics_smile": 2810,
  //               "non_idolized_maximum_statistics_pure": 4030,
  //               "non_idolized_maximum_statistics_cool": 4690,
  //               "idolized_maximum_statistics_smile": 3090,
  //               "idolized_maximum_statistics_pure": 4310,
  //               "idolized_maximum_statistics_cool": 4970,
  //               "skill": "Perfect Lock",
  //               "skill_details": "For every 30 notes, there is a 55% chance of turning all goods and greats in the next 3 seconds into perfects. (Level 1)",
  //               "center_skill": "Cool Heart",
  //               "center_skill_details": "Cool increases (+6%)",
  //               "card_image": "//i.schoolido.lu/c/1643You.png",
  //               "card_idolized_image": "//i.schoolido.lu/c/1643idolizedYou.png",
  //               "website_url": "http://schoolido.lu/cards/1643/SR-Watanabe-You-Mermaids-Cool/",
  //             },
  //             {
  //               "id": 1579,
  //               "game_id": 1593,
  //               "idol": {
  //                 "name": "Kunikida Hanamaru",
  //               },
  //               "translated_collection": "Fairy tale",
  //               "attribute": "Pure",
  //               "release_date": "2018-05-15",
  //               "minimum_statistics_smile": 3150,
  //               "minimum_statistics_pure": 3850,
  //               "minimum_statistics_cool": 2050,
  //               "non_idolized_maximum_statistics_smile": 3980,
  //               "non_idolized_maximum_statistics_pure": 4680,
  //               "non_idolized_maximum_statistics_cool": 2880,
  //               "idolized_maximum_statistics_smile": 4260,
  //               "idolized_maximum_statistics_pure": 4960,
  //               "idolized_maximum_statistics_cool": 3160,
  //               "skill": "Healer",
  //               "skill_details": "For every 21 notes, there is a 23% chance of recovering players HP by 4. (Level 1)",
  //               "center_skill": "Pure Heart",
  //               "center_skill_details": "Pure increases (+6%)",
  //               "card_image": "//i.schoolido.lu/c/1579Hanamaru.png",
  //               "card_idolized_image": "//i.schoolido.lu/c/1579idolizedHanamaru.png",
  //               "website_url": "http://schoolido.lu/cards/1579/SR-Kunikida-Hanamaru-Fairy-tale-Pure/",
  //             },
  //             {
  //               "id": 1580,
  //               "game_id": 1594,
  //               "idol": {
  //                 "name": "Ohara Mari",
  //               },
  //               "translated_collection": "Fairy tale",
  //               "attribute": "Smile",
  //               "release_date": "2018-05-15",
  //               "minimum_statistics_smile": 3860,
  //               "minimum_statistics_pure": 1950,
  //               "minimum_statistics_cool": 3230,
  //               "non_idolized_maximum_statistics_smile": 4690,
  //               "non_idolized_maximum_statistics_pure": 2780,
  //               "non_idolized_maximum_statistics_cool": 4060,
  //               "idolized_maximum_statistics_smile": 4970,
  //               "idolized_maximum_statistics_pure": 3060,
  //               "idolized_maximum_statistics_cool": 4340,
  //               "skill": "Perfect Lock",
  //               "skill_details": "For every 32 notes, there is a 44% chance of turning all goods and greats in the next 4 seconds into perfects. (Level 1)",
  //               "center_skill": "Smile Heart",
  //               "center_skill_details": "Smile increases (+6%)",
  //               "card_image": "//i.schoolido.lu/c/1580Mari.png",
  //               "card_idolized_image": "//i.schoolido.lu/c/1580idolizedMari.png",
  //               "website_url": "http://schoolido.lu/cards/1580/SR-Ohara-Mari-Fairy-tale-Smile/",
  //             }],
  //         },
  //         filtered_list: [],
  //         loading: false,
  //       },
  //     };
  //     store = mockStore(stateDefault);
  //   });
  //
  //   it('should fetch list of positive length', () => {
  //     store.dispatch(filterCards(stateDefault.aggregator.cards.results));
  //     const expectedActions = store.getActions();
  //     expect(expectedActions).to;
  //   });
  // });

});

describe('SIFNewCardsContainer component (initial state)', () => {
  const stateDefault = {
    aggregator: {
      cards: {
        "results": [
          {
            "id": 1643,
            "game_id": 1657,
            "idol": {
              "name": "Watanabe You",
            },
            "translated_collection": "Mermaids",
            "attribute": "Cool",
            "release_date": "2018-07-15",
            "minimum_statistics_smile": 1980,
            "minimum_statistics_pure": 3200,
            "minimum_statistics_cool": 3860,
            "non_idolized_maximum_statistics_smile": 2810,
            "non_idolized_maximum_statistics_pure": 4030,
            "non_idolized_maximum_statistics_cool": 4690,
            "idolized_maximum_statistics_smile": 3090,
            "idolized_maximum_statistics_pure": 4310,
            "idolized_maximum_statistics_cool": 4970,
            "skill": "Perfect Lock",
            "skill_details": "For every 30 notes, there is a 55% chance of turning all goods and greats in the next 3 seconds into perfects. (Level 1)",
            "center_skill": "Cool Heart",
            "center_skill_details": "Cool increases (+6%)",
            "card_image": "//i.schoolido.lu/c/1643You.png",
            "card_idolized_image": "//i.schoolido.lu/c/1643idolizedYou.png",
            "website_url": "http://schoolido.lu/cards/1643/SR-Watanabe-You-Mermaids-Cool/",
          },
          {
            "id": 1579,
            "game_id": 1593,
            "idol": {
              "name": "Kunikida Hanamaru",
            },
            "translated_collection": "Fairy tale",
            "attribute": "Pure",
            "release_date": "2018-05-15",
            "minimum_statistics_smile": 3150,
            "minimum_statistics_pure": 3850,
            "minimum_statistics_cool": 2050,
            "non_idolized_maximum_statistics_smile": 3980,
            "non_idolized_maximum_statistics_pure": 4680,
            "non_idolized_maximum_statistics_cool": 2880,
            "idolized_maximum_statistics_smile": 4260,
            "idolized_maximum_statistics_pure": 4960,
            "idolized_maximum_statistics_cool": 3160,
            "skill": "Healer",
            "skill_details": "For every 21 notes, there is a 23% chance of recovering players HP by 4. (Level 1)",
            "center_skill": "Pure Heart",
            "center_skill_details": "Pure increases (+6%)",
            "card_image": "//i.schoolido.lu/c/1579Hanamaru.png",
            "card_idolized_image": "//i.schoolido.lu/c/1579idolizedHanamaru.png",
            "website_url": "http://schoolido.lu/cards/1579/SR-Kunikida-Hanamaru-Fairy-tale-Pure/",
          },
          {
            "id": 1580,
            "game_id": 1594,
            "idol": {
              "name": "Ohara Mari",
            },
            "translated_collection": "Fairy tale",
            "attribute": "Smile",
            "release_date": "2018-05-15",
            "minimum_statistics_smile": 3860,
            "minimum_statistics_pure": 1950,
            "minimum_statistics_cool": 3230,
            "non_idolized_maximum_statistics_smile": 4690,
            "non_idolized_maximum_statistics_pure": 2780,
            "non_idolized_maximum_statistics_cool": 4060,
            "idolized_maximum_statistics_smile": 4970,
            "idolized_maximum_statistics_pure": 3060,
            "idolized_maximum_statistics_cool": 4340,
            "skill": "Perfect Lock",
            "skill_details": "For every 32 notes, there is a 44% chance of turning all goods and greats in the next 4 seconds into perfects. (Level 1)",
            "center_skill": "Smile Heart",
            "center_skill_details": "Smile increases (+6%)",
            "card_image": "//i.schoolido.lu/c/1580Mari.png",
            "card_idolized_image": "//i.schoolido.lu/c/1580idolizedMari.png",
            "website_url": "http://schoolido.lu/cards/1580/SR-Ohara-Mari-Fairy-tale-Smile/",
          }],
        },
      filtered_list: [],
      loading: false,
    },
  };
  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(stateDefault);
    // Mock API requests
    const mockFetchList = jest.fn(() => Promise.resolve(stateDefault.aggregator.cards));
    container = mount(<Provider store={store}>
                        <SIFNewCardsContainer
                          fetchList={mockFetchList}
                          filterCards={filterCards}
                          cards={stateDefault.aggregator.cards}
                          filtered_list={stateDefault.aggregator.filtered_list}
                          loading={stateDefault.aggregator.loading} />
                      </Provider>);
  });

  it('should render the SIFNewCardsContainer component', () => {
    expect(container.length).toEqual(1);
  });
});
