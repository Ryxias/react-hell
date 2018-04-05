'use strict';

const GOSSIP_ACTIONS = require('../actions/gossip_actions');


function gossip(state = null, action) {
  switch (action.type) {
    case GOSSIP_ACTIONS.ADD_GOSSIP_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isAdding = true;

      return newState;

      break;
    }
    case GOSSIP_ACTIONS.ADD_GOSSIP_SUCCESS: {
      // we got a gacha card, save it into the redux state
      // and display the pretty envelope
      const { gossip, id } = action;

      const newState = Object.assign({}, state);
      newState.isAdding = false;
      // FIXME (derek) what do we do here?
      return newState;

      break;
    }

    case GOSSIP_ACTIONS.DELETE_GOSSIP_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isDeleting = true;
      newState.deletingId = action.id;

      return newState;
      break;
    }
    case GOSSIP_ACTIONS.DELETE_GOSSIP_FAIL:
    case GOSSIP_ACTIONS.DELETE_GOSSIP_SUCCESS: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isDeleting = false;

      return newState;
      break;
    }

    case GOSSIP_ACTIONS.LOAD_MANY_GOSSIPS_START: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = true;

      return newState;
      break;
    }
    case GOSSIP_ACTIONS.LOAD_MANY_GOSSIPS_SUCCESS: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = false;
      newState.gossips = action.items;

      return newState;
      break;
    }
    case GOSSIP_ACTIONS.LOAD_MANY_GOSSIPS_FAIL: {
      const newState = Object.assign({}, state); // clones the old "state"
      newState.isLoadingIndex = false;

      return newState;
      break;
    }

    default:
      return state;
  }
}
module.exports = gossip;
