'use strict';

const axios = require('axios');
const { alert } = require('./alert');


// Actions
const ADD_GOSSIP_START = 'gossip/ADD_GOSSIP_START';
const ADD_GOSSIP_SUCCESS = 'gossip/ADD_GOSSIP_SUCCESS';
const ADD_GOSSIP_FAIL = 'gossip/ADD_GOSSIP_FAIL';

const DELETE_GOSSIP_START = 'gossip/DELETE_GOSSIP_START';
const DELETE_GOSSIP_SUCCESS = 'gossip/DELETE_GOSSIP_SUCCESS';
const DELETE_GOSSIP_FAIL = 'gossip/DELETE_GOSSIP_FAIL';

const LOAD_MANY_GOSSIPS_START = 'gossip/LOAD_MANY_GOSSIPS_START';
const LOAD_MANY_GOSSIPS_SUCCESS = 'gossip/LOAD_MANY_GOSSIPS_SUCCESS';
const LOAD_MANY_GOSSIPS_FAIL = 'gossip/LOAD_MANY_GOSSIPS_FAIL';


// Action Creators
export function loadGossipIndex(page_number, page_size) {
  return (dispatch, ownState) => {
    dispatch({
      type: LOAD_MANY_GOSSIPS_START
    });

    return axios.get('/api/gossips' + '?' + `page=${page_number}` + '&' + `page_size=${page_size}`)
      .then(response => {
        const data = response.data;
        dispatch({
          type: LOAD_MANY_GOSSIPS_SUCCESS,
          gossips: data.items,
          page: data.page,
          page_size: data.page_size,
          page_count: data.page_count,
        });
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: LOAD_MANY_GOSSIPS_FAIL,
          message,
          err,
        });
        // What do we do?
      });
  };
}

export function loadGossip(id) {
  return (dispatch, ownState) => {
    dispatch({
      type: ADD_GOSSIP_START,
    });

    return axios.get(`/api/gossips/${id}`)
      .then(response => {
        dispatch({
          type: ADD_GOSSIP_SUCCESS,
          gossip: response.data.gossip,
          id,
        });
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ADD_GOSSIP_FAIL,
          id,
          message,
          err,
        });
        // What do we do?
      });
  };
}

export function deleteGossip(id) {
  return (dispatch, ownState) => {
    dispatch({
      type: DELETE_GOSSIP_START,
    });

    return axios.delete(`/api/gossips/${id}`)
      .then(response => {
        dispatch({
          type: DELETE_GOSSIP_SUCCESS,
          id,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: DELETE_GOSSIP_FAIL,
          id,
          message,
          err,
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // Add Gossip
    // FIXME (underconstruction)
    case ADD_GOSSIP_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isAdding = true;

      return newState;
    }
    case ADD_GOSSIP_SUCCESS: {
      // we got a gacha card, save it into the redux state
      // and display the pretty envelope
      const { gossip, id } = action;

      const newState = Object.assign({}, state);
      newState.isAdding = false;
      // FIXME (derek) what do we do here?
      return newState;
    }

    // Delete Gossip
    case DELETE_GOSSIP_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isDeleting = true;
      newState.deletingId = action.id;

      return newState;
    }
    case DELETE_GOSSIP_FAIL:
    case DELETE_GOSSIP_SUCCESS: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isDeleting = false;

      return newState;
    }

    // Load whole page of gossips
    case LOAD_MANY_GOSSIPS_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = true;

      return newState;
    }
    case LOAD_MANY_GOSSIPS_SUCCESS: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = false;
      newState.gossips = action.gossips;
      newState.page = action.page;
      newState.page_count = action.page_count;

      return newState;
    }
    case LOAD_MANY_GOSSIPS_FAIL: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = false;

      return newState;
    }

    default:
      return state;
  }
}
