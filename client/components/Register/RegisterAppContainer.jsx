'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Register from './Register.jsx';

/**
 * Containing component under all routes for /user
 *
 * This top level component should only manage the organization of the components beneath it!
 */
class RegisterAppContainer extends PureComponent {
  render() {
    return <Register/>
  }
}

RegisterAppContainer.propTypes = {};


function mapStateToProps(state) {
  return {
  };
}

export default connect(
  mapStateToProps
)(RegisterAppContainer);
