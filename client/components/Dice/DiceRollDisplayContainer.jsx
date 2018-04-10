'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DiceRollDisplayContainer extends React.PureComponent {
  render() {
    if (!this.props.hasResults) {
      return null;
    }

    const rolls = this.props.rolls.map((roll, index) => {
      return (
        <code key={index}>{roll}</code>
      );
    });

    const cheeky_commentary = (() => {
      switch (this.props.variance_type) {
        case 'good_roll':
          return <p>Nice!</p>;
        case 'bad_roll':
          return <p>Ouch.</p>;
        case 'very_good_roll':
          return <p>Wow!</p>;
        case 'very_bad_roll':
          return <p>RIP. Hope that wasn't a save</p>;
        default:
          return null;
      }
    })();

    return (
      <div className="container-fluid">
        <h3>Your rolls</h3>
        <p>{rolls}</p>

        {cheeky_commentary}

        <h3>Total: {this.props.total}</h3>
      </div>
    );
  }
}

DiceRollDisplayContainer.propTypes = {
  hasResults: PropTypes.bool.isRequired,
  rolls: PropTypes.array,
  total: PropTypes.number,

  variance_type: PropTypes.oneOf(['good_roll', 'very_good_roll', 'bad_roll', 'very_bad_roll', null]),
};
DiceRollDisplayContainer.defaultTypes = {
  rolls: PropTypes.array,
  total: PropTypes.number,
  variance_type: false,
};

const mapStateToProps = (state, ownProps) => {
  const rolls = state.dice.rolls || [];

  const variance_type = (() => {
    if (state.dice.very_high_variance) {
      return state.dice.negative_variance ? 'very_bad_roll' : 'very_good_roll';
    } else if (state.dice.high_variance) {
      return state.dice.negative_variance ? 'bad_roll' : 'good_roll';
    }
    return null;
  })();

  return {
    hasResults: rolls.length > 0,
    rolls,
    total: rolls.reduce((a, b) => a + b, 0),
    variance_type,
  };
};

export default connect(mapStateToProps)(DiceRollDisplayContainer);
