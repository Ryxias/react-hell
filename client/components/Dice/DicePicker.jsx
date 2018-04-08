'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DicePicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleAddDice = this.handleAddDice.bind(this);

    this.dice = {
      4: 0,
      6: 0,
      8: 0,
      10: 0,
      12: 0,
      20: 0,
    };
  }

  render() {
    return (
      <div>
        <button onClick={() => this.handleAddDice(4)}>d4</button>
        <button onClick={() => this.handleAddDice(6)}>d6</button>
        <button onClick={() => this.handleAddDice(8)}>d8</button>
        <button onClick={() => this.handleAddDice(10)}>d10</button>
        <button onClick={() => this.handleAddDice(12)}>d12</button>
        <button onClick={() => this.handleAddDice(20)}>d20</button>
      </div>
    );
  }

  handleAddDice(size) {

  }

}

DicePicker.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(DicePicker);
