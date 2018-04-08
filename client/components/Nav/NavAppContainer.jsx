'use strict';

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import NavTop from './NavTop.jsx';

/**
 * Containing component for the header navbar
 */
class NavTopContainer extends PureComponent {
  render() {
    const props = {
      userAppText: this.props.isLoggedIn ? this.props.username : 'Login',
      time_active: this.props.time_active,
    };
    return (
      <NavTop {...props} />
    );
  }
}

NavTopContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  username: PropTypes.string,
};


function mapStateToProps(state) {
  return {
    isLoggedIn: !!(state.user && state.user.user && state.user.user.id),
    username: state.user && state.user.user && (state.user.user.username || state.user.user.email),
    time_active: state.clockReducer.time_active,
  };
}

export default connect(
  mapStateToProps
)(NavTopContainer);
