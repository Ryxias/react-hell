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
        <section className="container-fluid">
          <DicePicker/>
        </section>
        <section className="container-fluid">
          <DiceRollDisplayContainer/>
        </section>
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
