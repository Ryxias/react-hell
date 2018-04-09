'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DiceRollDisplayContainer extends React.PureComponent {
  render() {
    return (
      <div>foo</div>
    );
  }
}

DiceRollDisplayContainer.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
  return {
    rolls: state.dice.rolls || [],
    total: state.dice.rolls ? state.dice.rolls.reduce((a, b) => a + b, 0) : 0,
  };
};

export default connect(mapStateToProps)(DiceRollDisplayContainer);
