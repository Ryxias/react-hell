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

// describe('SIFNewCardsContainer component (initial state)', () => {
//   const stateDefault = {
//     aggregator: {
//       cards: {
//         "count": 1656,
//         "next": "http://schoolido.lu/api/cards/?ordering=-release_date&page=2&page_size=100",
//         "previous": null,
//         "results": [
//           {
//             "id": 1643,
//             "game_id": 1657,
//             "idol": {
//               "note": "To get the full idol object, use the parameter \"expand_idol\"",
//               "school": "Uranohoshi Girls' High School",
//               "name": "Watanabe You",
//               "year": "Second",
//               "chibi": "//i.schoolido.lu/chibi/iriel.png",
//               "main_unit": "Aqours",
//               "japanese_name": "渡辺 曜",
//               "chibi_small": "//i.schoolido.lu/chibi/small_You_Summer.png",
//               "sub_unit": "CYaRon!"
//             },
//             "japanese_collection": "マーメイド編",
//             "translated_collection": "Mermaids",
//             "rarity": "SR",
//             "attribute": "Cool",
//             "japanese_attribute": "クール",
//             "is_promo": false,
//             "promo_item": null,
//             "promo_link": null,
//             "release_date": "2018-07-15",
//             "japan_only": true,
//             "event": null,
//             "other_event": null,
//             "is_special": false,
//             "hp": 3,
//             "minimum_statistics_smile": 1980,
//             "minimum_statistics_pure": 3200,
//             "minimum_statistics_cool": 3860,
//             "non_idolized_maximum_statistics_smile": 2810,
//             "non_idolized_maximum_statistics_pure": 4030,
//             "non_idolized_maximum_statistics_cool": 4690,
//             "idolized_maximum_statistics_smile": 3090,
//             "idolized_maximum_statistics_pure": 4310,
//             "idolized_maximum_statistics_cool": 4970,
//             "skill": "Perfect Lock",
//             "japanese_skill": "海のロマン",
//             "skill_details": "For every 30 notes, there is a 55% chance of turning all goods and greats in the next 3 seconds into perfects. (Level 1)",
//             "japanese_skill_details": null,
//             "center_skill": "Cool Heart",
//             "center_skill_extra_type": null,
//             "center_skill_details": "Cool increases (+6%)",
//             "japanese_center_skill": "クール ハート",
//             "japanese_center_skill_details": "クールPがUPする(+6%)",
//             "card_image": "//i.schoolido.lu/c/1643You.png",
//             "card_idolized_image": "//i.schoolido.lu/c/1643idolizedYou.png",
//             "english_card_image": null,
//             "english_card_idolized_image": null,
//             "round_card_image": "//i.schoolido.lu/c/1643RoundYou.png",
//             "round_card_idolized_image": "//i.schoolido.lu/c/1643RoundIdolizedYou.png",
//             "english_round_card_image": null,
//             "english_round_card_idolized_image": null,
//             "video_story": null,
//             "japanese_video_story": null,
//             "website_url": "http://schoolido.lu/cards/1643/SR-Watanabe-You-Mermaids-Cool/",
//             "non_idolized_max_level": 60,
//             "idolized_max_level": 80,
//             "transparent_image": "//i.schoolido.lu/cards/transparent/1643Transparent.png",
//             "transparent_idolized_image": "//i.schoolido.lu/cards/transparent/1643idolizedTransparent.png",
//             "clean_ur": null,
//             "clean_ur_idolized": null,
//             "skill_up_cards": [],
//             "ur_pair": null,
//             "total_owners": 61,
//             "total_wishlist": 71,
//             "ranking_attribute": 26,
//             "ranking_rarity": 3,
//             "ranking_special": null
//           }],
//         },
//       filtered_list: [],
//       loading: false,
//     },
//   };
//   const mockStore = configureStore();
//   let store, container;
//
//   beforeEach(() => {
//     store = mockStore(stateDefault);
//     // Mock API requests
//     mockAxios.onGet("/api/sif/fetch").reply(config => {
//       console.log('GET HIT');
//       return [200, stateDefault.aggregator.cards];
//     });
//     container = mount(<Provider store={store}>
//                         <SIFNewCardsContainer
//                           fetchList={fetchList}
//                           filterCards={filterCards}
//                           cards={stateDefault.aggregator.cards}
//                           filtered_list={stateDefault.aggregator.filtered_list}
//                           loading={stateDefault.aggregator.loading} />
//                       </Provider>);
//   });
//
//   it('should render the SIFNewCardsContainer component', () => {
//     expect(container.length).toEqual(1);
//   });
// });
