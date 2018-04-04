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
class UserAppContainer extends PureComponent {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <Dashboard/>
      )
    } else {
      return (
        <Login />
      );
    }
  }
}

UserAppContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};


function mapStateToProps(state) {
  return {
    isLoggedIn: !!(state.user.user && state.user.user.id),
  };
}

export default connect(
  mapStateToProps
)(UserAppContainer);
