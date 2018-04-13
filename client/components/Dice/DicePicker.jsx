'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { rollDice, addDice, clearDice } from '../../modules/dice';

class DicePicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAddDice = this.handleAddDice.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleRoll = this.handleRoll.bind(this);
  }

  render() {
    const dice = this.props.dice.map((die, index) => {
      return (
        <code key={index}>d{die}</code>
      )
    });
    return (
      <div className="container-fluid">
        <section>
          <button className="btn btn-small btn-primary" onClick={() => this.handleAddDice(4)}>d4</button>
          <button className="btn btn-small btn-secondary" onClick={() => this.handleAddDice(6)}>d6</button>
          <button className="btn btn-small btn-success" onClick={() => this.handleAddDice(8)}>d8</button>
          <button className="btn btn-small btn-danger" onClick={() => this.handleAddDice(10)}>d10</button>
          <button className="btn btn-small btn-warning" onClick={() => this.handleAddDice(12)}>d12</button>
          <button className="btn btn-small btn-info" onClick={() => this.handleAddDice(20)}>d20</button>
        </section>
        <section>
          <h3>Your dice:</h3>
          {dice}
        </section>
        <section>
          <button className="btn btn-small btn-success" onClick={this.handleRoll}>Roll!</button>
          <button className="btn btn-small btn-info" onClick={this.handleClear}>Clear</button>
        </section>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.dispatch(clearDice());
  }

  handleAddDice(size) {
    this.props.dispatch(addDice(size));
  }

  handleClear() {
    this.props.dispatch(clearDice());
  }

  handleRoll() {
    this.props.dispatch(rollDice(this.props.dice));
  }
}

DicePicker.propTypes = {
  dice: PropTypes.array,
};
DicePicker.defaultProps = {
  dice: [],
};

const mapStateToProps = (state, ownProps) => {
  return {
    dice: state.dice.dice,
  };
};

export default connect(mapStateToProps)(DicePicker);
