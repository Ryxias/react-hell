'use strict';

const axios = require('axios');

const ACTIONS = require('./gossip_actions');
const { alert } = require('./alert_action_creators');

function loadGossipIndex(page_number, page_size) {
  return (dispatch, ownState) => {
    dispatch({
      type: ACTIONS.LOAD_MANY_GOSSIPS_START
    });

    return axios.get('/api/gossips' + '?' + `page=${page_number}` + '&' + `page_size=${page_size}`)
      .then(response => {
        const data = response.data;
        dispatch({
          type: ACTIONS.LOAD_MANY_GOSSIPS_SUCCESS,
          gossips: data.items,
          page: data.page,
          page_size: data.page_size,
          page_count: data.page_count,
        });
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.LOAD_MANY_GOSSIPS_FAIL,
          message,
          err,
        });
        // What do we do?
      });
  };
}

function loadGossip(id) {
  return (dispatch, ownState) => {
    dispatch({
      type: ACTIONS.ADD_GOSSIP_START,
    });

    return axios.get(`/api/gossips/${id}`)
      .then(response => {
        dispatch({
          type: ACTIONS.ADD_GOSSIP_SUCCESS,
          gossip: response.data.gossip,
          id,
        });
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.ADD_GOSSIP_FAIL,
          id,
          message,
          err,
        });
        // What do we do?
      });
  };
}

function deleteGossip(id) {
  return (dispatch, ownState) => {
    dispatch({
      type: ACTIONS.DELETE_GOSSIP_START,
    });

    return axios.delete(`/api/gossips/${id}`)
      .then(response => {
        dispatch({
          type: ACTIONS.DELETE_GOSSIP_SUCCESS,
          id,
        });
        dispatch(alert(response.data.message, 'success'));
      })
      .catch(err => {
        const message = err.response.data.message;
        dispatch({
          type: ACTIONS.DELETE_GOSSIP_FAIL,
          id,
          message,
          err,
        });
        dispatch(alert(message, 'warning'));
      });
  };
}

module.exports = {
  loadGossipIndex,
  loadGossip,
  deleteGossip,
};
