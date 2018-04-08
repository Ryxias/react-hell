'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DicePicker from './DicePicker.jsx';
import DiceRollDisplayContainer from './DiceRollDisplayContainer.jsx';

class DiceAppContainer extends React.PureComponent {
  render() {
    return (
      <div>
        <DicePicker/>
        <DiceRollDisplayContainer/>
      </div>
    );
  }
}

DiceAppContainer.propTypes = {

};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps)(DiceAppContainer);
