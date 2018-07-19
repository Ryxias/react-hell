'use strict';

import { alert } from './alert';
import Card from '../../lib/SchoolIdo.lu/Card';

/**
 * ACTIONS
 */
export const FETCH_STARTED = 'news/FETCH_STARTED';
export const FETCH_SUCCESS = 'news/FETCH_SUCCESS';
export const CARDS_FILTERED = 'news/CARDS_FILTERED';

export function fetchList() {
  return (dispatch) => {
    dispatch({
      type: FETCH_STARTED,
      loading: true,
    });

    const axios = require('axios'); // FIXME (derek) refactor with the Api Client
    return axios.get("/api/sif/fetch")
      .then(received => {
        dispatch({
          type: FETCH_SUCCESS,
          cards: received.data,
          loading: false,
        });
      })
      .catch(err => {
        dispatch(alert('OOPS! Something went wrong with fetchList. Please check your code: ' + err.response.data.message, 'warning'));
      });
  };
}

/**
 * filterCards
 * @param list (unfiltered list of all cards in the schoolido.lu card database)
 *
 */
export function filterCards(list) {
  const now = new Date();
  const filtered_list = [];
  const latest = list.filter(card => {
    const dateVals = card.release_date.split('-');
    const releaseYear = Number(dateVals[0]);
    const releaseMonth = Number(dateVals[1]) - 1;
    const releaseDay = Number(dateVals[2]);
    const releaseUnixTime = new Date(releaseYear, releaseMonth, releaseDay);
    return now.getTime() - releaseUnixTime.getTime() <= 1209600000 ;  // 2 weeks
  });
  latest.forEach(json_data => {
    let card = new Card(json_data);
    filtered_list.push(card);
  });
  return (dispatch) => {
    dispatch({
      type: CARDS_FILTERED,
      filtered_list: filtered_list,
    })
  }
}

// REDUCER
const stateDefault = {
  cards: {},
  filtered_list: [],
  loading: false,
};

const handleFetchStarted = (state, action) => ({
  ...state,
  cards: {},
  loading: action.loading,
});

const handleFetchSuccess = (state, action) => ({
  ...state,
  cards: action.cards,
  loading: action.loading,
});

const handleFilterCards = (state, action) => ({
  ...state,
  filtered_list: action.filtered_list,
});

export default function reducer(state = stateDefault, action) {
  switch (action.type) {
    case FETCH_STARTED:
      return handleFetchStarted(state, action);
    case FETCH_SUCCESS:
      return handleFetchSuccess(state, action);
    case CARDS_FILTERED:
      return handleFilterCards(state, action);
    default:
      return state;
  }
}

