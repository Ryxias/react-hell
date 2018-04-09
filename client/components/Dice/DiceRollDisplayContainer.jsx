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
  return {};
};

export default connect(mapStateToProps)(DiceRollDisplayContainer);
