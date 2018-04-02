'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dashboard from './Dashboard.jsx';

import Login from './Login.jsx';

/**
 * Containing component under all routes for /user
 *
 * This top level component should only manage the organization of the components beneath it!
 */
class User extends PureComponent {
  render() {
    if (this.props.isLoggedIn) {
      const props = {

      };
      return (
        <Dashboard {...props} />
      )
    } else {
      return (
        <Login />
      );
    }
  }
}

User.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};


function mapStateToProps(state) {
  return {
    isLoggedIn: false,
  };
}

export default connect(
  mapStateToProps
)(User);
